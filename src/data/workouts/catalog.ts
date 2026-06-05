import type { WorkoutProgram } from './types'
import { EXPANDED_SPECS } from './catalog-expanded'
import { ORIGINAL_PROGRAMS } from './catalog-original'

/** Full workout library: 17 legacy programs + 105 expanded programs (122 total). */
export const workoutCatalog: WorkoutProgram[] = [
  ...ORIGINAL_PROGRAMS,
  ...EXPANDED_SPECS,
]
