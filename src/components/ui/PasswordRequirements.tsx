export const PASSWORD_POLICY_REGEX = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/

export const PASSWORD_POLICY_ERROR =
  'Use a stronger password: at least 8 characters, with an uppercase letter, a number, and a symbol'

const REQUIREMENTS = [
  { label: 'At least 8 characters', met: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', met: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', met: (p: string) => /[0-9]/.test(p) },
  { label: 'One symbol', met: (p: string) => /[^A-Za-z0-9]/.test(p) },
] as const

type PasswordRequirementsProps = {
  password: string
}

function PasswordRequirements({ password }: PasswordRequirementsProps) {
  return (
    <ul className="mt-2 space-y-1">
      {REQUIREMENTS.map((requirement) => {
        const satisfied = requirement.met(password)
        return (
          <li
            key={requirement.label}
            className={`flex items-center gap-2 text-xs transition-colors ${
              satisfied ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            <span
              className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px] leading-none ${
                satisfied
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : 'border-slate-300 text-transparent'
              }`}
            >
              ✓
            </span>
            {requirement.label}
          </li>
        )
      })}
    </ul>
  )
}

export default PasswordRequirements