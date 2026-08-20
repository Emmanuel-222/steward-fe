import { DEPARTMENTS } from '../constants/departments'
import { stewardRoleOptions } from '../features/stewards/schema'

export type MatchResult = {
  value: string | null
  corrected: boolean
  from: string
  suggestion: string | null
}

const FUZZY_THRESHOLD = 0.6
const FUZZY_GAP = 0.15

const ROLE_ALIASES: Record<string, string> = {
  administrator: 'admin',
  lead: 'leader',
  head: 'leader',
  stewardess: 'steward',
}

const DEPARTMENT_ALIASES: Record<string, string> = {
  children: 'children dept.',
  teens: 'teens dept.',
  teen: 'teens dept.',
  'team 1': 'teamone',
  'team one': 'teamone',
  team1: 'teamone',
  light: 'light team',
  sanitation: 'sanitation dept.',
  edification: 'edification team',
  protocol: 'protocol dept.',
  welfare: 'welfare dept.',
  security: 'security dept.',
  programs: 'programs dept.',
  programme: 'programs dept.',
  programmes: 'programs dept.',
  alpha: 'alpha team',
  logistics: 'logistics and technical dept.',
  technical: 'logistics and technical dept.',
  tech: 'logistics and technical dept.',
  'logistics and technical': 'logistics and technical dept.',
  'logistics and technical dept': 'logistics and technical dept.',
}

export const DEPARTMENT_KEYS = DEPARTMENTS.map((d) => d.toLowerCase())
export const ROLE_KEYS = stewardRoleOptions.map((r) => r.toLowerCase())

export function normalizeKey(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, ' ')
}

function levenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) => [i, ...Array<number>(n).fill(0)])
  for (let j = 1; j <= n; j += 1) dp[0][j] = j
  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
    }
  }
  return dp[m][n]
}

function matchCanonical(
  raw: string,
  keys: readonly string[],
  options: readonly string[],
  aliases: Record<string, string> = {},
): MatchResult {
  const key = normalizeKey(raw)
  if (!key) return { value: null, corrected: false, from: raw, suggestion: null }
  const exactIndex = keys.indexOf(key)
  if (exactIndex >= 0) return { value: options[exactIndex], corrected: false, from: raw, suggestion: null }
  const alias = aliases[key]
  if (alias) {
    const aliasIndex = keys.indexOf(alias)
    return { value: options[aliasIndex], corrected: true, from: raw, suggestion: null }
  }
  const scored = keys
    .map((candidate, index) => ({
      option: options[index],
      similarity: 1 - levenshtein(key, candidate) / Math.max(key.length, candidate.length),
    }))
    .sort((a, b) => b.similarity - a.similarity)
  const best = scored[0]
  const second = scored[1]
  if (
    best &&
    best.similarity >= FUZZY_THRESHOLD &&
    (!second || best.similarity - second.similarity >= FUZZY_GAP)
  ) {
    return { value: best.option, corrected: true, from: raw, suggestion: null }
  }
  return { value: null, corrected: false, from: raw, suggestion: best ? best.option : null }
}

export function matchDepartment(raw: string): MatchResult {
  return matchCanonical(raw, DEPARTMENT_KEYS, DEPARTMENTS as readonly string[], DEPARTMENT_ALIASES)
}

export function matchRole(raw: string): MatchResult {
  return matchCanonical(raw, ROLE_KEYS, stewardRoleOptions as readonly string[], ROLE_ALIASES)
}
