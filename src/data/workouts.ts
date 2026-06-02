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

const seatedBase: WorkoutModification[] = [
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

const hybridMods = (
  extra: Partial<Record<MobilityId, string[]>> = {},
): WorkoutModification[] => [
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

export const workouts: WorkoutProgram[] = [
  {
    id: 'upper-power',
    title: 'Upper Body Power',
    duration: '25 min',
    level: 'Beginner',
    mobility: ['wheelchair', 'limited'],
    description: 'Build shoulder and arm strength with resistance bands or dumbbells.',
    categories: ['Strength', 'Muscle Building'],
    suitedFor: 'Wheelchair users and anyone training upper-body strength from a seated position.',
    equipment: ['Sturdy chair', 'Light dumbbells or wrist weights (optional)'],
    focus: ['Chest', 'Shoulders', 'Back', 'Arms'],
    video: {
      youtubeId: 'Dtybibe4lTg',
      title: 'Upper Body Workout for Wheelchair Users',
      instructor: 'John Reams',
      channel: 'NCHPAD',
    },
    programOutline: [
      'Warm-up: posture and shoulder mobility',
      'Chest and shoulder strength circuits',
      'Back and arm finishers with adaptive options',
    ],
    modifications: seatedBase,
  },
  {
    id: 'seated-cardio',
    title: 'Seated Cardio Blast',
    duration: '20 min',
    level: 'All levels',
    mobility: ['wheelchair', 'limited'],
    description: 'Raise your heart rate with seated punches, arm circles, and intervals.',
    categories: ['Endurance'],
    suitedFor: 'Individuals who need cardiovascular training without standing.',
    equipment: ['Sturdy chair', 'Water nearby'],
    focus: ['Heart rate', 'Endurance', 'Upper-body cardio'],
    video: {
      youtubeId: 't4T8Q0Qpt7Q',
      title: '10 Minute Fun Wheelchair Cardio Workout',
      instructor: 'Paul Eugene',
      channel: 'Paul Eugene',
    },
    programOutline: [
      'Rhythmic arm patterns and seated boxing',
      'Cardio intervals at your pace',
      'Cool-down stretch and breathing',
    ],
    modifications: seatedBase,
  },
  {
    id: 'core-stability',
    title: 'Core & Stability',
    duration: '30 min',
    level: 'Intermediate',
    mobility: ['wheelchair', 'limited', 'ambulatory'],
    description: 'Strengthen your core for better posture, balance, and everyday movement.',
    categories: ['Mobility & Stability', 'Functional Fitness', 'Strength'],
    suitedFor: 'Anyone building trunk stability for transfers, posture, and daily movement.',
    equipment: ['Chair or mat', 'Small pillow (optional)'],
    focus: ['Deep core', 'Posture', 'Stability'],
    video: {
      youtubeId: 'JrOqddDts8A',
      title: 'Seated Abs & Core — 15 Minute Chair Workout',
      instructor: 'Coach-led',
      channel: 'Senior Fitness',
    },
    programOutline: [
      'Breathing and core activation',
      'Low-impact abdominal sequences',
      'Stability finishers with seated modifications',
    ],
    modifications: hybridMods(),
  },
  {
    id: 'flexibility-flow',
    title: 'Flexibility Flow',
    duration: '15 min',
    level: 'All levels',
    mobility: ['wheelchair', 'limited', 'adaptive', 'ambulatory'],
    description: 'Gentle stretches to improve range of motion and reduce stiffness.',
    categories: ['Mobility & Stability'],
    suitedFor: 'All mobility levels recovering from stiffness or long periods of sitting.',
    equipment: ['Chair'],
    focus: ['Range of motion', 'Posture', 'Relaxation'],
    video: {
      youtubeId: 'alLO7fitqIk',
      title: 'Flexibility Workout for Wheelchair Users',
      instructor: 'John Reams',
      channel: 'NCHPAD',
    },
    programOutline: [
      'Upper-back and shoulder stretches',
      'Trunk and hip mobility',
      'Full-range arm circles with modifications',
    ],
    modifications: hybridMods({
      adaptive: ['Hold each stretch 20–30 seconds; never force painful range.'],
    }),
  },
  {
    id: 'standing-balance',
    title: 'Standing Balance',
    duration: '20 min',
    level: 'Beginner',
    mobility: ['limited', 'ambulatory'],
    description: 'Supported balance exercises with chair or wall assistance.',
    categories: ['Mobility & Stability', 'Functional Fitness', 'Strength'],
    suitedFor: 'People who can stand with support and want safer balance practice.',
    equipment: ['Sturdy chair', 'Wall space (optional)'],
    focus: ['Balance', 'Leg strength', 'Confidence'],
    video: {
      youtubeId: 'Q5FCjvkTeWA',
      title: 'Easy Exercises to Improve Strength and Balance',
      instructor: 'Improved Health',
      channel: 'Improved Health',
    },
    programOutline: [
      'Supported sit-to-stand practice',
      'Calf raises and toe raises at the chair',
      'Balance challenges with light finger support only',
    ],
    modifications: [
      {
        mobility: 'limited',
        tips: [
          'Keep full hand contact on the chair until you feel steady.',
          'Perform shallow squats only if your clinician approves weight-bearing.',
        ],
      },
      {
        mobility: 'ambulatory',
        tips: [
          'Progress to one-hand support when balance improves.',
          'Stop if you feel dizzy — resume seated work and hydrate.',
        ],
      },
    ],
  },
  {
    id: 'adaptive-hiit',
    title: 'Adaptive HIIT',
    duration: '35 min',
    level: 'Advanced',
    mobility: ['adaptive', 'ambulatory'],
    description: 'High-intensity intervals with modifications for every movement pattern.',
    categories: ['Endurance', 'Power & Explosiveness', 'Strength & Conditioning'],
    suitedFor: 'Adaptive athletes ready for interval training with seated or standing options.',
    equipment: ['Chair', 'Light weights (optional)', 'Timer'],
    focus: ['Power', 'Cardio', 'Conditioning'],
    video: {
      youtubeId: 'OTjmwg0nc80',
      title: '45-min Seated HIIT Cardio & Dumbbell Strength',
      instructor: 'Paul Eugene',
      channel: 'Paul Eugene',
    },
    programOutline: [
      'Interval warm-up',
      'HIIT blocks with work/rest timing',
      'Strength and abs finisher — follow seated modifications as needed',
    ],
    modifications: [
      {
        mobility: 'adaptive',
        tips: [
          'Stay seated for all high-impact segments; add resistance only if form stays sharp.',
          'Shorten work intervals (e.g., 20s on / 40s off) when starting out.',
        ],
      },
      {
        mobility: 'ambulatory',
        tips: [
          'Use standing intervals only when balance is secure; otherwise remain seated.',
          'Monitor heart rate and stop if you feel chest pain or unusual dizziness.',
        ],
      },
    ],
  },
  {
    id: 'push-endurance',
    title: 'Wheelchair Push Endurance',
    duration: '30 min',
    level: 'Intermediate',
    mobility: ['wheelchair', 'adaptive'],
    description: 'Build pushing stamina with interval drills, tempo work, and recovery pacing.',
    categories: ['Endurance', 'Sports Performance'],
    suitedFor: 'Manual wheelchair users building sport and daily pushing endurance.',
    equipment: ['Wheelchair', 'Open space or treadmill (optional)'],
    focus: ['Push power', 'Cardio endurance', 'Recovery pacing'],
    video: {
      youtubeId: 'EgxvOKIA08Y',
      title: 'Wheelchair Cardio Boxing — 26-Minute Adaptive Workout',
      instructor: 'Paul Eugene',
      channel: 'Paul Eugene',
    },
    programOutline: [
      'Upper-body cardio activation',
      'Boxing-style intervals for push endurance',
      'Stretch and heart-rate recovery',
    ],
    modifications: [
      {
        mobility: 'wheelchair',
        tips: [
          'Focus on smooth push mechanics during arm-driving segments.',
          'On indoor days, mimic push patterns with boxing drills as shown.',
        ],
      },
      {
        mobility: 'adaptive',
        tips: [
          'Pair this session with outdoor push drills on alternate days when possible.',
          'Track perceived exertion — you should be able to speak short sentences during work sets.',
        ],
      },
    ],
  },
  {
    id: 'grip-pull',
    title: 'Grip & Pull Strength',
    duration: '22 min',
    level: 'Beginner',
    mobility: ['wheelchair', 'limited'],
    description: 'Strengthen hands, forearms, and lats for transfers, daily tasks, and sport.',
    categories: ['Strength', 'Muscle Building', 'Functional Fitness'],
    suitedFor: 'Users who need stronger grip and pulling strength for transfers and equipment.',
    equipment: ['Resistance band', 'Sturdy anchor point'],
    focus: ['Grip', 'Lats', 'Posture'],
    video: {
      youtubeId: 'XED_wcHsYCo',
      title: 'Resistance Band Lat Pull Down for Wheelchair Users',
      instructor: 'NCHPAD',
      channel: 'NCHPAD',
    },
    programOutline: [
      'Band setup and shoulder positioning',
      'Lat pull-down technique (repeat circuit with video)',
      'Grip endurance finishers — towel squeeze between sets',
    ],
    modifications: [
      {
        mobility: 'wheelchair',
        tips: [
          'Lock brakes; loop band overhead on a door anchor or helper-held band at safe height.',
          'Repeat the pull pattern for 3 sets of 10–12 after practicing form with the video.',
        ],
      },
      {
        mobility: 'limited',
        tips: [
          'Use a firm chair; keep shoulders down during pulls.',
          'Pair with towel-grip squeezes between sets for hand strength.',
        ],
      },
    ],
  },
  {
    id: 'morning-energizer',
    title: 'Quick Morning Energizer',
    duration: '12 min',
    level: 'All levels',
    mobility: ['wheelchair', 'limited', 'adaptive', 'ambulatory'],
    description: 'A short wake-up routine with breathwork, mobility, and light cardio.',
    categories: ['Endurance', 'Mobility & Stability'],
    suitedFor: 'Anyone wanting a brief daily routine to wake up the body.',
    equipment: ['Chair'],
    focus: ['Energy', 'Mobility', 'Breathing'],
    video: {
      youtubeId: 't4T8Q0Qpt7Q',
      title: '10 Minute Fun Wheelchair Cardio Workout',
      instructor: 'Paul Eugene',
      channel: 'Paul Eugene',
    },
    programOutline: [
      'Light mobility and breath',
      'Short cardio burst',
      'Gentle stretch to start the day',
    ],
    modifications: hybridMods({
      wheelchair: [
        'Perfect as a daily starter — stop at 10 minutes if short on time.',
        'Lock brakes before arm cardio segments.',
      ],
    }),
  },
  {
    id: 'seated-yoga-reset',
    title: 'Seated Yoga Reset',
    duration: '25 min',
    level: 'All levels',
    mobility: ['wheelchair', 'limited', 'adaptive'],
    description: 'Slow flows and holds to release tension in hips, spine, and shoulders.',
    categories: ['Mobility & Stability'],
    suitedFor: 'Recovery days and stress relief for seated athletes.',
    equipment: ['Chair or wheelchair'],
    focus: ['Flexibility', 'Breath', 'Relaxation'],
    video: {
      youtubeId: 'FrVE1a2vgvA',
      title: 'Wheelchair Yoga — Gentle Chair Yoga Routine',
      instructor: 'Adriene Mishler',
      channel: 'Yoga With Adriene',
    },
    programOutline: [
      'Centering breath',
      'Gentle spinal and shoulder flows',
      'Closing relaxation',
    ],
    modifications: [
      ...seatedBase,
      {
        mobility: 'adaptive',
        tips: ['Skip poses that aggravate your injury site; substitute neutral seated posture.'],
      },
    ],
  },
  {
    id: 'neck-shoulder-release',
    title: 'Neck & Shoulder Release',
    duration: '18 min',
    level: 'All levels',
    mobility: ['wheelchair', 'limited', 'adaptive', 'ambulatory'],
    description: 'Ease desk and wheelchair posture strain with targeted mobility and stretching.',
    categories: ['Mobility & Stability'],
    suitedFor: 'Anyone with neck, shoulder, or upper-back tension from sitting.',
    equipment: ['Chair'],
    focus: ['Neck', 'Shoulders', 'Upper back'],
    video: {
      youtubeId: 'alLO7fitqIk',
      title: 'Seated Stretching for Mobility & Range of Motion',
      instructor: 'John Reams',
      channel: 'NCHPAD',
    },
    programOutline: [
      'Neck and upper-trap release',
      'Shoulder and chest openers',
      'Posture reset breathing',
    ],
    modifications: hybridMods(),
  },
  {
    id: 'transfer-prep',
    title: 'Transfer Prep Strength',
    duration: '28 min',
    level: 'Intermediate',
    mobility: ['limited', 'ambulatory'],
    description: 'Functional pushing, pulling, and core work to make transfers safer and easier.',
    categories: ['Functional Fitness', 'Strength'],
    suitedFor: 'Individuals preparing for safer transfers and functional daily movement.',
    equipment: ['Sturdy chair', 'Resistance band (optional)'],
    focus: ['Push', 'Pull', 'Core bracing'],
    video: {
      youtubeId: 'nPhCNcJ8uJc',
      title: 'Seated Workout for Mobility Challenges',
      instructor: 'Coach Carolyn',
      channel: 'Powered to Move',
    },
    programOutline: [
      'Activation and warm-up',
      'Push/pull strength blocks',
      'Functional cool-down',
    ],
    modifications: [
      {
        mobility: 'limited',
        tips: [
          'Brace core before any forward reach mimicking a transfer.',
          'Practice near a bed or bench only with a caregiver if you are learning transfers.',
        ],
      },
      {
        mobility: 'ambulatory',
        tips: [
          'Add standing push-offs only when balance is confirmed by your care team.',
        ],
      },
    ],
  },
  {
    id: 'lower-body-seated',
    title: 'Lower Body (Seated Options)',
    duration: '26 min',
    level: 'Beginner',
    mobility: ['wheelchair', 'limited', 'ambulatory'],
    description: 'Leg and hip work with seated, supported standing, and band variations.',
    categories: ['Strength', 'Muscle Building'],
    suitedFor: 'Users training legs from seated or supported-standing positions.',
    equipment: ['Chair', 'Resistance band (optional)'],
    focus: ['Hips', 'Legs', 'Stability'],
    video: {
      youtubeId: 'nPhCNcJ8uJc',
      title: 'Seated Workout — Build Muscle from a Chair',
      instructor: 'Coach Carolyn',
      channel: 'Powered to Move',
    },
    programOutline: [
      'Seated leg activation',
      'Strength circuits with modifications',
      'Supported standing options when appropriate',
    ],
    modifications: hybridMods(),
  },
  {
    id: 'breath-core-calm',
    title: 'Breath & Core Calm',
    duration: '20 min',
    level: 'All levels',
    mobility: ['wheelchair', 'limited', 'adaptive', 'ambulatory'],
    description: 'Diaphragmatic breathing paired with gentle core activation for recovery days.',
    categories: ['Mobility & Stability'],
    suitedFor: 'Recovery days, stress management, and gentle core re-activation.',
    equipment: ['Chair'],
    focus: ['Breathing', 'Core awareness', 'Relaxation'],
    video: {
      youtubeId: '5FxIbzvdBzA',
      title: 'Inclusive Yoga for Spinal Cord Injury',
      instructor: 'NCHPAD',
      channel: 'NCHPAD',
    },
    programOutline: [
      'Breath-led centering',
      'Gentle core engagement',
      'Restorative closing — follow seated options throughout',
    ],
    modifications: hybridMods({
      ambulatory: ['Use the floor segments only if safe to transfer; otherwise stay seated.'],
    }),
  },
  {
    id: 'resistance-band-circuit',
    title: 'Resistance Band Circuit',
    duration: '32 min',
    level: 'Intermediate',
    mobility: ['wheelchair', 'limited', 'adaptive', 'ambulatory'],
    description: 'Full-body circuit using bands — easily scaled up or down by resistance level.',
    categories: ['Strength & Conditioning', 'Muscle Building', 'Strength'],
    suitedFor: 'Trainees ready for a full-body band circuit with scalable resistance.',
    equipment: ['Resistance bands', 'Anchor point', 'Chair'],
    focus: ['Full body', 'Strength endurance'],
    video: {
      youtubeId: 'Dtybibe4lTg',
      title: 'Seated Strength Training (use band where video uses weights)',
      instructor: 'John Reams',
      channel: 'NCHPAD',
    },
    programOutline: [
      'Band setup and safety check',
      'Upper-body circuit following video timing',
      'Extra band rows and presses between instructor cues',
    ],
    modifications: hybridMods(),
  },
  {
    id: 'sport-ready-power',
    title: 'Sport-Ready Power',
    duration: '40 min',
    level: 'Advanced',
    mobility: ['adaptive', 'ambulatory'],
    description: 'Explosive pushes, rotations, and conditioning for court and track athletes.',
    categories: ['Sports Performance', 'Power & Explosiveness', 'Strength & Conditioning'],
    suitedFor: 'Competitive adaptive athletes building power and conditioning.',
    equipment: ['Chair', 'Bands or light weights', 'Open space'],
    focus: ['Power', 'Rotation', 'Sport conditioning'],
    video: {
      youtubeId: 'OTjmwg0nc80',
      title: 'Seated HIIT & Strength for Athletes',
      instructor: 'Paul Eugene',
      channel: 'Paul Eugene',
    },
    programOutline: [
      'Power warm-up',
      'Explosive interval blocks',
      'Strength and core finisher',
    ],
    modifications: [
      {
        mobility: 'adaptive',
        tips: [
          'Emphasize explosive arm drive and trunk rotation for court sports.',
          'Add extra rest between intervals during competition taper weeks.',
        ],
      },
      {
        mobility: 'ambulatory',
        tips: [
          'Insert short standing plyometrics only if cleared for impact loading.',
        ],
      },
    ],
  },
  {
    id: 'cooldown-stretch',
    title: 'Post-Workout Cooldown',
    duration: '10 min',
    level: 'All levels',
    mobility: ['wheelchair', 'limited', 'adaptive', 'ambulatory'],
    description: 'Wind down after training with guided stretches for arms, chest, and upper back.',
    categories: ['Mobility & Stability'],
    suitedFor: 'Cool-down after any RollnFitness session or sport practice.',
    equipment: ['Chair'],
    focus: ['Recovery', 'Flexibility'],
    video: {
      youtubeId: 'FrVE1a2vgvA',
      title: 'Gentle Chair Yoga Cooldown',
      instructor: 'Adriene Mishler',
      channel: 'Yoga With Adriene',
    },
    programOutline: [
      'Slow breathing',
      'Upper-body stretch series',
      'Relaxation close',
    ],
    modifications: hybridMods(),
  },
]
