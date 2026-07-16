import StatCard from '../../shared/StatCard'

type HomeStat = {
  label: string
  value: string
  detail: string
  tone: string
  trend?: {
    value: number
    isUpward: boolean
  }
}

type HomeStatsSectionProps = {
  stats: HomeStat[]
  isLoading?: boolean
}

function HomeStatsSection({ stats, isLoading }: HomeStatsSectionProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          detail={stat.detail}
          detailClassName={stat.tone}
          trend={stat.trend}
          isLoading={isLoading}
          className="animate-stagger-fade"
          style={{ animationDelay: `${index * 80}ms` }}
        />
      ))}
    </section>
  )
}

export default HomeStatsSection
