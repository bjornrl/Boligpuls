interface StatsCardsProps {
  stats: {
    label: string
    value: number
    color?: string
  }[]
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl p-5"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #EDEBE8',
          }}
        >
          <p className="text-sm font-medium mb-1" style={{ color: '#78716C' }}>
            {stat.label}
          </p>
          <p
            className="text-3xl font-bold"
            style={{ color: stat.color || '#1C1917', fontFamily: 'var(--font-outfit)' }}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  )
}
