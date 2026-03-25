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
      className="fixed bottom-4 right-4 z-30 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f2d52] text-white shadow-[0_15px_35px_rgba(15,45,82,0.28)] transition hover:bg-[#173c67] sm:bottom-5 sm:right-5"
      aria-label={label}
    >
      <Icon className="h-5 w-5" />
    </button>
  )
}

export default FloatingActionButton
