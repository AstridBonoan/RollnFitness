import { PageShell } from '../ui/PageShell'

const weeklyData = [
  { day: 'Mon', minutes: 25, completed: true },
  { day: 'Tue', minutes: 0, completed: false },
  { day: 'Wed', minutes: 30, completed: true },
  { day: 'Thu', minutes: 20, completed: true },
  { day: 'Fri', minutes: 0, completed: false },
  { day: 'Sat', minutes: 35, completed: true },
  { day: 'Sun', minutes: 15, completed: true },
]

const stats = [
  { label: 'Current streak', value: '5 days', icon: '🔥' },
  { label: 'Sessions this month', value: '12', icon: '✅' },
  { label: 'Total minutes', value: '340', icon: '⏱️' },
  { label: 'Personal best', value: '45 min', icon: '🏆' },
]

export function ProgressPage() {
  const maxMinutes = Math.max(...weeklyData.map((d) => d.minutes), 1)

  return (
    <PageShell
      title="Progress Tracking"
      description="Log sessions, celebrate streaks, and watch your strength and endurance grow over time. Full tracking launches with early access."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card-surface p-5">
            <span className="text-2xl" aria-hidden="true">{stat.icon}</span>
            <p className="mt-3 text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <section className="mt-10" aria-labelledby="weekly-chart-heading">
        <h2 id="weekly-chart-heading" className="text-xl font-bold text-white">
          This week
        </h2>
        <div
          className="mt-6 card-surface p-6"
          role="img"
          aria-label="Bar chart showing workout minutes per day this week: Monday 25, Wednesday 30, Thursday 20, Saturday 35, Sunday 15. Tuesday and Friday had no workouts."
        >
          <div className="flex items-end justify-between gap-2 sm:gap-4" style={{ height: '160px' }}>
            {weeklyData.map((day) => (
              <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end justify-center">
                  <div
                    className={`w-full max-w-[40px] rounded-t-lg transition-all ${
                      day.completed ? 'bg-vitality-500' : 'bg-carbon-600'
                    }`}
                    style={{
                      height: `${(day.minutes / maxMinutes) * 100}%`,
                      minHeight: day.minutes > 0 ? '8px' : '4px',
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-400">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="recent-heading">
        <h2 id="recent-heading" className="text-xl font-bold text-white">
          Recent sessions
        </h2>
        <ul className="mt-4 space-y-3">
          {[
            { name: 'Seated Cardio Blast', date: 'Today', duration: '20 min' },
            { name: 'Upper Body Power', date: 'Yesterday', duration: '25 min' },
            { name: 'Flexibility Flow', date: '2 days ago', duration: '15 min' },
          ].map((session) => (
            <li
              key={session.name + session.date}
              className="flex items-center justify-between card-surface px-5 py-4"
            >
              <div>
                <p className="font-semibold text-white">{session.name}</p>
                <p className="text-sm text-slate-400">{session.date}</p>
              </div>
              <span className="text-sm font-medium text-brand-400">{session.duration}</span>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  )
}
