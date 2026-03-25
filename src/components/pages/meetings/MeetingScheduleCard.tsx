import { ClockPlus } from 'lucide-react'

type MeetingScheduleCardProps = {
  onClick: () => void
}

function MeetingScheduleCard({ onClick }: MeetingScheduleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-80 flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-[#f8fbff] p-8 text-center transition hover:border-[#0f2d52] hover:bg-white sm:min-h-97.5"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf1ff] text-[#0f2d52]">
        <ClockPlus className="h-5 w-5 -rotate-90" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-[#0f2d52] group-hover:text-[#173c67]">
        Schedule New Meeting
      </h3>
      <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
        Define meeting type, time, and automated cutoff rules.
      </p>
    </button>
  )
}

export default MeetingScheduleCard
