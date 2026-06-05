import { useEffect, useMemo, useState } from 'react'
import { getCurrentUser, mobilityLabel } from '../../lib/auth'
import {
  buildWorkoutLibrarySections,
  getWorkoutsForMobilityCategory,
  MOBILITY_SCROLL_KEY,
  WORKOUT_LEVEL_FILTERS,
  workoutMatchesMobility,
  workouts,
  type MobilityId,
  type WorkoutCategory,
  type WorkoutLevelFilter,
  type WorkoutProgram,
} from '../../lib/workouts'
import { mobilityLevels } from '../../data/site'
import { PageShell } from '../ui/PageShell'

interface WorkoutsPageProps {
  onNavigate: (path: string) => void
}

const CATEGORY_BLURBS: Record<WorkoutCategory, string> = {
  Strength: 'Build force, control, and pushing/pulling power.',
  'Muscle Building': 'Higher volume work for lean muscle growth.',
  Endurance: 'Cardio, intervals, and aerobic base training.',
  'Power & Explosiveness': 'Fast, explosive movement for sport.',
  'Functional Fitness': 'Patterns for daily life and transfers.',
  'Mobility & Stability': 'Range of motion, balance, and recovery.',
  'Sports Performance': 'Court, track, and competition prep.',
  'Strength & Conditioning': 'Combined strength and conditioning blocks.',
}

