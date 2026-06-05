/**
 * Generates src/data/workouts/catalog.ts with 120+ workout specs.
 * Run: node scripts/generate-workout-catalog.mjs
 */
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = join(__dirname, '../src/data/workouts/catalog.ts')

const CATEGORIES = [
  'Strength',
  'Muscle Building',
  'Endurance',
  'Power & Explosiveness',
  'Functional Fitness',
  'Mobility & Stability',
  'Sports Performance',
  'Strength & Conditioning',
]

const MOBILITY = {
  seated: "['wheelchair', 'limited']",
  seatedCore: "['wheelchair', 'limited', 'ambulatory']",
  all: "['wheelchair', 'limited', 'adaptive', 'ambulatory']",
  allNoAda: "['wheelchair', 'limited', 'ambulatory']",
  standing: "['limited', 'ambulatory']",
  athlete: "['adaptive', 'ambulatory']",
  wcAda: "['wheelchair', 'adaptive']",
  limAda: "['limited', 'adaptive', 'ambulatory']",
}

function spec(
  id,
  title,
  duration,
  level,
  mobilityKey,
  description,
  categories,
  suitedFor,
  equipment,
  focus,
  videoIndex,
  outline,
  mods = 'hybrid',
) {
  const outlineStr = JSON.stringify(outline)
  const cats = JSON.stringify(categories)
  const eq = JSON.stringify(equipment)
  const foc = JSON.stringify(focus)
  const modsStr = mods === 'seated' ? "'seated'" : mods === 'hybrid' ? "'hybrid'" : JSON.stringify(mods)
  return `  workout({ id: '${id}', title: '${title.replace(/'/g, "\\'")}', duration: '${duration}', level: '${level}', mobility: ${MOBILITY[mobilityKey]}, description: '${description.replace(/'/g, "\\'")}', categories: ${cats}, suitedFor: '${suitedFor.replace(/'/g, "\\'")}', equipment: ${eq}, focus: ${foc}, video: ${videoIndex}, programOutline: ${outlineStr}, mods: ${modsStr} }),`
}

const additions = []
let vi = 0
const nextVi = () => {
  const i = vi
  vi += 1
  return i
}

