import { getCurrentUser, mobilityLabel } from '../../lib/auth'
import { getWorkoutById, workoutMatchesMobility } from '../../lib/workouts'
import type { WorkoutProgram } from '../../data/workouts'
import { mobilityLevels } from '../../data/site'
import { CategoryBadges } from '../workouts/CategoryBadges'
import { WorkoutVideo } from '../workouts/WorkoutVideo'
import { Button } from '../ui/Button'
import { PageShell } from '../ui/PageShell'

interface WorkoutDetailPageProps {
  workoutId: string
  onNavigate: (path: string) => void
}

function MobilityBadge({ workout }: { workout: WorkoutProgram }) {
  return (
    <div className="flex flex-wrap gap-2">
      {workout.mobility.map((id) => {
        const level = mobilityLevels.find((m) => m.id === id)
        return (
          <span
            key={id}
            className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-200"
          >
            {level ? `${level.icon} ${level.label}` : id}
          </span>
        )
      })}
    </div>
  )
}

export function WorkoutDetailPage({ workoutId, onNavigate }: WorkoutDetailPageProps) {
  const workout = getWorkoutById(workoutId)
  const user = getCurrentUser()
  const isForYou = workout && workoutMatchesMobility(workout, user?.mobility)

  if (!workout) {
    return (
      <PageShell title="Workout not found" description="This program is not in the library.">
        <Button onClick={() => onNavigate('/workouts')}>Back to library</Button>
      </PageShell>
    )
  }

  const userMods = user?.mobility
    ? workout.modifications.find((m) => m.mobility === user.mobility)
    : null

  return (
    <PageShell
      title={workout.title}
      description={workout.description}
    >
      <button
        type="button"
        onClick={() => onNavigate('/workouts')}
        className="touch-target mb-6 text-sm font-medium text-octane-400 hover:text-octane-300"
      >
        ← Back to workout library
      </button>

      {isForYou && user?.mobility && (
        <p
          className="mb-6 rounded-xl border border-vitality-500/40 bg-vitality-950/40 px-4 py-3 text-sm text-vitality-200"
          role="status"
        >
          Recommended for your profile: <strong>{mobilityLabel(user.mobility)}</strong>
        </p>
      )}

      <div className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <WorkoutVideo youtubeId={workout.video.youtubeId} title={workout.video.title} />
          <p className="mt-3 text-sm text-slate-400">
            Guided program: <span className="text-slate-300">{workout.video.title}</span> —{' '}
            {workout.video.instructor}, {workout.video.channel}
          </p>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="card-surface p-5">
            <h2 className="text-lg font-bold text-white">Training categories</h2>
            <div className="mt-3">
              <CategoryBadges categories={workout.categories} />
            </div>
          </div>

          <div className="card-surface p-5">
            <h2 className="text-lg font-bold text-white">Built for you</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{workout.suitedFor}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-400">
              <span>{workout.duration}</span>
              <span aria-hidden="true">·</span>
              <span>{workout.level}</span>
            </div>
            <div className="mt-4">
              <MobilityBadge workout={workout} />
            </div>
          </div>

          <div className="card-surface p-5">
            <h2 className="text-lg font-bold text-white">Equipment</h2>
            <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-300">
              {workout.equipment.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="card-surface p-5">
            <h2 className="text-lg font-bold text-white">Program outline</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
              {workout.programOutline.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <section className="mt-10" aria-labelledby="mods-heading">
        <h2 id="mods-heading" className="font-display text-xl font-bold text-white">
          Modifications by mobility
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Follow the video with adjustments that match how you move. Consult your clinician before
          starting a new program.
        </p>

        {userMods && (
          <div className="banner-achievement mt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-circuit-400">
              Your profile
            </p>
            <p className="mt-1 font-semibold text-steel-50">{mobilityLabel(userMods.mobility)}</p>
            <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-steel-200">
              {userMods.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {workout.modifications.map((mod) => (
            <article key={mod.mobility} className="card-surface p-5">
              <h3 className="font-semibold text-white">{mobilityLabel(mod.mobility)}</h3>
              <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-300">
                {mod.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

    </PageShell>
  )
}
