import StatCard from '../../shared/StatCard'

type HomeStat = {
  label: string
  value: string
  detail: string
  tone: string
}

type HomeStatsSectionProps = {
  stats: HomeStat[]
}

function HomeStatsSection({ stats }: HomeStatsSectionProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          detail={stat.detail}
          detailClassName={stat.tone}
        />
      ))}
    </section>
  )
}

export default HomeStatsSection