const batches = [
  {
    cat: 'Strength',
    extra: ['Muscle Building'],
    mobility: 'seated',
    mods: 'seated',
    items: [
      ['seated-row-strength', 'Seated Row Strength', '24 min', 'Beginner', 'Build mid-back and posture with band or towel rows.'],
      ['shoulder-press-seated', 'Seated Shoulder Press Fundamentals', '26 min', 'Beginner', 'Overhead pressing patterns for stronger shoulders and transfers.'],
      ['chest-press-chair', 'Chair Chest Press Circuit', '28 min', 'Intermediate', 'Horizontal pushing strength for daily tasks and sport.'],
      ['tricep-extension-chair', 'Chair Tricep Extension Series', '20 min', 'Beginner', 'Isolate triceps for propulsion and pushing power.'],
      ['bicep-curl-seated', 'Seated Bicep Curl Builder', '22 min', 'Beginner', 'Arm curl progressions with bands or light weights.'],
      ['lateral-raise-seated', 'Seated Lateral Raise Focus', '18 min', 'Beginner', 'Target deltoids for shoulder stability and aesthetics.'],
      ['posterior-chain-seated', 'Seated Posterior Chain', '30 min', 'Intermediate', 'Rear delts, rhomboids, and upper back endurance.'],
      ['unilateral-arm-strength', 'Unilateral Arm Strength', '25 min', 'Intermediate', 'Single-arm work to correct imbalances from daily wheelchair use.'],
      ['isometric-hold-strength', 'Isometric Hold Strength', '16 min', 'All levels', 'Timed holds for joint-friendly strength gains.'],
      ['overhead-reach-strength', 'Overhead Reach Strength', '21 min', 'Beginner', 'Reach and press drills for overhead shelf tasks.'],
      ['push-pattern-seated', 'Seated Push Pattern Lab', '27 min', 'Intermediate', 'Varied push angles for functional pressing strength.'],
      ['deltoid-builder-seated', 'Deltoid Builder Seated', '23 min', 'Intermediate', 'Comprehensive shoulder strengthening from a chair.'],
      ['band-back-strength', 'Band Back Strength', '29 min', 'Beginner', 'Pulling strength for posture and lat development.'],
      ['seated-pull-power', 'Seated Pull Power', '31 min', 'Intermediate', 'Heavy-band pulling with tempo control.'],
    ],
  },
  {
    cat: 'Muscle Building',
    extra: ['Strength'],
    mobility: 'seatedCore',
    items: [
      ['hypertrophy-upper-seated', 'Seated Upper Hypertrophy', '35 min', 'Intermediate', 'Higher-rep upper-body blocks for muscle growth.'],
      ['back-width-band', 'Band Back Width Builder', '32 min', 'Intermediate', 'Lat and mid-back volume for a broader silhouette.'],
      ['arm-pump-circuit', 'Seated Arm Pump Circuit', '28 min', 'Intermediate', 'Biceps and triceps supersets with minimal rest.'],
      ['chest-volume-seated', 'Seated Chest Volume Day', '34 min', 'Advanced', 'Chest hypertrophy with controlled eccentrics.'],
      ['shoulder-mass-chair', 'Chair Shoulder Mass Session', '30 min', 'Intermediate', 'Shoulder volume for capped delt development.'],
      ['grip-hypertrophy', 'Grip & Forearm Hypertrophy', '18 min', 'Beginner', 'Hand and forearm size for transfers and sport.'],
      ['slow-tempo-strength', 'Slow-Tempo Muscle Builder', '26 min', 'Intermediate', 'Time-under-tension sets for seated trainees.'],
      ['drop-set-arms', 'Seated Arm Drop Sets', '24 min', 'Advanced', 'Intensity techniques for arm hypertrophy.'],
      ['upper-split-a', 'Seated Upper Split A', '38 min', 'Intermediate', 'Push emphasis hypertrophy split day.'],
      ['upper-split-b', 'Seated Upper Split B', '38 min', 'Intermediate', 'Pull emphasis hypertrophy split day.'],
      ['density-strength', 'Muscle Density Strength', '27 min', 'Intermediate', 'Moderate load, high density muscle work.'],
      ['lean-mass-wheelchair', 'Lean Mass for Wheelchair Athletes', '36 min', 'Advanced', 'Build lean tissue without standing load.'],
      ['band-burnout-builder', 'Band Burnout Builder', '22 min', 'Beginner', 'Burnout sets to finish muscle groups.'],
    ],
  },
  {
    cat: 'Endurance',
    extra: [],
    mobility: 'all',
    items: [
      ['steady-state-seated', 'Steady-State Seated Cardio', '30 min', 'Beginner', 'Continuous rhythmic cardio at conversational pace.'],
      ['interval-cardio-chair', 'Chair Interval Cardio', '25 min', 'Intermediate', 'Work/rest intervals for cardiovascular fitness.'],
      ['arm-cycle-endurance', 'Arm Cycle Endurance', '28 min', 'Intermediate', 'Sustained arm patterns to build aerobic base.'],
      ['cardio-boxing-lights', 'Light Cardio Boxing Rounds', '22 min', 'All levels', 'Low-impact boxing combinations for heart health.'],
      ['tempo-push-endurance', 'Tempo Push Endurance', '32 min', 'Intermediate', 'Wheelchair push tempo drills plus upper cardio.'],
      ['aerobic-builder-20', '20-Minute Aerobic Builder', '20 min', 'Beginner', 'Short aerobic session for busy schedules.'],
      ['cardio-core-combo', 'Cardio Core Combo', '27 min', 'Intermediate', 'Alternate cardio bursts with core bracing.'],
      ['recovery-pace-cardio', 'Recovery Pace Cardio', '18 min', 'All levels', 'Easy cardio for active recovery days.'],
      ['endurance-ladder', 'Seated Endurance Ladder', '33 min', 'Advanced', 'Progressive interval ladder for stamina.'],
      ['rhythm-ride-seated', 'Rhythm Ride Seated', '24 min', 'All levels', 'Music-driven cardio patterns for engagement.'],
      ['long-slow-cardio', 'Long Slow Seated Cardio', '40 min', 'Beginner', 'Extended easy cardio for fat oxidation and mood.'],
      ['cardio-finisher-set', 'Cardio Finisher Set', '15 min', 'Intermediate', 'Quick finisher after strength sessions.'],
      ['breath-cardio-flow', 'Breath-Led Cardio Flow', '26 min', 'All levels', 'Breath-paced movement for steady endurance.'],
      ['wheelchair-sprint-drills', 'Wheelchair Sprint Drills', '21 min', 'Advanced', 'Short explosive cardio for sport prep.'],
    ],
  },
  {
    cat: 'Power & Explosiveness',
    extra: ['Strength & Conditioning'],
    mobility: 'athlete',
    items: [
      ['explosive-arm-drive', 'Explosive Arm Drive', '28 min', 'Advanced', 'Fast punches and presses for power development.'],
      ['seated-plyo-arms', 'Seated Plyometric Arms', '24 min', 'Advanced', 'Rapid arm cycles with full recovery.'],
      ['rotational-power-chair', 'Rotational Power from Chair', '30 min', 'Intermediate', 'Trunk rotation power for court sports.'],
      ['push-burst-intervals', 'Push Burst Intervals', '26 min', 'Advanced', 'Explosive push patterns with timed rest.'],
      ['med-ball-seated', 'Seated Med-Ball Power', '22 min', 'Intermediate', 'Light ball throws and presses for power.'],
      ['reactive-quick-arms', 'Reactive Quick Arms', '20 min', 'Advanced', 'Reaction drills for faster arm speed.'],
      ['power-endurance-blend', 'Power Endurance Blend', '35 min', 'Advanced', 'Alternate power and cardio blocks.'],
      ['start-speed-drills', 'Start Speed Drills', '18 min', 'Intermediate', 'First-push acceleration practice.'],
      ['upper-plyo-circuit', 'Upper Plyo Circuit', '32 min', 'Advanced', 'Multi-move power circuit with long rest.'],
      ['contrast-power-seated', 'Contrast Power Seated', '27 min', 'Advanced', 'Heavy then fast contrast sets for power.'],
      ['sport-punch-power', 'Sport Punch Power', '25 min', 'Intermediate', 'Boxing power for wheelchair basketball.'],
      ['explosive-band-pulls', 'Explosive Band Pulls', '23 min', 'Intermediate', 'Fast band pulls with reset between reps.'],
      ['power-core-combo', 'Power Core Combo', '29 min', 'Advanced', 'Core bracing plus explosive upper work.'],
    ],
  },
  {
    cat: 'Functional Fitness',
    extra: ['Strength'],
    mobility: 'limAda',
    items: [
      ['daily-living-strength', 'Daily Living Strength', '26 min', 'Beginner', 'Patterns that mirror dressing, reaching, and carrying.'],
      ['reach-and-grasp', 'Reach and Grasp Training', '20 min', 'All levels', 'Shoulder reach with controlled grip work.'],
      ['sit-to-stand-prep', 'Sit-to-Stand Prep', '24 min', 'Beginner', 'Supported transitions and leg drive practice.'],
      ['carry-simulation-seated', 'Seated Carry Simulation', '22 min', 'Intermediate', 'Loaded carries adapted for seated users.'],
      ['multi-planar-reach', 'Multi-Planar Reach Work', '28 min', 'Intermediate', 'Reach across planes for real-world tasks.'],
      ['functional-push-pull', 'Functional Push Pull', '30 min', 'Intermediate', 'Alternating push and pull for daily demands.'],
      ['balance-reach-combo', 'Balance Reach Combo', '25 min', 'Beginner', 'Reach drills with light balance challenge.'],
      ['step-pattern-prep', 'Step Pattern Prep', '27 min', 'Intermediate', 'Supported stepping for safer ambulation.'],
      ['loaded-transfer-drills', 'Loaded Transfer Drills', '32 min', 'Intermediate', 'Strength mimicking safe transfer mechanics.'],
      ['coordination-circuit', 'Coordination Circuit', '21 min', 'All levels', 'Hand-eye coordination for sport and life.'],
      ['agility-hands-feet', 'Hand-Foot Agility Seated', '23 min', 'Intermediate', 'Quick hands with optional foot taps.'],
      ['functional-endurance', 'Functional Endurance', '34 min', 'Intermediate', 'Repeated functional moves under fatigue.'],
      ['home-task-fitness', 'Home Task Fitness', '19 min', 'Beginner', 'Train common household movement patterns.'],
    ],
  },
  {
    cat: 'Mobility & Stability',
    extra: [],
    mobility: 'all',
    mods: 'hybrid',
    items: [
      ['hip-opener-seated', 'Seated Hip Opener Flow', '18 min', 'All levels', 'Open hips and reduce seated tightness.'],
      ['thoracic-mobility-chair', 'Thoracic Mobility Chair', '16 min', 'All levels', 'Upper-back rotation for better posture.'],
      ['ankle-foot-mobility', 'Ankle Foot Mobility', '14 min', 'All levels', 'Foot and ankle movement when safe to practice.'],
      ['spine-wave-seated', 'Seated Spine Wave', '20 min', 'All levels', 'Gentle spinal articulation and breath.'],
      ['shoulder-cars-seated', 'Seated Shoulder CARs', '15 min', 'All levels', 'Controlled articular rotations for shoulders.'],
      ['wrist-forearm-mobility', 'Wrist Forearm Mobility', '12 min', 'All levels', 'Relieve typing and push-related forearm tension.'],
      ['pelvic-tilt-awareness', 'Pelvic Tilt Awareness', '17 min', 'All levels', 'Learn neutral pelvis for core stability.'],
      ['stability-ball-seated', 'Seated Stability Holds', '22 min', 'Beginner', 'Isometric stability for trunk control.'],
      ['balance-breath-work', 'Balance Breath Work', '19 min', 'All levels', 'Breathing drills tied to balance confidence.'],
      ['evening-unwind-stretch', 'Evening Unwind Stretch', '14 min', 'All levels', 'Wind-down mobility before sleep.'],
      ['desk-break-mobility', 'Desk Break Mobility', '10 min', 'All levels', 'Quick mobility between work blocks.'],
      ['joint-friendly-flow', 'Joint Friendly Flow', '24 min', 'All levels', 'Low-impact flow for stiff mornings.'],
    ],
  },
  {
    cat: 'Sports Performance',
    extra: ['Endurance'],
    mobility: 'wcAda',
    items: [
      ['court-ready-arms', 'Court Ready Arms', '32 min', 'Advanced', 'Sport-specific arm endurance for court athletes.'],
      ['wheelchair-basketball-prep', 'Wheelchair Basketball Prep', '36 min', 'Advanced', 'Intervals mimicking game pace changes.'],
      ['racing-push-technique', 'Racing Push Technique', '28 min', 'Intermediate', 'Technique drills for track and road racing.'],
      ['handcycle-cross-train', 'Handcycle Cross Train', '30 min', 'Intermediate', 'Upper-body endurance for handcyclists.'],
      ['rugby-chair-conditioning', 'Wheelchair Rugby Conditioning', '38 min', 'Advanced', 'High-intensity contact-sport conditioning.'],
      ['tennis-serve-prep', 'Adaptive Tennis Prep', '26 min', 'Intermediate', 'Rotation and shoulder prep for racket sports.'],
      ['swim-pull-strength', 'Swim Pull Strength Seated', '24 min', 'Intermediate', 'Pulling strength for adaptive swimmers.'],
      ['field-throw-power', 'Field Throw Power', '27 min', 'Advanced', 'Explosive release patterns for field events.'],
      ['agility-ladder-arms', 'Arm Agility Ladder', '22 min', 'Intermediate', 'Fast hands for reactive sports.'],
      ['pre-competition-warmup', 'Pre-Competition Warmup', '18 min', 'All levels', 'Activate muscles before adaptive competition.'],
      ['post-race-recovery', 'Post-Race Recovery', '20 min', 'All levels', 'Flush lactate and restore range after events.'],
      ['sport-core-anti-rotation', 'Sport Core Anti-Rotation', '25 min', 'Intermediate', 'Anti-rotation core for throwing and pushing.'],
      ['endurance-pace-tester', 'Endurance Pace Tester', '34 min', 'Advanced', 'Benchmark intervals for season planning.'],
    ],
  },
  {
    cat: 'Strength & Conditioning',
    extra: ['Endurance'],
    mobility: 'allNoAda',
    items: [
      ['full-body-band-sc', 'Full Body Band S&C', '35 min', 'Intermediate', 'Conditioning circuit with bands and chair.'],
      ['metcon-seated-30', '30-Minute Seated Metcon', '30 min', 'Advanced', 'Mixed modal conditioning for total fitness.'],
      ['strength-cardio-superset', 'Strength Cardio Superset', '33 min', 'Intermediate', 'Alternate strength and cardio stations.'],
      ['emom-chair-24', '24-Minute Chair EMOM', '24 min', 'Advanced', 'Every-minute-on-the-minute conditioning.'],
      ['chipper-seated', 'Seated Chipper Workout', '40 min', 'Advanced', 'Descending rep chipper for mental toughness.'],
      ['tabata-upper', 'Upper Body Tabata', '16 min', 'Intermediate', 'Classic tabata protocol for arms and core.'],
      ['conditioning-ladder-sc', 'Conditioning Ladder S&C', '28 min', 'Intermediate', 'Climbing rep ladder with built-in rest.'],
      ['grit-strength-endurance', 'Grit Strength Endurance', '37 min', 'Advanced', 'Long grinder combining strength and cardio.'],
      ['circuit-rx-seated', 'Seated Circuit RX', '32 min', 'Intermediate', 'Prescribed rounds for time with scaling.'],
      ['hybrid-athlete-sc', 'Hybrid Athlete S&C', '42 min', 'Advanced', 'Sport-ready blend of power and endurance.'],
      ['foundation-sc', 'Foundation S&C', '26 min', 'Beginner', 'Intro conditioning for new adaptive athletes.'],
      ['peak-season-sc', 'Peak Season S&C', '45 min', 'Advanced', 'High-volume week template for in-season athletes.'],
      ['recovery-sc-flush', 'Recovery S&C Flush', '22 min', 'All levels', 'Light conditioning to promote blood flow.'],
    ],
  },
]

