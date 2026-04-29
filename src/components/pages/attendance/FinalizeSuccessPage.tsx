import { CheckCircle2, FileText, LayoutDashboard, ShieldCheck } from 'lucide-react'

type FinalizeSuccessPageProps = {
  meetingTitle: string
  stats: {
    total: number
    present: number
    absent: number
    performance: number
  }
  onReturn: () => void
}

function FinalizeSuccessPage({
  meetingTitle,
  stats,
  onReturn,
}: FinalizeSuccessPageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600 shadow-[0_20px_50px_rgba(16,185,129,0.2)]">
        <CheckCircle2 className="h-12 w-12" />
      </div>

      <h1 className="text-4xl font-bold tracking-tight text-[#0f2d52]">
        Session Successfully Finalized
      </h1>
      <p className="mt-4 max-w-lg text-lg text-slate-500">
        The Digital Registrar has securely archived all attendance records and performance metrics for <span className="font-semibold text-slate-800">{meetingTitle}</span>.
      </p>

      <div className="mt-12 grid w-full max-w-4xl gap-6 sm:grid-cols-3">
        <div className="rounded-[28px] border border-slate-100 bg-white p-8 shadow-[0_15px_45px_rgba(15,23,42,0.05)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Final Present</p>
          <p className="mt-2 text-4xl font-bold text-[#0f2d52]">{stats.present}</p>
          <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-600">CONFIRMED</span>
        </div>

        <div className="rounded-[28px] border border-slate-100 bg-white p-8 shadow-[0_15px_45px_rgba(15,23,42,0.05)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-rose-400">Final Absent</p>
          <p className="mt-2 text-4xl font-bold text-[#0f2d52]">{stats.absent}</p>
          <span className="mt-2 text-[11px] font-medium text-slate-400">{stats.absent} marked as absent</span>
        </div>

        <div className="rounded-[28px] border border-slate-100 bg-white p-8 shadow-[0_15px_45px_rgba(15,23,42,0.05)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Performance</p>
          <p className="mt-2 text-4xl font-bold text-[#0f2d52]">{stats.performance}%</p>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
             <div 
               className="h-full bg-[#0f2d52] transition-all duration-1000" 
               style={{ width: `${stats.performance}%` }}
             />
          </div>
        </div>
      </div>

      <div className="mt-10 w-full max-w-4xl rounded-[32px] bg-slate-50 border border-slate-200/60 p-8 flex flex-col sm:flex-row items-center gap-6">
         <div className="h-20 w-24 rounded-2xl bg-slate-800 flex items-center justify-center text-white/20">
            <FileText className="h-10 w-10" />
         </div>
         <div className="flex-1 text-left">
            <h4 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Verification Complete
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
            </h4>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              The session data has been validated against global steward standards. A timestamped PDF ledger is ready for administrative review.
            </p>
            <div className="mt-4 flex items-center gap-6">
               <span className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Secure Audit
               </span>
               <span className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Cloud Synced
               </span>
            </div>
         </div>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl bg-[#0f2d52] px-8 py-4 text-sm font-bold text-white shadow-[0_15px_45px_rgba(15,45,82,0.25)] transition hover:bg-[#173c67]"
        >
          <FileText className="h-4 w-4" />
          View Detailed Report
        </button>
        <button
          type="button"
          onClick={onReturn}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 py-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
        >
          <LayoutDashboard className="h-4 w-4" />
          Return to Dashboard
        </button>
      </div>
      
      <p className="mt-12 text-[10px] font-medium uppercase tracking-[0.3em] text-slate-400">
        Registrar Reference ID: #RS-002-SESSION-FINAL
      </p>
    </div>
  )
}

export default FinalizeSuccessPage
