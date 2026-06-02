import { workouts, type MobilityId, type WorkoutProgram } from '../data/workouts'

export function getWorkoutById(id: string): WorkoutProgram | undefined {
  return workouts.find((w) => w.id === id)
}

export function parseWorkoutRoute(pathname: string): string | null {
  const match = pathname.match(/^\/workouts\/([^/]+)$/)
  return match?.[1] ?? null
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

export { workouts }
export type { MobilityId, WorkoutProgram }