export function WorkoutsPage({ onNavigate }: WorkoutsPageProps) {
  const user = getCurrentUser()

  const librarySections = useMemo(
    () => buildWorkoutLibrarySections(mobilityLevels, user?.mobility),
    [user?.mobility],
  )

  const defaultMobility = user?.mobility ?? librarySections[0]?.mobilityId ?? null

  const [selectedMobility, setSelectedMobility] = useState<MobilityId | null>(
    defaultMobility as MobilityId | null,
  )
  const [selectedCategory, setSelectedCategory] = useState<WorkoutCategory | null>(null)
  const [levelFilter, setLevelFilter] = useState<WorkoutLevelFilter>('all')

  const activeMobilitySection = librarySections.find(
    (s) => s.mobilityId === selectedMobility,
  )

  const filteredWorkouts = useMemo(() => {
    if (!selectedMobility || !selectedCategory) return []
    return getWorkoutsForMobilityCategory(selectedMobility, selectedCategory, levelFilter)
  }, [selectedMobility, selectedCategory, levelFilter])

  const recommended = useMemo(
    () =>
      user?.mobility
        ? workouts.filter((w) => workoutMatchesMobility(w, user.mobility)).slice(0, 3)
        : [],
    [user?.mobility],
  )

  useEffect(() => {
    const mobilityId = sessionStorage.getItem(MOBILITY_SCROLL_KEY)
    if (!mobilityId) return
    sessionStorage.removeItem(MOBILITY_SCROLL_KEY)
    if (librarySections.some((s) => s.mobilityId === mobilityId)) {
      setSelectedMobility(mobilityId as MobilityId)
      setSelectedCategory(null)
      setLevelFilter('all')
    }
  }, [librarySections])

  function selectMobility(mobilityId: MobilityId) {
    setSelectedMobility(mobilityId)
    setSelectedCategory(null)
    setLevelFilter('all')
  }

  function selectCategory(category: WorkoutCategory) {
    setSelectedCategory(category)
    setLevelFilter('all')
  }

  function resetToMobility() {
    setSelectedCategory(null)
    setLevelFilter('all')
  }

  function resetAll() {
    setSelectedMobility(defaultMobility as MobilityId | null)
    setSelectedCategory(null)
    setLevelFilter('all')
  }

  return (
    <PageShell
      title="Adaptive Workouts"
      description={`${workouts.length} video programs — pick your mobility level, then a training category, and filter by difficulty.`}
    >
      {user?.mobility && (
        <p className="mb-6 rounded-xl border border-octane-600/30 bg-octane-950/40 px-4 py-3 text-sm text-octane-200">
          Your profile: <strong>{mobilityLabel(user.mobility)}</strong> — highlighted below.
          Use the level filter after choosing a category to narrow programs.
        </p>
      )}

      {recommended.length > 0 && !selectedCategory && (
        <section className="mb-10" aria-labelledby="for-you-heading">
          <h2 id="for-you-heading" className="font-display text-lg font-bold text-white">
            Quick start — {mobilityLabel(user!.mobility!)}
          </h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((workout) => (
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

      {(selectedMobility || selectedCategory) && (
        <nav
          className="mb-6 flex flex-wrap items-center gap-2 text-sm"
          aria-label="Library path"
        >
          <button
            type="button"
            onClick={resetAll}
            className="touch-target rounded-lg px-2 py-1 text-octane-300 underline-offset-2 hover:text-white hover:underline"
          >
            All levels
          </button>
          {activeMobilitySection && (
            <>
              <span className="text-slate-600" aria-hidden="true">
                /
              </span>
              <button
                type="button"
                onClick={resetToMobility}
                className={
                  selectedCategory
                    ? 'touch-target rounded-lg px-2 py-1 text-octane-300 underline-offset-2 hover:text-white hover:underline'
                    : 'touch-target rounded-lg px-2 py-1 font-medium text-white'
                }
                aria-current={selectedCategory ? undefined : 'page'}
              >
                {activeMobilitySection.icon} {activeMobilitySection.label}
              </button>
            </>
          )}
          {selectedCategory && activeMobilitySection && (
            <>
              <span className="text-slate-600" aria-hidden="true">
                /
              </span>
              <span className="font-medium text-white">{selectedCategory}</span>
            </>
          )}
        </nav>
      )}

      <section aria-labelledby="mobility-picker-heading">
        <h2 id="mobility-picker-heading" className="sr-only">
          Choose mobility level
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {librarySections.map((section) => {
            const isSelected = selectedMobility === section.mobilityId
            const isUserSection = user?.mobility === section.mobilityId

            return (
              <button
                key={section.mobilityId}
                type="button"
                onClick={() => selectMobility(section.mobilityId)}
                aria-pressed={isSelected}
                className={`card-hover card-surface touch-target flex flex-col p-6 text-left transition-all ${
                  isSelected
                    ? 'ring-2 ring-octane-500/60 border-octane-500/40'
                    : 'border-transparent'
                } ${isUserSection && !isSelected ? 'border border-vitality-500/25' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-3xl" aria-hidden="true">
                    {section.icon}
                  </span>
                  {isUserSection && (
                    <span className="rounded-full border border-vitality-500/40 bg-vitality-950/50 px-2.5 py-0.5 text-xs font-semibold text-vitality-300">
                      Your level
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-white">
                  {section.label}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
                  {section.workoutCount} programs across{' '}
                  {section.categories.length} training categories
                </p>
                <span className="mt-4 text-sm font-medium text-octane-300">
                  {isSelected ? 'Selected' : 'View categories →'}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {activeMobilitySection && (
        <section className="mt-10" aria-labelledby="category-picker-heading">
          <h2
            id="category-picker-heading"
            className="font-display text-lg font-bold text-white"
          >
            <span className="mr-2" aria-hidden="true">
              {activeMobilitySection.icon}
            </span>
            {activeMobilitySection.label} — training categories
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {activeMobilitySection.categories.map((categorySection) => {
              const isSelected = selectedCategory === categorySection.category

              return (
                <button
                  key={categorySection.category}
                  type="button"
                  onClick={() => selectCategory(categorySection.category)}
                  aria-pressed={isSelected}
                  className={`card-hover card-surface touch-target flex flex-col p-5 text-left transition-all ${
                    isSelected ? 'ring-2 ring-brand-500/50' : ''
                  }`}
                >
                  <h3 className="text-base font-bold text-white">
                    {categorySection.category}
                  </h3>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-400">
                    {CATEGORY_BLURBS[categorySection.category]}
                  </p>
                  <p className="mt-3 text-sm font-medium text-slate-300">
                    {categorySection.workouts.length} programs
                  </p>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {selectedMobility && selectedCategory && activeMobilitySection && (
        <section className="mt-10" aria-labelledby="programs-heading">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 id="programs-heading" className="font-display text-xl font-bold text-white">
                {selectedCategory}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {activeMobilitySection.icon} {activeMobilitySection.label}
              </p>
            </div>
            <p className="text-sm text-slate-500">
              {filteredWorkouts.length}{' '}
              {filteredWorkouts.length === 1 ? 'program' : 'programs'}
            </p>
          </div>

          <div
            className="mt-5 flex flex-wrap gap-2"
            role="group"
            aria-label="Filter by difficulty"
          >
            {WORKOUT_LEVEL_FILTERS.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={levelFilter === option.id}
                onClick={() => setLevelFilter(option.id)}
                className={`touch-target rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  levelFilter === option.id
                    ? 'border-octane-500/50 bg-octane-950/60 text-white'
                    : 'border-white/15 bg-white/5 text-slate-300 hover:border-octane-500/30 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {filteredWorkouts.length === 0 ? (
            <p className="mt-8 rounded-xl border border-dashed border-white/20 p-8 text-center text-slate-400">
              No programs at this difficulty. Try another level or category.
            </p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredWorkouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  forYou={user?.mobility === selectedMobility}
                  onOpen={() => onNavigate(`/workouts/${workout.id}`)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {!selectedMobility && librarySections.length === 0 && (
        <p className="mt-8 rounded-xl border border-dashed border-white/20 p-8 text-center text-slate-400">
          No programs available yet.
        </p>
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
      <h4 className="mt-3 text-xl font-bold text-white">{workout.title}</h4>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-300">{workout.description}</p>
      <p className="mt-3 text-xs text-slate-500">
        Video program · {workout.video.instructor}
      </p>
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
