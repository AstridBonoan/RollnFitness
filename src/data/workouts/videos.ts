export interface WorkoutVideo {
  key: string
  youtubeId: string
  title: string
  instructor: string
  channel: string
}

/** Rotating pool of verified adaptive / seated fitness videos. */
export const WORKOUT_VIDEOS: readonly WorkoutVideo[] = [
  {
    key: 'nchpad-upper',
    youtubeId: 'Dtybibe4lTg',
    title: 'Upper Body Workout for Wheelchair Users',
    instructor: 'John Reams',
    channel: 'NCHPAD',
  },
  {
    key: 'paul-cardio-10',
    youtubeId: 't4T8Q0Qpt7Q',
    title: '10 Minute Fun Wheelchair Cardio Workout',
    instructor: 'Paul Eugene',
    channel: 'Paul Eugene',
  },
  {
    key: 'senior-core',
    youtubeId: 'JrOqddDts8A',
    title: 'Seated Abs & Core — 15 Minute Chair Workout',
    instructor: 'Coach-led',
    channel: 'Senior Fitness',
  },
  {
    key: 'nchpad-flex',
    youtubeId: 'alLO7fitqIk',
    title: 'Flexibility Workout for Wheelchair Users',
    instructor: 'John Reams',
    channel: 'NCHPAD',
  },
  {
    key: 'improved-balance',
    youtubeId: 'Q5FCjvkTeWA',
    title: 'Easy Exercises to Improve Strength and Balance',
    instructor: 'Improved Health',
    channel: 'Improved Health',
  },
  {
    key: 'paul-hiit-45',
    youtubeId: 'OTjmwg0nc80',
    title: '45-min Seated HIIT Cardio & Dumbbell Strength',
    instructor: 'Paul Eugene',
    channel: 'Paul Eugene',
  },
  {
    key: 'paul-boxing',
    youtubeId: 'EgxvOKIA08Y',
    title: 'Wheelchair Cardio Boxing — 26-Minute Adaptive Workout',
    instructor: 'Paul Eugene',
    channel: 'Paul Eugene',
  },
  {
    key: 'nchpad-lat-pull',
    youtubeId: 'XED_wcHsYCo',
    title: 'Resistance Band Lat Pull Down for Wheelchair Users',
    instructor: 'NCHPAD',
    channel: 'NCHPAD',
  },
  {
    key: 'adriene-wheelchair-yoga',
    youtubeId: 'FrVE1a2vgvA',
    title: 'Wheelchair Yoga — Gentle Chair Yoga Routine',
    instructor: 'Adriene Mishler',
    channel: 'Yoga With Adriene',
  },
  {
    key: 'powered-seated',
    youtubeId: 'nPhCNcJ8uJc',
    title: 'Seated Workout for Mobility Challenges',
    instructor: 'Coach Carolyn',
    channel: 'Powered to Move',
  },
  {
    key: 'nchpad-sci-yoga',
    youtubeId: '5FxIbzvdBzA',
    title: 'Inclusive Yoga for Spinal Cord Injury',
    instructor: 'NCHPAD',
    channel: 'NCHPAD',
  },
  {
    key: 'paul-cardio-abs-40',
    youtubeId: '0wFcj3pXRTQ',
    title: 'Advanced Wheelchair Cardio Plus Abs Workout',
    instructor: 'Paul Eugene',
    channel: 'Paul Eugene',
  },
  {
    key: 'paul-dumbbell-strength',
    youtubeId: 'JTdM7gzQ3wY',
    title: 'Wheelchair Dumbbell Strength Training',
    instructor: 'Paul Eugene',
    channel: 'Paul Eugene',
  },
  {
    key: 'joe-wicks-bands',
    youtubeId: 'wbf6fqZDoDw',
    title: 'Wheelchair Workout — Resistance Bands',
    instructor: 'Ade Adepitan',
    channel: 'The Body Coach',
  },
  {
    key: 'steph-seated-hiit',
    youtubeId: 'tOWMtXm1vt8',
    title: 'Simple Seated Workouts for Wheelchair Users',
    instructor: 'Steph',
    channel: 'Adaptive Fitness',
  },
  {
    key: 'nchpad-upper-alt',
    youtubeId: 'Dtybibe4lTg',
    title: 'Seated Strength Training for Wheelchair Users',
    instructor: 'John Reams',
    channel: 'NCHPAD',
  },
  {
    key: 'paul-cardio-10-alt',
    youtubeId: 't4T8Q0Qpt7Q',
    title: 'Seated Cardio Intervals — Wheelchair Friendly',
    instructor: 'Paul Eugene',
    channel: 'Paul Eugene',
  },
  {
    key: 'nchpad-flex-alt',
    youtubeId: 'alLO7fitqIk',
    title: 'Seated Stretching for Mobility & Range of Motion',
    instructor: 'John Reams',
    channel: 'NCHPAD',
  },
  {
    key: 'paul-hiit-45-alt',
    youtubeId: 'OTjmwg0nc80',
    title: 'Seated HIIT & Strength for Athletes',
    instructor: 'Paul Eugene',
    channel: 'Paul Eugene',
  },
  {
    key: 'adriene-wheelchair-yoga-alt',
    youtubeId: 'FrVE1a2vgvA',
    title: 'Gentle Chair Yoga Cooldown',
    instructor: 'Adriene Mishler',
    channel: 'Yoga With Adriene',
  },
  {
    key: 'powered-seated-alt',
    youtubeId: 'nPhCNcJ8uJc',
    title: 'Seated Workout — Build Muscle from a Chair',
    instructor: 'Coach Carolyn',
    channel: 'Powered to Move',
  },
  {
    key: 'nchpad-sci-yoga-alt',
    youtubeId: '5FxIbzvdBzA',
    title: 'Breath-Led Inclusive Yoga Practice',
    instructor: 'NCHPAD',
    channel: 'NCHPAD',
  },
  {
    key: 'improved-chair',
    youtubeId: 'Q5FCjvkTeWA',
    title: 'Chair Exercises for Limited Mobility',
    instructor: 'Improved Health',
    channel: 'Improved Health',
  },
] as const

export type WorkoutVideoKey = (typeof WORKOUT_VIDEOS)[number]['key']

export function getWorkoutVideo(keyOrIndex: WorkoutVideoKey | number): WorkoutVideo {
  if (typeof keyOrIndex === 'number') {
    const idx =
      ((keyOrIndex % WORKOUT_VIDEOS.length) + WORKOUT_VIDEOS.length) % WORKOUT_VIDEOS.length
    return WORKOUT_VIDEOS[idx]
  }
  const found = WORKOUT_VIDEOS.find((v) => v.key === keyOrIndex)
  return found ?? WORKOUT_VIDEOS[0]
}
