import StatCard from '../../shared/StatCard'

type AttendanceStat = {
  label: string
  value: string
  detail: string
  tone: string
  border: string
}

type AttendanceStatsSectionProps = {
  stats: AttendanceStat[]
}

function AttendanceStatsSection({ stats }: AttendanceStatsSectionProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          detail={stat.detail}
          detailClassName={stat.tone}
          className={stat.border}
        />
      ))}
    </section>
  )
}

export default AttendanceStatsSection
