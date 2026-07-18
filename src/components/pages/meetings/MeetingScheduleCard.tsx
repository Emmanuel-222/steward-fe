import { ClockPlus } from 'lucide-react'

type MeetingScheduleCardProps = {
  onClick: () => void
}

function MeetingScheduleCard({ onClick }: MeetingScheduleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-80 flex-col items-center justify-center rounded-card border border-dashed border-slate-300 bg-[#f8fbff] p-8 text-center transition hover:border-brand hover:bg-white sm:min-h-97.5"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf1ff] text-brand">
        <ClockPlus className="h-5 w-5 -rotate-90" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-brand group-hover:text-brand-hover">
        Schedule New Meeting
      </h3>
      <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
        Define meeting type, time, and automated cutoff rules.
      </p>
    </button>
  )
}

export default MeetingScheduleCard


