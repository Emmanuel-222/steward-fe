import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Clock3,
  Download,
  Filter,
  Mail,
  Phone,
  ShieldCheck,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Steward } from '../../../features/stewards/types'
import { useStewardAttendanceQuery, useStewardDetailQuery } from '../../../features/stewards/hooks/useStewardsQuery'
import AttendanceFilterModal from './AttendanceFilterModal'

type StewardProfileViewProps = {
  stewardId: string
  initialSteward: Steward
  onBack: () => void
  onEdit: (steward: Steward) => void
}

const statusToneMap: Record<string, string> = {
  Present: 'bg-emerald-100 text-emerald-700',
  Absent: 'bg-rose-100 text-rose-700',
  Excused: 'bg-slate-100 text-slate-600',
  Unknown: 'bg-slate-100 text-slate-600',
}

function StewardProfileView({
  stewardId,
  initialSteward,
  onBack,
  onEdit,
}: StewardProfileViewProps) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const detailQuery = useStewardDetailQuery(stewardId)
  const attendanceQuery = useStewardAttendanceQuery(stewardId)
  const steward = detailQuery.data ?? initialSteward
  const attendanceSummary = attendanceQuery.data?.summary ?? {
    total: 0,
    present: 0,
    absent: 0,
  }
  const attendanceHistory = attendanceQuery.data?.records ?? []
  const attendanceRate =
    attendanceSummary.total > 0
      ? Math.round((attendanceSummary.present / attendanceSummary.total) * 100)
      : 0

  useEffect(() => {
    if (!isFilterModalOpen) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFilterModalOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFilterModalOpen])

  return (
    <>
      <div className="space-y-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Directory
        </button>

      <section className="grid gap-5 xl:grid-cols-[1.8fr_0.9fr]">
        <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-[#0f2d52] text-xl font-semibold text-white sm:h-20 sm:w-20 sm:text-2xl">
                {steward.initials}
              </div>

              <div className="min-w-0 space-y-3">
                <div>
                  <h2 className="break-words text-2xl font-semibold text-[#0f2d52] sm:text-3xl">
                    {steward.name}
                  </h2>
                  <p className="mt-1 inline-flex max-w-full items-center gap-2 rounded-full bg-[#eef6ff] px-3 py-1 text-sm font-medium text-[#4f6b9a]">
                    <Building2 className="h-4 w-4 shrink-0" />
                    {steward.department} Department
                  </p>
                </div>

                <div className="grid gap-3 text-sm text-slate-500 sm:grid-cols-2">
                  <span className="inline-flex min-w-0 items-start gap-2">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <span className="break-all sm:break-normal">{steward.email}</span>
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                    <span>{steward.phone}</span>
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
                    <span>Joined: {steward.dateAdded}</span>
                  </span>
                </div>
              </div>
            </div>

          <button
            type="button"
            onClick={() => onEdit(steward)}
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#22c55e] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#16a34a] md:w-auto"
            >
              Edit
            </button>
          </div>
        </article>

        <article className="rounded-[28px] bg-[#0f2d52] p-5 text-white shadow-[0_18px_55px_rgba(15,45,82,0.18)] sm:p-6">
          <p className="text-sm font-semibold">Availability Status</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Active Duty
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-200">
            {steward.name.split(' ')[0]} is currently assigned to the Main Hall
            service for the upcoming roster.
          </p>
          <button
            type="button"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#0f2d52] transition hover:bg-slate-100"
          >
            Update Schedule
          </button>
        </article>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef3ff] text-[#0f2d52]">
              <CalendarDays className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Total Year
            </span>
          </div>
          <p className="mt-6 text-4xl font-semibold text-[#0f2d52]">
            {attendanceSummary.total}
          </p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Total Meetings
          </p>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold text-emerald-600">
              {attendanceRate}%
            </span>
          </div>
          <p className="mt-6 text-4xl font-semibold text-[#0f2d52]">
            {attendanceSummary.present}
          </p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Present
          </p>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <Clock3 className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold text-rose-600">
              {attendanceSummary.total > 0 ? 100 - attendanceRate : 0}%
            </span>
          </div>
          <p className="mt-6 text-4xl font-semibold text-[#0f2d52]">
            {attendanceSummary.absent}
          </p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Absent
          </p>
        </article>
      </section>

      <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <h3 className="text-xl font-semibold text-[#0f2d52]">
            Attendance History
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-slate-500 transition hover:bg-slate-50"
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-slate-500 transition hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {attendanceQuery.isLoading ? (
          <div className="px-4 py-10 text-center text-sm text-slate-500 sm:px-6">
            Loading attendance history...
          </div>
        ) : attendanceQuery.isError ? (
          <div className="px-4 py-10 text-center text-sm text-rose-600 sm:px-6">
            Unable to load attendance history right now.
          </div>
        ) : attendanceHistory.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-slate-500 sm:px-6">
            No attendance records found for this steward yet.
          </div>
        ) : (
          <>
            <div className="space-y-3 p-4 sm:hidden">
              {attendanceHistory.map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-2xl border border-slate-100 bg-[#fcfdff] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800">{entry.meeting}</p>
                      <p className="mt-1 text-sm text-slate-500">{entry.date}</p>
                    </div>
                    <span
                      className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusToneMap[entry.status] ?? statusToneMap.Unknown}`}
                    >
                      {entry.status}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4 text-sm text-slate-500">
                    <span className="font-medium text-slate-400">Marked At</span>
                    <span>{entry.time}</span>
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden overflow-x-auto sm:block">
              <div className="min-w-[680px]">
                <div className="grid grid-cols-[1fr_1.2fr_0.8fr_0.8fr] gap-4 bg-[#f8fbff] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:px-6">
                  <p>Date</p>
                  <p>Meeting Type</p>
                  <p>Status</p>
                  <p>Marked At</p>
                </div>

                <div className="divide-y divide-slate-100">
                  {attendanceHistory.map((entry) => (
                    <div
                      key={entry.id}
                      className="grid grid-cols-[1fr_1.2fr_0.8fr_0.8fr] gap-4 px-4 py-4 text-sm text-slate-600 sm:px-6"
                    >
                      <p>{entry.date}</p>
                      <p>{entry.meeting}</p>
                      <p>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusToneMap[entry.status] ?? statusToneMap.Unknown}`}
                        >
                          {entry.status}
                        </span>
                      </p>
                      <p>{entry.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
        </section>
      </div>

      <AttendanceFilterModal
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </>
  )
}

export default StewardProfileView
