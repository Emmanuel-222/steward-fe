# Engineering Concepts & Design Decisions

## 1. Global Search Architecture — Hybrid Search Strategy

**Concept:** Client-side vs Server-side search, hybrid architecture

**The Problem:** We needed a global search across multiple data types — stewards, meetings, departments, pages, and actions. Each data source has different characteristics:
- Stewards: large dataset, needs live filtering by department/role
- Meetings: moderate dataset, already cached client-side
- Departments: small static enum
- Pages/Actions: fully static

**Options considered:**
- **Fully server-side:** Query backend for everything. High latency, multiple roundtrips, backend search limited to exact/contains.
- **Fully client-side:** Fetch all data upfront, search in-memory. Works for small datasets but doesn't scale (stewards could grow large).
- **Hybrid (chosen):** Backend handles steward search (`GET /users/search/:name` with Prisma `contains` + `mode: insensitive`), Fuse.js handles meetings/departments client-side, static arrays handle pages/actions.

**Decision:** The hybrid approach gave us the best balance: scalable steward search (server-side), instant local filtering for smaller datasets (meetings, departments), and zero-cost for static data.

**Trade-off:** The steward search is limited to what the backend index supports (name, email, phone, department, role). We can't do fuzzy name matching client-side without downloading the full steward list.

---

## 2. Query Key Cache Collision — The `['meetings', 'list']` Bug

**Concept:** React Query cache key management, stale data across consumers

**The Problem:** `useGlobalSearch` used the same query key `['meetings', 'list']` as `useMeetingsQuery`. But:
- `useMeetingsQuery` cached `{ items: Meeting[], pagination: null }` (wrapped object)
- `useGlobalSearch` expected `Meeting[]` (flat array from `getMeetings()`)

Since they shared the same key, whichever hook wrote to the cache first determined the shape. If `useMeetingsQuery` wrote first, `useGlobalSearch` received `{ items, pagination }` as its data, and `meetings.length` was `undefined` — silently skipping the entire meeting types/statuses results block.

**Fix:** Isolated the global search meetings query with a unique key `['globalSearch', 'meetings', 'list']`.

**Lesson:** React Query cache keys are global — every consumer with the same key shares the same cache slot. If two consumers expect different data shapes under the same key, one will silently break. Always namespace query keys by their consumer context, not just the resource name.

---

## 3. Auth/RBAC — Department-Scoped Access Control

**Concept:** Role-based access control, data scoping, security through obscurity

**The Problem:** Different user roles need different visibility into the system:
- Admin: everything (read + write)
- Leader/Pastor: mostly read-only, but needs to see their department's data
- Steward: only their own records

The original implementation was too restrictive — `GET /attendance/user/:userId` returned 403 for anyone who wasn't admin or the user themselves. Leaders/pastors couldn't view attendance for stewards in their department.

**The approach (Option A — Limit scope everywhere):**
- `GET /users` — filter by department for leader/pastor (was leader-only, added pastor)
- `GET /users/search/:name` — added department filter for leader/pastor
- `GET /users/:id` — return 404 (not 403) for cross-department access
- `GET /attendance/user/:userId` — allow leader/pastor for their department
- `GET /attendance/meeting/:meetingId` — already properly filtered

**Design decision:** Return 404 instead of 403 on the user detail endpoint. This is "security through obscurity" — it prevents attackers from even discovering whether a cross-department user exists. A 403 tells them "I found the user but you can't access them," while 404 tells them nothing.

**Why not Option B (show all, restrict at detail level)?** Would cause inconsistent UX — find a steward in search, click through, then get 403 on their attendance tab. Confusing.

**Why not Option C (show with read-only label)?** Most complex implementation with marginal benefit. Leaders don't need to see data they can't act on.

---

## 4. Infinite Render Loop — `useSyncExternalStore` Pitfall

**Concept:** React 18 concurrent features, external store synchronization, render cycle management

**The Problem:** `useRecentSearches` used `useSyncExternalStore` to synchronize with `localStorage`. This caused an infinite render loop because:
1. `useSyncExternalStore` subscribes to an external store
2. Every render, the `getSnapshot` function was re-created (it read `localStorage`)
3. React detected a different snapshot on every render → re-render → re-read → loop

