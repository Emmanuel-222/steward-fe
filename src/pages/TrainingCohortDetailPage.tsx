import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import DashboardPageHeader from '../components/shared/DashboardPageHeader'
import ErrorState from '../components/ui/ErrorState'
import Skeleton from '../components/ui/Skeleton'
import GraduationStatusBadge from '../components/pages/training/GraduationStatusBadge'
import { useToast } from '../hooks/useToast'
import {
  useCohortClassesQuery,
  useCohortQuery,
  useGraduateTraineeMutation,
  useImportTraineesMutation,
  useSaveTopicMutation,
  useScheduleClassMutation,
  useTraineesQuery,
} from '../features/training/hooks/useTraining'

function TrainingCohortDetailPage() {
  const { id = '' } = useParams()
  const cohortQuery = useCohortQuery(id)
  const classesQuery = useCohortClassesQuery(id)
  const traineesQuery = useTraineesQuery(id)
  const saveTopic = useSaveTopicMutation(id)
  const scheduleClass = useScheduleClassMutation(id)
  const graduate = useGraduateTraineeMutation(id)
  const importMutation = useImportTraineesMutation(id)
  const { showToast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)

  const [week, setWeek] = useState('')
  const [topicTitle, setTopicTitle] = useState('')
  const [topicDesc, setTopicDesc] = useState('')

  const [clsDate, setClsDate] = useState('')
  const [clsStart, setClsStart] = useState('')
  const [clsEnd, setClsEnd] = useState('')
  const [clsLocation, setClsLocation] = useState('')
  const [clsTopic, setClsTopic] = useState('')

  if (cohortQuery.isLoading) return <Skeleton className="h-72" />
  if (cohortQuery.isError || !cohortQuery.data) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader title="Cohort" />
        <ErrorState message="We couldn't load this cohort." onRetry={() => cohortQuery.refetch()} />
      </div>
    )
  }

  const cohort = cohortQuery.data
  const topics = cohort.topics ?? []

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!week || !topicTitle) {
      showToast('Week number and title are required', 'error')
      return
    }
    try {
      await saveTopic.mutateAsync({
        weekNumber: Number(week),
        title: topicTitle,
        description: topicDesc || undefined,
      })
      showToast('Topic saved', 'success')
      setWeek('')
      setTopicTitle('')
      setTopicDesc('')
    } catch {
      showToast('Could not save topic', 'error')
    }
  }

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clsDate || !clsStart || !clsEnd || !clsLocation) {
      showToast('Date, start, end and location are required', 'error')
      return
    }
    try {
      await scheduleClass.mutateAsync({
        topicId: clsTopic ? Number(clsTopic) : null,
        date: clsDate,
        startTime: clsStart,
        endTime: clsEnd,
        location: clsLocation,
      })
      showToast('Class scheduled', 'success')
      setClsDate('')
      setClsStart('')
      setClsEnd('')
      setClsLocation('')
      setClsTopic('')
    } catch {
      showToast('Could not schedule class', 'error')
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const result = (await importMutation.mutateAsync(file)) as {
        imported?: number
        enrolled?: number
      }
      showToast(`Imported ${result.imported ?? 0}, enrolled ${result.enrolled ?? 0}`, 'success')
    } catch {
      showToast('Import failed', 'error')
    } finally {
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleGraduate = async (userId: number, name: string) => {
    try {
      await graduate.mutateAsync(userId)
      showToast(`${name} graduated and moved to worker`, 'success')
    } catch {
      showToast('Could not graduate trainee', 'error')
    }
  }

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title={cohort.name}
        description={`${cohort.weekCount} weeks · allowed missed classes: ${cohort.maxMissedClasses}${
          cohort.teacher?.fullName ? ` · Teacher: ${cohort.teacher.fullName}` : ''
        }`}
        actions={
          <Link to="/dashboard/training" className="text-sm font-semibold text-brand hover:underline">
            Back to cohorts
          </Link>
        }
      />

      {/* Curriculum */}
      <section className="rounded-card border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-brand">Curriculum</h2>
        <ul className="mt-4 space-y-2">
          {topics.length === 0 ? (
            <li className="text-sm text-slate-600">No topics yet.</li>
          ) : (
            topics.map((t) => (
              <li key={t.id} className="rounded-xl border border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-brand">Week {t.weekNumber}: {t.title}</p>
                {t.description ? <p className="text-sm text-slate-600">{t.description}</p> : null}
              </li>
            ))
          )}
        </ul>
        <form onSubmit={handleAddTopic} className="mt-5 grid gap-3 sm:grid-cols-[100px_1fr_1fr_auto]">
          <input value={week} onChange={(e) => setWeek(e.target.value)} type="number" min="1" placeholder="Week" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand" />
          <input value={topicTitle} onChange={(e) => setTopicTitle(e.target.value)} placeholder="Topic title" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand" />
          <input value={topicDesc} onChange={(e) => setTopicDesc(e.target.value)} placeholder="Description (optional)" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand" />
          <button type="submit" disabled={saveTopic.isPending} className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:opacity-60">Save</button>
        </form>
      </section>

      {/* Classes */}
      <section className="rounded-card border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-brand">Classes</h2>
        <ul className="mt-4 space-y-2">
          {(classesQuery.data ?? []).length === 0 ? (
            <li className="text-sm text-slate-600">No classes scheduled.</li>
          ) : (
            (classesQuery.data ?? []).map((c) => (
              <li key={c.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
                <span className="text-sm text-slate-700">
                  {new Date(c.meeting.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {c.meeting.startTime}–{c.meeting.endTime} · {c.meeting.location}
                </span>
                <span className="text-xs font-semibold text-slate-600">{c.topic ? `Week ${c.topic.weekNumber}` : 'No topic'}</span>
              </li>
            ))
          )}
        </ul>
        <form onSubmit={handleSchedule} className="mt-5 grid gap-3 sm:grid-cols-2">
          <select value={clsTopic} onChange={(e) => setClsTopic(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand">
            <option value="">Topic (optional)</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>Week {t.weekNumber}: {t.title}</option>
            ))}
          </select>
          <input value={clsLocation} onChange={(e) => setClsLocation(e.target.value)} placeholder="Location" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand" />
          <input value={clsDate} onChange={(e) => setClsDate(e.target.value)} type="date" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand" />
          <div className="flex gap-3">
            <input value={clsStart} onChange={(e) => setClsStart(e.target.value)} placeholder="Start e.g. 9:00 AM" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand" />
            <input value={clsEnd} onChange={(e) => setClsEnd(e.target.value)} placeholder="End e.g. 11:00 AM" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <button type="submit" disabled={scheduleClass.isPending} className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:opacity-60 sm:col-span-2 sm:justify-self-start">Schedule class</button>
        </form>
      </section>

      {/* Roster */}
      <section className="rounded-card border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-brand">Trainees</h2>
          <div className="flex items-center gap-3">
            <input ref={fileRef} type="file" accept=".csv" onChange={handleImport} className="text-xs text-slate-600" />
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-slate-600">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Missed</th>
                <th className="py-2 pr-4">Standing</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {(traineesQuery.data ?? []).map((t) => (
                <tr key={t.userId} className="border-t border-slate-100">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-600">{t.email}</p>
                  </td>
                  <td className="py-3 pr-4 text-slate-700">{t.missed} / {t.maxMissedClasses}</td>
                  <td className="py-3 pr-4"><GraduationStatusBadge status={t.graduation} /></td>
                  <td className="py-3 text-right">
                    {t.enrollmentStatus === 'enrolled' ? (
                      <button
                        type="button"
                        onClick={() => handleGraduate(t.userId, t.name)}
                        disabled={graduate.isPending || t.graduation === 'will_not_graduate'}
                        className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Graduate
                      </button>
                    ) : (
                      <span className="text-xs font-semibold uppercase text-slate-600">{t.enrollmentStatus}</span>
                    )}
                  </td>
                </tr>
              ))}
              {(traineesQuery.data ?? []).length === 0 ? (
                <tr><td colSpan={4} className="py-6 text-center text-sm text-slate-600">No trainees enrolled. Import a CSV above.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default TrainingCohortDetailPage
