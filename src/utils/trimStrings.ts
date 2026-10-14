const PASSWORD_KEY_PATTERN = /password/i

/** Password values are treated as opaque — never trim them. */
export function isPasswordKey(key: string): boolean {
  return PASSWORD_KEY_PATTERN.test(key)
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

/**
 * Recursively trims leading and trailing whitespace from every string in a
 * value, descending through plain objects and arrays. Non-strings (numbers,
 * booleans, dates, files, FormData, …) are returned untouched, and any key for
 * which `shouldSkip` returns true is left exactly as it was.
 */
export function trimStringsDeep<T>(value: T, shouldSkip?: (key: string) => boolean): T {
  if (typeof value === 'string') {
    return value.trim() as T
  }

  if (Array.isArray(value)) {
    return value.map((item) => trimStringsDeep(item, shouldSkip)) as T
  }

  if (isPlainObject(value)) {
    const trimmed: Record<string, unknown> = {}
    for (const [key, nested] of Object.entries(value)) {
      trimmed[key] = shouldSkip?.(key) ? nested : trimStringsDeep(nested, shouldSkip)
    }
    return trimmed as T
  }

  return value
}
