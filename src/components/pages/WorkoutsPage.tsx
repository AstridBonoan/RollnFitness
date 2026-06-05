import { useEffect, useMemo } from 'react'
import { getCurrentUser, mobilityLabel } from '../../lib/auth'
import {
  buildWorkoutLibrarySections,
  MOBILITY_SCROLL_KEY,
  workoutMatchesMobility,
  workouts,
} from '../../lib/workouts'
import { mobilityLevels } from '../../data/site'
import type { WorkoutProgram } from '../../data/workouts'
import { PageShell } from '../ui/PageShell'

interface WorkoutsPageProps {
  onNavigate: (path: string) => void
}

function scrollToMobilitySection(mobilityId: string) {
  const el = document.getElementById(`mobility-${mobilityId}`)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}

export function WorkoutsPage({ onNavigate }: WorkoutsPageProps) {
  const user = getCurrentUser()

  const librarySections = useMemo(
    () => buildWorkoutLibrarySections(mobilityLevels, user?.mobility),
    [user?.mobility],
  )

  const recommended = useMemo(
    () =>
      user?.mobility
        ? workouts.filter((w) => workoutMatchesMobility(w, user.mobility)).slice(0, 3)
        : [],
    [user?.mobility],
  )

  const libraryListings = librarySections.reduce((n, s) => n + s.workoutCount, 0)
  const uniquePrograms = workouts.length

  useEffect(() => {
    const mobilityId = sessionStorage.getItem(MOBILITY_SCROLL_KEY)
    if (!mobilityId) return
    sessionStorage.removeItem(MOBILITY_SCROLL_KEY)
    const frame = requestAnimationFrame(() => scrollToMobilitySection(mobilityId))
    return () => cancelAnimationFrame(frame)
  }, [librarySections])

  return (
    <PageShell
      title="Adaptive Workouts"
      description={`${uniquePrograms} video programs organized by how you move, then by training category. Each includes guided instruction and mobility-specific modifications.`}
    >
      <p className="mb-8 rounded-xl border border-octane-600/25 bg-octane-950/30 px-4 py-3 text-sm text-slate-300">
        <strong className="text-white">{uniquePrograms} unique programs</strong>
        {' · '}
        {libraryListings} listings across mobility levels and categories
      </p>
      {user?.mobility && (
        <p className="mb-6 rounded-xl border border-octane-600/30 bg-octane-950/40 px-4 py-3 text-sm text-octane-200">
          Your profile: <strong>{mobilityLabel(user.mobility)}</strong> — that section is listed
          first. Jump to any mobility level below.
        </p>
      )}

      <nav
        className="mb-10 flex flex-wrap gap-2"
        aria-label="Jump to mobility level"
      >
        {librarySections.map((section) => (
          <button
            key={section.mobilityId}
            type="button"
            onClick={() => scrollToMobilitySection(section.mobilityId)}
            className="touch-target rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-octane-500/40 hover:bg-octane-950/50 hover:text-white"
          >
            {section.icon} {section.label}
            <span className="ml-1.5 text-slate-500">({section.workoutCount})</span>
          </button>
        ))}
      </nav>

      {recommended.length > 0 && (
        <section className="mb-12" aria-labelledby="for-you-heading">
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

      <div className="space-y-14">
        {librarySections.map((mobilitySection) => {
          const isUserSection = user?.mobility === mobilitySection.mobilityId

          return (
            <section
              key={mobilitySection.mobilityId}
              id={`mobility-${mobilitySection.mobilityId}`}
              aria-labelledby={`mobility-heading-${mobilitySection.mobilityId}`}
              className={
                isUserSection
                  ? 'scroll-mt-28 rounded-3xl border border-octane-600/25 bg-octane-950/20 p-6 sm:p-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-octane-400'
                  : 'scroll-mt-28 focus:outline-none focus-visible:ring-2 focus-visible:ring-octane-400'
              }
            >
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-4">
                <h2
                  id={`mobility-heading-${mobilitySection.mobilityId}`}
                  className="font-display text-2xl font-bold text-white sm:text-3xl"
                >
                  <span className="mr-2" aria-hidden="true">
                    {mobilitySection.icon}
                  </span>
                  {mobilitySection.label}
                </h2>
                {isUserSection && (
                  <span className="rounded-full border border-vitality-500/40 bg-vitality-950/50 px-3 py-1 text-xs font-semibold text-vitality-300">
                    Your mobility level
                  </span>
                )}
              </div>

              <div className="mt-8 space-y-10">
                {mobilitySection.categories.map((categorySection) => (
                  <div
                    key={`${mobilitySection.mobilityId}-${categorySection.category}`}
                    aria-labelledby={`category-${mobilitySection.mobilityId}-${slugify(categorySection.category)}`}
                  >
                    <h3
                      id={`category-${mobilitySection.mobilityId}-${slugify(categorySection.category)}`}
                      className="text-sm font-semibold uppercase tracking-wider text-octane-300"
                    >
                      {categorySection.category}
                    </h3>
                    <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {categorySection.workouts.map((workout) => (
                        <WorkoutCard
                          key={`${mobilitySection.mobilityId}-${workout.id}`}
                          workout={workout}
                          forYou={isUserSection && !!user}
                          onOpen={() => onNavigate(`/workouts/${workout.id}`)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {libraryListings === 0 && (
        <p className="rounded-xl border border-dashed border-white/20 p-8 text-center text-slate-400">
          No programs available yet.
        </p>
      )}
    </PageShell>
  )
}

function slugify(category: string) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, '-')
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