**Fix:** Replaced with `useState` + `useEffect` + `useRef` pattern:
- `useState` holds the current recents in memory
- `useEffect` reads from `localStorage` only on mount
- `useRef` guards against stale closure issues in callbacks
- Writes to `localStorage` happen as a side effect when state changes

**Lesson:** `useSyncExternalStore` is designed for external stores that notify React of changes (like Zustand, Redux). For `localStorage` (which doesn't notify), a simpler pattern works better. Not every external state source needs `useSyncExternalStore` — sometimes a well-placed `useEffect` is more predictable.

---

## 5. Debounced Search — Throttling User Input

**Concept:** Input debouncing, user experience vs. performance trade-offs

**The Problem:** The global search fires API calls and recomputes Fuse.js indexes on every keystroke. Without debouncing, a fast typist would trigger 10+ API calls while typing a single word.

**Implementation:** 150ms debounce on the steward search query. The visual results still update immediately from client-side Fuse.js (meetings, departments), but the backend steward search waits for the user to pause typing.

**Design decision:** The debounce is applied only to the API-bound search (stewards), not the client-side search. This gives the best UX — instant results for locally-searchable data, reduced server load for remote data.

```typescript
const [debouncedQuery, setDebouncedQuery] = useState('')
useEffect(() => {
  const timer = setTimeout(() => setDebouncedQuery(query), 150)
  return () => clearTimeout(timer)
}, [query])
```

---

## 6. Vulnerability Assessment — Understanding Real vs. Theoretical Risk

**Concept:** Dependency vulnerability analysis, attack surface evaluation, CVSS interpretation

**The Problem:** A security scanner reported 7 vulnerabilities. The instinct is to fix all of them. But many shipped advisories are scoped to specific usage patterns that may not apply.

**Our analysis:**
| Vulnerability | Affects us? | Why |
|---|---|---|
| form-data CRLF injection | Yes | Transitive dep via axios, version 4.0.5 < 4.0.6 |
| turbo-stream TYPE_ERROR → RCE | No | Framework Mode only; we use Data Mode |
| XSS in RSC redirect | No | Unstable RSC APIs only; not used |
| DoS via single-fetch | No | Framework Mode + Single Fetch only |
| DoS via `__manifest` | No | Framework Mode only |
| Stored XSS via Location header | No | Framework Mode + Pre-rendering only |
| CSRF bypass (non-POST) | No | Framework Mode's `handleDocumentRequest` only |

Every React Router advisory explicitly states: *"This does not impact your application if you are using Declarative Mode or Data Mode (`createBrowserRouter`/`<RouterProvider>`)."*

**Lesson:** Not every reported CVE is a real threat to every deployment. Understanding your attack surface — what features you actually use, what deployment mode you run — is essential before blindly upgrading. That said, the form-data vulnerability was real and we fixed it via `overrides`.

---

## 7. Git History Rewriting — `git filter-branch`

**Concept:** Git history manipulation, secret remediation, force-push etiquette

**The Problem:** A voice huddle session file `.pipa/voice-session/session.json` was accidentally committed in an earlier commit. Later commits deleted it, but GitGuardian detected it still existed in git history. Like deleting a file from a folder but leaving it in every backup tape.

**Fix:** `git filter-branch --index-filter` to remove the file from every commit in the affected range, then `git push --force-with-lease`.

```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch -r .pipa/ .env.production" \
  -- a58e5b1..HEAD
```

**Considerations:**
- `--force-with-lease` instead of `--force`: fails if someone else pushed to the branch, preventing accidental overwrite
- This rewrites history — anyone who cloned the old commits will have a divergent history
- On a PR branch (not main), this is acceptable. On shared branches, coordinate with the team
- `git filter-repo` (successor to filter-branch) is recommended for larger operations

**Prevention:** Added `.pipa/` and `.env.production` to `.gitignore`. For future work, pre-commit hooks with secret detection would catch this before it reaches the remote.

---

## 8. Meeting Status Computation — Client-side vs Server-side State

**Concept:** Computed vs stored state, temporal data correctness

**The Problem:** Meeting statuses (Ongoing/Upcoming/Completed) change with time. Storing them in the database means you need a cron job to update them. Computing them client-side means every user might see a slightly different status depending on clock skew.

**Our approach:** Hybrid — the backend stores an explicit `status` field (defaults to `"Ongoing"` on creation, can be set to `"Finalized"`), and the frontend normalizer computes the real-time status using date/time comparison:

```typescript
function normalizeStatus(rawMeeting) {
  // 1. If explicitly finalized, it's Completed
  if (explicitStatus === 'Completed') return 'Completed'
  // 2. If we have time data, compute based on now
  if (date && startTime && endTime) {
    const start = new Date(`${date}T${startTime}`)
    const end = new Date(`${date}T${endTime}`)
    if (now < start) return 'Upcoming'
    if (explicitStatus === 'Ongoing') return 'Ongoing'  // preserve live status
    if (now >= start && now <= end) return 'Ongoing'
    if (now > end) return 'Completed'
  }
  return explicitStatus || 'Completed'
}
```

**Why not store "Upcoming" / "Ongoing" in the DB?** Because it goes stale. A meeting scheduled for tomorrow is "Upcoming" today, "Ongoing" when it starts, and "Completed" when it ends. Computing this client-side means no cron jobs, no stale data, no async state reconciliation.

**Why fall back to explicit backend status?** For edge cases where time data is missing or malformed. Defense in depth.

---

## 9. Meeting List Ordering — Priority-based Sorting

**Concept:** Multi-level sort priority, user-centered information architecture

**The Problem:** Chronological ordering (ascending or descending) doesn't serve the user's needs. When you open the meetings page, you care most about what's happening now (Ongoing), then what's coming up (Upcoming), then what happened (Past).

**The solution — Priority groups with intra-group sorting:**

```
Ongoing  (priority 0) → sort by start time ascending
Upcoming (priority 1) → sort by date ascending (nearest first)
Past     (priority 2) → sort by date descending (most recent first)
```

```typescript
function sortMeetings(meetings) {
  const priority = { Ongoing: 0, Upcoming: 1, Completed: 2, Archived: 2 }
  return meetings.sort((a, b) => {
    const pa = priority[a.status] ?? 2
    const pb = priority[b.status] ?? 2
    if (pa !== pb) return pa - pb
    if (a.status === 'Ongoing') return a.rawStartTime.localeCompare(b.rawStartTime)
    if (a.status === 'Upcoming') return a.rawDate.localeCompare(b.rawDate)
    return b.rawDate.localeCompare(a.rawDate)
  })
}
```

**Design decision:** Apply sorting at the data layer (`getMeetings()`) rather than the presentation layer. This ensures consistent ordering everywhere — meetings page, homepage, attendance page, global search — without each consumer needing to reimplement.

**Edge case handling:**
- Archived meetings treated as "past" (priority 2) like Completed
- Within Ongoing: meetings sorted by when they start (earliest first), so if multiple are live, the one starting soonest appears first
- Within Upcoming: nearest deadline first — what the user needs to prepare for
- Within Past: most recent first — what's most likely to need review

---

## 10. Search Result Grouping — UX Patterns

**Concept:** Command palette UX, progressive disclosure, result categorization

**The Problem:** Global search returns mixed result types (stewards, meetings, departments). Showing them in a flat list is confusing.

**Solution — Grouped results with priority ordering:**
1. Stewards (most specific)
2. Departments (organizational context)
3. Meetings (upcoming events)
4. Pages (navigation)
5. Actions (quick commands)

Each group shows max 5 results. If a group has more results, a "View all N" link appears at the bottom of that group, navigating to the relevant page with the search query pre-filled.

**Design choices:**
- "View all" links pass `?search=<query>` in the URL so the target page can pre-filter
- Keyboard navigation (Arrow keys + Enter) follows the flat index, not grouped index — simpler mental model
- Recent searches are shown when the search bar is empty, providing a quick way to re-run previous searches
- Fuse.js threshold of 0.3 for strict matching on enumerations (departments, statuses), 0.4 for meeting titles (more forgiving)

---

## 11. Error Response Design — 403 vs 404

**Concept:** Information disclosure, security best practices for API design

**The Problem:** When a leader/pastor tries to access a cross-department user via URL, should we return 403 (Forbidden) or 404 (Not Found)?

**Decision:** 404. Here's why:
- A 403 response says: "The user exists, but you're not allowed to see them"
- A 404 response says: "That user doesn't exist" (ambiguous — could be wrong ID or no access)
- 404 prevents user enumeration attacks — an attacker can't distinguish "user exists but I can't see them" from "user doesn't exist"
- This is consistent with how many production APIs handle scoped resources (GitHub does this, AWS IAM does this)

**Trade-off:** Legitimate users who mistype a URL get a slightly less helpful error message. The trade-off is worth the security benefit.

---

## 12. Frontend Normalization as an Anti-corruption Layer

**Concept:** Anti-corruption layer, backend independence, data normalization

**The Problem:** The backend API returns raw Prisma objects with varying field names (`id` vs `_id`, `type` vs `meetingType`, `startTime` vs `start`, `fullName` vs `name`). Multiple backend versions or data sources could serve different shapes.

**Solution:** Every API module has a `normalize*` function that transforms raw backend data into a consistent frontend type:

```typescript
function normalizeMeeting(raw: Record<string, unknown>): Meeting {
  return {
    id: String(raw.id ?? raw.meetingId ?? raw._id ?? crypto.randomUUID()),
    title: String(raw.title ?? raw.type ?? 'Untitled Meeting'),
    status: normalizeStatus(raw),
    // ...
  }
}
```

**Advantages:**
- Backend can change its field names without breaking the frontend
- Default values handle missing data gracefully
- Type coercion ensures frontend types are always correct (e.g., `id` is always a string)
- The normalizer is the single source of truth for data shape transformation

**Cost:** Every new endpoint needs a normalizer. The normalizer must be kept in sync with backend changes.

---

## 13. Token Refresh Flow — Short-Lived Access Tokens with DB-Stored Refresh Token Rotation

**Concept:** JWT token lifecycle, rotation-based invalidation, silent authentication refresh

**The Problem:** The access token had a 24h expiry with no mechanism to refresh it. When it expired:
- `useAuth()` only checked `localStorage` existence (`Boolean(token)`) — not JWT `exp`
- Dashboard loaded with stale data; next API call got 401
- Axios interceptor cleared everything and redirected — jarring mid-session kick-out

**Options considered:**
- **Extend to 7 days:** Simplest but insecure — leaked token valid for a week
- **DB-stored refresh tokens (chosen):** Server-side revocation + rotation, random hex string (not JWT), stored in `RefreshToken` table
- **JWT-only refresh token:** Stateless, but no revocation; stolen token usable until expiry
- **httpOnly cookie:** Most secure, but requires cookie-parser + CORS domain configuration

**Decision:** DB-stored refresh tokens with rotation:
- Access token: `24h` → **6h** (reduces exposure window)
- Refresh token: **7 days**, stored as random hex in `RefreshToken` table (`token`, `userId`, `expiresAt`, `revoked`)
- Rotation: each refresh revokes the old token and issues a new one — stolen token becomes useless after one legitimate use
- Daily cron (`cron/cleanupTokens.js`) purges expired + revoked tokens older than 7 days
- `POST /logout` revokes the refresh token server-side
- `package.json` `postinstall` runs `prisma generate && prisma migrate deploy` for auto-migration on Render

**Frontend changes:**
- `useAuth()` decodes JWT payload via `atob()`, checks `exp * 1000 < Date.now()`. If expired → `localStorage.clear()`, `isAuthenticated: false` (user never sees dashboard with stale token)
- Axios response interceptor: on 401 → attempts `POST /auth/refresh`, stores new token pair, retries original request
- `isRefreshing` flag + `failedQueue` pattern: only one refresh request in flight; concurrent 401s wait for that single result
- Refresh endpoint itself is excluded from retry logic (infinite loop prevention)

**Trade-off:** Two DB writes per refresh (revoke old + create new). Acceptable for a small team (~4 refreshes/user/day with 6h tokens). If user base grows significantly, increase access token expiry or add DB indexing on `userId`.
