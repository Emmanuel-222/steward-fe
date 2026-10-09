import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CalendarPlus, Download, GraduationCap, Plus, UserPlus } from 'lucide-react'
import DashboardPageHeader from '../components/shared/DashboardPageHeader'
import ErrorState from '../components/ui/ErrorState'
import Spinner from '../components/ui/Spinner'
import GraduationStatusBadge from '../components/pages/training/GraduationStatusBadge'
import TraineeImportModal from '../components/pages/training/TraineeImportModal'
import AddTraineeModal from '../components/pages/training/AddTraineeModal'
import { useToast } from '../hooks/useToast'
import useStewardsQuery from '../features/stewards/hooks/useStewardsQuery'
import type { AddTraineePayload } from '../features/training/api'
import {
  useAddTraineeMutation,
  useCohortClassesQuery,
  useCohortQuery,
  useGenerateSessionsMutation,
  useGraduateTraineeMutation,
  useImportTraineesMutation,
  useSaveTopicMutation,
  useSeedCurriculumMutation,
  useTraineesQuery,
} from '../features/training/hooks/useTraining'

type Tab = 'schedule' | 'trainees'

function TrainingCohortDetailPage() {
  const { id = '' } = useParams()
  const cohortQuery = useCohortQuery(id)
  const classesQuery = useCohortClassesQuery(id)
  const traineesQuery = useTraineesQuery(id)
  const saveTopic = useSaveTopicMutation(id)
  const generateSessions = useGenerateSessionsMutation(id)
  const seedCurriculum = useSeedCurriculumMutation(id)
  const graduate = useGraduateTraineeMutation(id)
  const importMutation = useImportTraineesMutation(id)
  const addTraineeMutation = useAddTraineeMutation(id)
  const { showToast } = useToast()
  const stewardsQuery = useStewardsQuery('')
  const teachers = (stewardsQuery.data?.items ?? []).filter(
    (s) => !['admin', 'trainee'].includes(s.role.toLowerCase()),
  )

  const [tab, setTab] = useState<Tab>('schedule')
  const [showImport, setShowImport] = useState(false)
  const [showAdd, setShowAdd] = useState(false)

  const [showSessionForm, setShowSessionForm] = useState(false)
  const [week, setWeek] = useState('')
  const [topicTitle, setTopicTitle] = useState('')
  const [topicDesc, setTopicDesc] = useState('')
  const [topicTeacher, setTopicTeacher] = useState('')
  const [topicStart, setTopicStart] = useState('7:10 AM')
  const [topicEnd, setTopicEnd] = useState('8:10 AM')
  const [reqNew, setReqNew] = useState(true)
  const [reqRef, setReqRef] = useState(false)

  if (cohortQuery.isLoading) return <Spinner />
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
  const classes = classesQuery.data ?? []
  const roster = traineesQuery.data ?? []

  const scheduledByTopic = new Map<number, { date: string; startTime: string; endTime: string; location: string }>()
  for (const c of classes) {
    if (c.topic) {
      scheduledByTopic.set(c.topic.id, {
        date: c.meeting.date,
        startTime: c.meeting.startTime,
        endTime: c.meeting.endTime,
        location: c.meeting.location,
      })
    }
  }
  const scheduledCount = scheduledByTopic.size

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!week || !topicTitle || !topicStart) {
      showToast('Week, title and start time are required', 'error')
      return
    }
    try {
      await saveTopic.mutateAsync({
        weekNumber: Number(week),
        title: topicTitle,
        description: topicDesc || undefined,
        teacherId: topicTeacher ? Number(topicTeacher) : null,
        startTime: topicStart,
        endTime: topicEnd || undefined,
        requiredForNew: reqNew,
        requiredForRefresher: reqRef,
      })
      showToast('Session added', 'success')
      setWeek('')
      setTopicTitle('')
      setTopicDesc('')
      setTopicTeacher('')
      setShowSessionForm(false)
    } catch {
      showToast('Could not save session', 'error')
    }
  }

  const handleSeed = async () => {
    try {
      const r = await seedCurriculum.mutateAsync()
      showToast(`Loaded ${r?.created ?? 0} session(s)`, 'success')
    } catch {
      showToast('Could not load the curriculum', 'error')
    }
  }

  const handleGenerate = async () => {
    try {
      const r = await generateSessions.mutateAsync()
      showToast(`Generated ${r?.created ?? 0} date(s)`, 'success')
    } catch {
      showToast('Could not generate dates', 'error')
    }
  }

  const handleImport = async (file: File) => {
    try {
      const result = (await importMutation.mutateAsync(file)) as {
        imported: number
        skipped: number
        defaultPassword?: string
        failures: { row: number; field: string; message: string }[]
      }
      showToast(`Imported ${result.imported}`, 'success')
      return result
    } catch {
      showToast('Import failed', 'error')
      return undefined
    }
  }

  const handleAddTrainee = async (values: AddTraineePayload) => {
    try {
      await addTraineeMutation.mutateAsync(values)
      showToast('Trainee added', 'success')
      setShowAdd(false)
    } catch {
      showToast('Could not add trainee', 'error')
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
    <div className="space-y-6">
      <DashboardPageHeader
        title={cohort.name}
        description={`${cohort.weekCount} weeks · allowed misses ${cohort.maxMissedClasses} · ${roster.length} trainee${roster.length === 1 ? '' : 's'}`}
        actions={
          <Link to="/dashboard/training" className="text-sm font-semibold text-brand hover:underline">
            Back to cohorts
          </Link>
        }
      />

      {/* Tabs */}
      <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1">
        {(['schedule', 'trainees'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-xl px-5 py-2 text-sm font-semibold capitalize transition ${
              tab === t ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'schedule' ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-brand">Schedule</h2>
              <p className="text-sm text-slate-600">
                {topics.length} session{topics.length === 1 ? '' : 's'} · {scheduledCount} dated
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSessionForm((v) => !v)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Plus className="h-4 w-4" /> Add session
              </button>
              <button
                type="button"
                onClick={handleSeed}
                disabled={seedCurriculum.isPending}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                <Download className="h-4 w-4" /> Load 2026 curriculum
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generateSessions.isPending || topics.length === 0}
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:opacity-60"
              >
                <CalendarPlus className="h-4 w-4" /> Generate dates
              </button>
            </div>
          </div>

          {showSessionForm ? (
            <form
              onSubmit={handleAddSession}
              className="grid gap-3 rounded-card border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2"
            >
              <input value={week} onChange={(e) => setWeek(e.target.value)} type="number" min="1" placeholder="Week" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand" />
              <input value={topicTitle} onChange={(e) => setTopicTitle(e.target.value)} placeholder="Topic title" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand" />
              <input value={topicStart} onChange={(e) => setTopicStart(e.target.value)} placeholder="Start e.g. 7:10 AM" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand" />
              <input value={topicEnd} onChange={(e) => setTopicEnd(e.target.value)} placeholder="End e.g. 8:10 AM" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand" />
              <select value={topicTeacher} onChange={(e) => setTopicTeacher(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand">
                <option value="">Teacher for this session</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} ({t.role})</option>
                ))}
              </select>
              <input value={topicDesc} onChange={(e) => setTopicDesc(e.target.value)} placeholder="Description (optional)" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand" />
              <div className="flex items-center gap-4 sm:col-span-2">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" checked={reqNew} onChange={(e) => setReqNew(e.target.checked)} /> Required for new
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" checked={reqRef} onChange={(e) => setReqRef(e.target.checked)} /> Required for refresher
                </label>
                <button type="submit" disabled={saveTopic.isPending} className="ml-auto rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:opacity-60">
                  Save session
                </button>
              </div>
            </form>
          ) : null}

          {topics.length === 0 ? (
            <div className="rounded-card border border-dashed border-slate-300 bg-[#f8fbff] p-10 text-center">
              <p className="text-sm font-semibold text-brand">No sessions yet</p>
              <p className="mt-1 text-sm text-slate-600">
                Load the 2026 curriculum to add all 18 sessions, or add them one by one.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {topics.map((t) => {
                const meeting = scheduledByTopic.get(t.id)
                return (
                  <li key={t.id} className="rounded-card border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-brand">
                          Week {t.weekNumber} · {t.title}
                        </p>
                        <p className="text-sm text-slate-600">
                          {t.day} {t.startTime}{t.endTime ? `–${t.endTime}` : ''}
                          {meeting
                            ? ` · ${new Date(meeting.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${meeting.location}`
                            : ' · not dated yet'}
                        </p>
                        <p className="mt-1 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
                          <span>{t.teacher?.fullName ? `Teacher: ${t.teacher.fullName}` : 'No teacher assigned'}</span>
                          {t.requiredForNew ? <span className="rounded-full bg-[#eef4ff] px-2 py-0.5 text-brand">new</span> : null}
                          {t.requiredForRefresher ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">refresher</span> : null}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          meeting ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {meeting ? 'Scheduled' : 'Unscheduled'}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      ) : (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-brand">Trainees</h2>
              <p className="text-sm text-slate-600">{roster.length} enrolled</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAdd(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <UserPlus className="h-4 w-4" /> Add trainee
              </button>
              <button
                type="button"
                onClick={() => setShowImport(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-hover"
              >
                <Download className="h-4 w-4" /> Import trainees
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-card border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-600">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Track</th>
                  <th className="px-4 py-3">Missed</th>
                  <th className="px-4 py-3">Standing</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {roster.map((t) => (
                  <tr key={t.userId} className="border-b border-slate-50 last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{t.name}</p>
                      <p className="text-xs text-slate-600">{t.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold capitalize text-slate-700">
                        {t.track}
                      </span>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-slate-700">
                      {t.missed} / {t.maxMissedClasses}
                    </td>
                    <td className="px-4 py-3">
                      <GraduationStatusBadge status={t.graduation} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      {t.enrollmentStatus === 'enrolled' ? (
                        <button
                          type="button"
                          onClick={() => handleGraduate(t.userId, t.name)}
                          disabled={graduate.isPending || t.graduation === 'will_not_graduate'}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <GraduationCap className="h-3.5 w-3.5" /> Graduate
                        </button>
                      ) : (
                        <span className="text-xs font-semibold uppercase text-slate-600">
                          {t.enrollmentStatus}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {roster.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-600">
                      No trainees yet. Add one or import a CSV.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <TraineeImportModal
        open={showImport}
        onClose={() => setShowImport(false)}
        onSubmit={handleImport}
        isSubmitting={importMutation.isPending}
      />
      <AddTraineeModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={handleAddTrainee}
        isSubmitting={addTraineeMutation.isPending}
      />
    </div>
  )
}

export default TrainingCohortDetailPage
