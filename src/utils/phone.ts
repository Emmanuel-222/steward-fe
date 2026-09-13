export function toE164Phone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  let national = digits
  if (national.startsWith('234') && national.length > 9) national = national.slice(3)
  else if (national.startsWith('0')) national = national.slice(1)
  return national ? `+234${national.slice(0, 10)}` : ''
}
