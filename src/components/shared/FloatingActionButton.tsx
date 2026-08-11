import type { LucideIcon } from 'lucide-react'

type FloatingActionButtonProps = {
  icon: LucideIcon
  label: string
  onClick?: () => void
}

function FloatingActionButton({
  icon: Icon,
  label,
  onClick,
}: FloatingActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] right-4 z-30 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white shadow-[0_15px_35px_rgba(15,45,82,0.28)] transition hover:bg-brand-hover sm:bottom-[calc(env(safe-area-inset-bottom)+1.25rem)] sm:right-5"
      aria-label={label}
    >
      <Icon className="h-5 w-5" />
    </button>
  )
}

export default FloatingActionButton

