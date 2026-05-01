import { Bolt, Users } from 'lucide-react'

type RushModeBannerProps = {
  isActive: boolean
  onToggle: () => void
  expectedArrivals: number
  peakWindow: string
  checkinSpeed: number
  onViewLateList: () => void
  isShowingLateOnly: boolean
  meetingTitle?: string
}

function RushModeBanner({
  isActive,
  onToggle,
  expectedArrivals,
  peakWindow,
  checkinSpeed,
  onViewLateList,
  isShowingLateOnly,
  meetingTitle = 'Meeting',
}: RushModeBannerProps) {
  if (!isActive) return null

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-[#0f2d52] p-5 text-white shadow-[0_20px_50px_rgba(15,45,82,0.25)] sm:p-6">
      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
            <Bolt className="h-6 w-6 text-yellow-400 fill-yellow-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight">{meetingTitle} Rush Mode Active</h3>
            <p className="text-sm text-slate-300">
              Rapid check-in enabled. Peak arrival window: <span className="font-semibold text-white">{peakWindow}</span>.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-3 pr-6 backdrop-blur-sm border border-white/10">
             <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Expected Arrivals</p>
                <p className="text-2xl font-bold">{expectedArrivals} <span className="text-sm font-medium text-slate-400">Stewards</span></p>
             </div>
             <button 
                type="button"
                onClick={onViewLateList}
                className={[
                  "rounded-xl px-4 py-2 text-sm font-bold transition",
                  isShowingLateOnly ? "bg-rose-500 text-white" : "bg-white/10 hover:bg-white/20 text-white"
                ].join(' ')}
             >
                {isShowingLateOnly ? 'Exit Late List' : 'View Late List'}
             </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
         <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md border border-white/5">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-wider text-slate-200">
               LIVE FLOW INSIGHT: <span className="text-white ml-1">Check-in speed is currently {checkinSpeed} stewards/min.</span>
            </p>
         </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-indigo-500/10 blur-3xl" />
    </div>
  )
}

export default RushModeBanner
