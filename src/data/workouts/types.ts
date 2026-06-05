export type MobilityId = 'wheelchair' | 'limited' | 'adaptive' | 'ambulatory'

/** Standard training categories for every program in the library. */
export const WORKOUT_CATEGORIES = [
  'Strength',
  'Muscle Building',
  'Endurance',
  'Power & Explosiveness',
  'Functional Fitness',
  'Mobility & Stability',
  'Sports Performance',
  'Strength & Conditioning',
] as const

export type WorkoutCategory = (typeof WORKOUT_CATEGORIES)[number]

export interface WorkoutModification {
  mobility: MobilityId
  tips: string[]
}

export interface WorkoutProgram {
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
  video: {
    youtubeId: string
    title: string
    instructor: string
    channel: string
  }
  programOutline: string[]
  modifications: WorkoutModification[]
}

export const seatedBase: WorkoutModification[] = [
  {
    mobility: 'wheelchair',
    tips: [
      'Lock wheelchair brakes and remove armrests if they limit range of motion.',
      'Keep core gently engaged and spine tall throughout the session.',
    ],
  },
  {
    mobility: 'limited',
    tips: [
      'Use a firm chair with back support; keep feet grounded or on a stable footrest.',
      'Move within a pain-free range — pause the video to rest when needed.',
    ],
  },
]

export const hybridMods = (
  extra: Partial<Record<MobilityId, string[]>> = {},
): WorkoutModification[] =>
  [
    {
      mobility: 'wheelchair',
      tips: extra.wheelchair ?? seatedBase[0].tips,
    },
    {
      mobility: 'limited',
      tips: extra.limited ?? seatedBase[1].tips,
    },
    {
      mobility: 'adaptive',
      tips: extra.adaptive ?? [
        'Choose the seated or supported-standing option shown in the video.',
        'Add tempo or resistance only if form stays controlled.',
      ],
    },
    {
      mobility: 'ambulatory',
      tips: extra.ambulatory ?? [
        'Use chair or wall support for balance segments as demonstrated.',
        'Scale intensity by adjusting speed, range, or rest intervals.',
      ],
    },
  ] as WorkoutModification[]