for (const batch of batches) {
  for (const [id, title, duration, level, desc] of batch.items) {
    const cats = [batch.cat, ...batch.extra].filter(
      (c, i, arr) => arr.indexOf(c) === i,
    )
    const mobilityKey = batch.mobility
    const mods = batch.mods ?? (mobilityKey === 'seated' ? 'seated' : 'hybrid')
    const suited = `Athletes and trainees focused on ${batch.cat.toLowerCase()} from adaptive positions.`
    const equipment =
      batch.cat === 'Mobility & Stability'
        ? ['Chair']
        : ['Sturdy chair', 'Resistance band (optional)', 'Water nearby']
    const focus = [batch.cat.split(' ')[0], 'Adaptive training']
    const outline = [
      'Warm-up and movement prep',
      `${batch.cat} main blocks`,
      'Cool-down and breathing',
    ]
    additions.push(
      spec(
        id,
        title,
        duration,
        level,
        mobilityKey,
        desc,
        cats,
        suited,
        equipment,
        focus,
        nextVi(),
        outline,
        mods,
      ),
    )
  }
}

const header = `import { workout } from './helpers'
import type { WorkoutProgram } from './types'
import { hybridMods, seatedBase } from './types'

/** Original 18 programs — preserved exactly from legacy workouts.ts */
const ORIGINAL_PROGRAMS: WorkoutProgram[] = [
`

// Read original from workouts.ts - we'll embed via copying the 18 objects
// For generation script, output placeholder and we'll merge manually
// Actually embed originals as separate file original.ts

const footer = `]

/** ${additions.length} additional programs */
const EXPANDED_SPECS = [
${additions.join('\n')}
]

export const workoutCatalog: WorkoutProgram[] = [
  ...ORIGINAL_PROGRAMS,
  ...EXPANDED_SPECS,
]
`

console.log('Generated', additions.length, 'new specs')
console.log('Write originals separately; specs count:', additions.length)

writeFileSync(
  join(__dirname, '../src/data/workouts/catalog-expanded.ts'),
  `import { workout } from './helpers'\nimport type { WorkoutProgram } from './types'\n\nexport const EXPANDED_SPECS: WorkoutProgram[] = [\n${additions.join('\n')}\n]\n`,
)

console.log('Wrote catalog-expanded.ts')
