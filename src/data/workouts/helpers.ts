import type {
  MobilityId,
  WorkoutCategory,
  WorkoutModification,
  WorkoutProgram,
} from './types'
import { hybridMods, seatedBase } from './types'
import { getWorkoutVideo, type WorkoutVideoKey } from './videos'

export type ModsPreset = 'seated' | 'hybrid' | 'custom'

export interface WorkoutSpec {
  id: string
  title: string
  duration: string
  level: string
  mobility: MobilityId[]
  description: string
  categories: WorkoutCategory[]
  suitedFor: string
  equipment: string[]
  focus: string[]
  /** Video pool key or numeric index for rotation */
  video: WorkoutVideoKey | number
  programOutline: string[]
  mods?: ModsPreset | WorkoutModification[]
  hybridExtra?: Partial<Record<MobilityId, string[]>>
}

function resolveModifications(spec: WorkoutSpec): WorkoutModification[] {
  const mods = spec.mods
  if (Array.isArray(mods)) return mods
  if (mods === 'seated') return seatedBase
  if (mods === 'hybrid' || mods === undefined) {
    const onlySeatedPair =
      spec.mobility.length <= 2 &&
      spec.mobility.every((m) => m === 'wheelchair' || m === 'limited')
    if (onlySeatedPair && mods === undefined) return seatedBase
    return hybridMods(spec.hybridExtra)
  }
  return hybridMods(spec.hybridExtra)
}

export function workout(spec: WorkoutSpec): WorkoutProgram {
  const video = getWorkoutVideo(spec.video)
  return {
    id: spec.id,
    title: spec.title,
    duration: spec.duration,
    level: spec.level,
    mobility: spec.mobility,
    description: spec.description,
    categories: spec.categories,
    suitedFor: spec.suitedFor,
    equipment: spec.equipment,
    focus: spec.focus,
    video: {
      youtubeId: video.youtubeId,
      title: video.title,
      instructor: video.instructor,
      channel: video.channel,
    },
    programOutline: spec.programOutline,
    modifications: resolveModifications(spec),
  }
}
