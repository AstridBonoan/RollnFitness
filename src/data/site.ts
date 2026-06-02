export const site = {
  name: 'RollnFitness',
  parentCompany: 'RollnEnterprises',
  fullName: 'RollnFitness by RollnEnterprises',
  tagline: 'Fitness for every body.',
  parentTagline: 'Visible. Active. Limitless.',
  logoAlt: 'Rolln Enterprises logo — adaptive athlete in a racing wheelchair',
  description:
    'An adaptive fitness platform for wheelchair users, adaptive athletes, individuals with limited mobility, and ambulatory users.',
  url: 'https://astridbonoan.github.io/RollnFitness/',
  email: 'hello@rollnfitness.com',
} as const

export const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Workouts', path: '/workouts' },
  { label: 'Progress', path: '/progress' },
  { label: 'Nutrition', path: '/nutrition' },
  { label: 'Challenges', path: '/challenges' },
  { label: 'Sports Pass', path: '/sports-pass' },
  { label: 'Join', path: '/join' },
] as const

export const mobilityLevels = [
  { id: 'wheelchair', label: 'Wheelchair user', icon: '♿' },
  { id: 'limited', label: 'Limited mobility', icon: '🦽' },
  { id: 'adaptive', label: 'Adaptive athlete', icon: '🏅' },
  { id: 'ambulatory', label: 'Ambulatory', icon: '🚶' },
] as const

export const coreFeatures = [
  {
    title: 'Adaptive Workouts',
    description:
      'Seated, standing, and hybrid routines designed for your mobility level — from upper-body strength to cardio and flexibility.',
    icon: '💪',
  },
  {
    title: 'Personalized Guidance',
    description:
      'Workout and nutrition recommendations that adapt to your goals, equipment, and how you move.',
    icon: '🎯',
  },
  {
    title: 'Progress Tracking',
    description:
      'Log sessions, celebrate streaks, and see strength and endurance trends over time.',
    icon: '📈',
  },
  {
    title: 'Challenges & Community',
    description:
      'Stay consistent with adaptive challenges, encouragement, and accountability built in.',
    icon: '🤝',
  },
] as const

export const workouts = [
  {
    id: 'upper-power',
    title: 'Upper Body Power',
    duration: '25 min',
    level: 'Beginner',
    mobility: ['wheelchair', 'limited'],
    description: 'Build shoulder and arm strength with resistance bands or dumbbells.',
    tags: ['Strength', 'Seated'],
  },
  {
    id: 'seated-cardio',
    title: 'Seated Cardio Blast',
    duration: '20 min',
    level: 'All levels',
    mobility: ['wheelchair', 'limited'],
    description: 'Raise your heart rate with seated punches, arm circles, and intervals.',
    tags: ['Cardio', 'Seated'],
  },
  {
    id: 'core-stability',
    title: 'Core & Stability',
    duration: '30 min',
    level: 'Intermediate',
    mobility: ['wheelchair', 'limited', 'ambulatory'],
    description: 'Strengthen your core for better posture, balance, and everyday movement.',
    tags: ['Core', 'Hybrid'],
  },
  {
    id: 'flexibility-flow',
    title: 'Flexibility Flow',
    duration: '15 min',
    level: 'All levels',
    mobility: ['wheelchair', 'limited', 'adaptive', 'ambulatory'],
    description: 'Gentle stretches to improve range of motion and reduce stiffness.',
    tags: ['Mobility', 'Recovery'],
  },
  {
    id: 'standing-balance',
    title: 'Standing Balance',
    duration: '20 min',
    level: 'Beginner',
    mobility: ['limited', 'ambulatory'],
    description: 'Supported balance exercises with chair or wall assistance.',
    tags: ['Balance', 'Standing'],
  },
  {
    id: 'adaptive-hiit',
    title: 'Adaptive HIIT',
    duration: '35 min',
    level: 'Advanced',
    mobility: ['adaptive', 'ambulatory'],
    description: 'High-intensity intervals with modifications for every movement pattern.',
    tags: ['HIIT', 'Hybrid'],
  },
] as const

export const sportsPrograms = [
  {
    title: 'Wheelchair Basketball',
    description: 'Court conditioning, push speed, and upper-body power for competitive play.',
    icon: '🏀',
  },
  {
    title: 'Adaptive Tennis',
    description: 'Rotational strength, shoulder stability, and quick-reaction drills.',
    icon: '🎾',
  },
  {
    title: 'Adaptive Rugby',
    description: 'Contact-ready strength, grip endurance, and explosive pushing power.',
    icon: '🏉',
  },
  {
    title: 'Hand Cycling',
    description: 'Endurance building, cadence work, and upper-body conditioning.',
    icon: '🚴',
  },
] as const

export const challenges = [
  {
    title: '7-Day Movement Streak',
    description: 'Complete any adaptive workout for seven days in a row.',
    participants: 128,
    daysLeft: 12,
  },
  {
    title: 'Push Power Month',
    description: 'Log 500 wheelchair pushes or equivalent upper-body reps this month.',
    participants: 84,
    daysLeft: 18,
  },
  {
    title: 'Flexibility Focus',
    description: 'Finish four mobility sessions in two weeks to unlock a badge.',
    participants: 203,
    daysLeft: 9,
  },
] as const

export const nutritionTips = [
  {
    title: 'Protein for Recovery',
    body: 'Aim for 1.2–1.6 g per kg of body weight daily to support muscle repair after adaptive training.',
  },
  {
    title: 'Hydration Matters',
    body: 'Keep water within reach during seated workouts. Dehydration affects energy and focus.',
  },
  {
    title: 'Anti-Inflammatory Foods',
    body: 'Berries, leafy greens, and omega-3 rich foods can help manage inflammation from training.',
  },
  {
    title: 'Pre-Workout Fuel',
    body: 'A small carb-rich snack 30–60 minutes before training helps sustain energy for longer sessions.',
  },
] as const
