import type { InputHTMLAttributes } from 'react'

export function toE164Phone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  let national = digits
  if (national.startsWith('234') && national.length > 9) national = national.slice(3)
  else if (national.startsWith('0')) national = national.slice(1)
  return national ? `+234${national.slice(0, 10)}` : ''
}

type PhoneInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value' | 'type'
> & {
  value: string
  onChange: (value: string) => void
}

function PhoneInput({ value, onChange, className = '', ...rest }: PhoneInputProps) {
  const national = value.replace(/\D/g, '').replace(/^234/, '').slice(0, 10)
  const display = national
    ? [national.slice(0, 3), national.slice(3, 6), national.slice(6)]
        .filter(Boolean)
        .join(' ')
    : ''

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(toE164Phone(event.target.value))
  }

  return (
    <div
      className={`flex h-11 w-full items-center rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 text-sm text-slate-700 outline-none transition focus-within:border-brand ${className}`}
    >
      <span className="shrink-0 pr-2 text-sm text-slate-500">+234</span>
      <input
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        value={display}
        onChange={handleChange}
        placeholder="801 234 5678"
        className="w-full min-w-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        {...rest}
      />
    </div>
  )
}

export default PhoneInput