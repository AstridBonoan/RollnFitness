import {
  workouts,
  WORKOUT_CATEGORIES,
  type MobilityId,
  type WorkoutCategory,
  type WorkoutProgram,
} from '../data/workouts'

export function getWorkoutById(id: string): WorkoutProgram | undefined {
  return workouts.find((w) => w.id === id)
}

export const MOBILITY_SCROLL_KEY = 'rolln-scroll-mobility'

/** Legacy hash anchors like #mobility-adaptive break hash routing; normalize to /workouts. */
export function normalizeHashRoute(hashBody: string): string {
  const raw = hashBody || '/'
  if (raw.startsWith('/')) return raw

  if (raw.startsWith('mobility-')) {
    const mobilityId = raw.slice('mobility-'.length)
    sessionStorage.setItem(MOBILITY_SCROLL_KEY, mobilityId)
    return '/workouts'
  }

  return `/${raw}`
}

export function parseWorkoutRoute(pathname: string): string | null {
  const match = pathname.match(/^\/workouts\/([^/]+)$/)
  return match?.[1] ?? null
}

export function workoutMatchesCategory(
  workout: WorkoutProgram,
  category: WorkoutCategory | 'all',
): boolean {
  if (category === 'all') return true
  return workout.categories.includes(category)
}

export function workoutMatchesMobility(
  workout: WorkoutProgram,
  mobility: string | undefined,
): boolean {
  if (!mobility) return false
  return (workout.mobility as readonly string[]).includes(mobility)
}

export function sortWorkoutsForUser(
  list: readonly WorkoutProgram[],
  mobility: string | undefined,
): WorkoutProgram[] {
  if (!mobility) return [...list]

  return [...list].sort((a, b) => {
    const aMatch = workoutMatchesMobility(a, mobility) ? 1 : 0
    const bMatch = workoutMatchesMobility(b, mobility) ? 1 : 0
    return bMatch - aMatch
  })
}

export interface WorkoutCategorySection {
  category: WorkoutCategory
  workouts: WorkoutProgram[]
}

export interface WorkoutMobilitySection {
  mobilityId: MobilityId
  label: string
  icon: string
  categories: WorkoutCategorySection[]
  workoutCount: number
}

export function buildWorkoutLibrarySections(
  mobilityLevels: readonly { id: string; label: string; icon: string }[],
  priorityMobility?: string,
): WorkoutMobilitySection[] {
  const order = [...mobilityLevels].sort((a, b) => {
    if (!priorityMobility) return 0
    if (a.id === priorityMobility) return -1
    if (b.id === priorityMobility) return 1
    return 0
  })

  return order.map((level) => {
    const categories = WORKOUT_CATEGORIES.map((category) => ({
      category,
      workouts: workouts
        .filter(
          (w) =>
            (w.mobility as readonly string[]).includes(level.id) &&
            w.categories.includes(category),
        )
        .sort((a, b) => a.title.localeCompare(b.title)),
    })).filter((section) => section.workouts.length > 0)

    const workoutCount = categories.reduce((n, c) => n + c.workouts.length, 0)

    return {
      mobilityId: level.id as MobilityId,
      label: level.label,
      icon: level.icon,
      categories,
      workoutCount,
    }
  })
}

export { workouts, WORKOUT_CATEGORIES }
export type { MobilityId, WorkoutCategory, WorkoutProgram }
