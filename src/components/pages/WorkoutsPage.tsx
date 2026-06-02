import { useEffect, useMemo, useState } from 'react'
import { getCurrentUser, mobilityLabel } from '../../lib/auth'
import {
  sortWorkoutsForUser,
  workoutMatchesCategory,
  workoutMatchesMobility,
  WORKOUT_CATEGORIES,
  workouts,
} from '../../lib/workouts'
import type { WorkoutCategory } from '../../data/workouts'
import { mobilityLevels } from '../../data/site'
import type { WorkoutProgram } from '../../data/workouts'
import { CategoryBadges } from '../workouts/CategoryBadges'
import { PageShell } from '../ui/PageShell'

interface WorkoutsPageProps {
  onNavigate: (path: string) => void
}

export function WorkoutsPage({ onNavigate }: WorkoutsPageProps) {
  const user = getCurrentUser()
  const [mobilityFilter, setMobilityFilter] = useState<string>(
    user?.mobility && user.mobility !== '' ? user.mobility : 'all',
  )
  const [categoryFilter, setCategoryFilter] = useState<WorkoutCategory | 'all'>('all')

  useEffect(() => {
    if (user?.mobility) setMobilityFilter(user.mobility)
  }, [user?.mobility])

  const sorted = useMemo(
    () => sortWorkoutsForUser(workouts, user?.mobility),
    [user?.mobility],
  )

  const filtered = useMemo(() => {
    return sorted.filter((w) => {
      const mobilityOk =
        mobilityFilter === 'all' ||
        (w.mobility as readonly string[]).includes(mobilityFilter)
      const categoryOk = workoutMatchesCategory(w, categoryFilter)
      return mobilityOk && categoryOk
    })
  }, [sorted, mobilityFilter, categoryFilter])

  const recommended = useMemo(
    () =>
      user?.mobility
        ? sorted.filter((w) => workoutMatchesMobility(w, user.mobility))
        : [],
    [sorted, user?.mobility],
  )

  const showRecommended =
    recommended.length > 0 && mobilityFilter === 'all' && categoryFilter === 'all'

  return (
    <PageShell
      title="Adaptive Workouts"
      description={
        user?.mobility
          ? `Programs matched to ${mobilityLabel(user.mobility)} appear first. Each workout is tagged with training categories and includes a guided video.`
          : 'Browse programs by training category and mobility level. Each workout includes a guided video and modifications for how you move.'
      }
    >
      {user?.mobility && mobilityFilter === user.mobility && categoryFilter === 'all' && (
        <p className="mb-6 rounded-xl border border-octane-600/30 bg-octane-950/40 px-4 py-3 text-sm text-octane-200">
          Showing programs suited for <strong>{mobilityLabel(user.mobility)}</strong>. Filter by
          category or mobility below.
        </p>
      )}

      {showRecommended && (
        <section className="mb-10" aria-labelledby="for-you-heading">
          <h2 id="for-you-heading" className="font-display text-lg font-bold text-white">
            Recommended for you
          </h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.slice(0, 3).map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                forYou
                onOpen={() => onNavigate(`/workouts/${workout.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      <section className="mb-8" aria-labelledby="category-filter-heading">
        <h2 id="category-filter-heading" className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Training category
        </h2>
        <div
          className="mt-3 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by training category"
        >
          <FilterButton active={categoryFilter === 'all'} onClick={() => setCategoryFilter('all')}>
            All categories
          </FilterButton>
          {WORKOUT_CATEGORIES.map((category) => (
            <FilterButton
              key={category}
              active={categoryFilter === category}
              onClick={() => setCategoryFilter(category)}
            >
              {category}
            </FilterButton>
          ))}
        </div>
      </section>

      <section className="mb-8" aria-labelledby="mobility-filter-heading">
        <h2 id="mobility-filter-heading" className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Mobility level
        </h2>
        <div
          className="mt-3 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by mobility level"
        >
          <FilterButton active={mobilityFilter === 'all'} onClick={() => setMobilityFilter('all')}>
            All levels
          </FilterButton>
          {mobilityLevels.map((level) => (
            <FilterButton
              key={level.id}
              active={mobilityFilter === level.id}
              onClick={() => setMobilityFilter(level.id)}
            >
              {level.icon} {level.label}
            </FilterButton>
          ))}
        </div>
      </section>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/20 p-8 text-center text-slate-400">
          No workouts match these filters. Try &quot;All categories&quot; or &quot;All levels&quot;,
          or complete your mobility profile on the{' '}
          <button
            type="button"
            className="font-medium text-octane-400 underline hover:text-octane-300"
            onClick={() => onNavigate('/join')}
          >
            Join
          </button>{' '}
          page.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              forYou={workoutMatchesMobility(workout, user?.mobility)}
              onOpen={() => onNavigate(`/workouts/${workout.id}`)}
            />
          ))}
        </div>
      )}
    </PageShell>
  )
}

function WorkoutCard({
  workout,
  forYou,
  onOpen,
}: {
  workout: WorkoutProgram
  forYou?: boolean
  onOpen: () => void
}) {
  return (
    <article className="card-hover card-surface flex flex-col p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full bg-brand-900/50 px-3 py-1 text-xs font-semibold text-brand-200">
          {workout.level}
        </span>
        <span className="text-sm text-slate-400">{workout.duration}</span>
      </div>
      {forYou && (
        <span className="mt-3 inline-flex w-fit rounded-full border border-vitality-500/40 bg-vitality-950/50 px-2.5 py-0.5 text-xs font-semibold text-vitality-300">
          Matches your profile
        </span>
      )}
      <h2 className="mt-3 text-xl font-bold text-white">{workout.title}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-300">{workout.description}</p>
      <p className="mt-3 text-xs text-slate-500">
        Video program · {workout.video.instructor}
      </p>
      <div className="mt-4">
        <CategoryBadges categories={workout.categories} />
      </div>
      <button
        type="button"
        className="btn-start-now touch-target mt-5 w-full py-3 text-sm"
        onClick={onOpen}
        aria-label={`Start ${workout.title} — open video program`}
      >
        Start program
      </button>
    </article>
  )
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`touch-target rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-brand-500 text-white'
          : 'bg-white/10 text-slate-200 hover:bg-white/20'
      }`}
    >
      {children}
    </button>
  )
}
