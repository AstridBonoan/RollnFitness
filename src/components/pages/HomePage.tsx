import { motion } from 'framer-motion'
import { coreFeatures, mobilityLevels, site } from '../../data/site'
import type { User } from '../../lib/auth'
import { Logo } from '../Logo'
import { Button } from '../ui/Button'
import { SectionHeader } from '../ui/SectionHeader'

interface HomePageProps {
  onNavigate: (path: string) => void
  currentUser: User | null
}

export function HomePage({ onNavigate, currentUser }: HomePageProps) {
  return (
    <>
      <section className="relative px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8">
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden opacity-50"
          aria-hidden="true"
          style={{
            backgroundImage: `radial-gradient(circle at 75% 45%, rgba(34,211,238,0.18) 0%, transparent 45%),
              radial-gradient(circle at 20% 50%, rgba(34,211,238,0.12) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(139,92,246,0.08) 0%, transparent 40%)`,
          }}
        />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-xl"
            >
              <p className="mb-4 inline-flex items-center rounded-full bg-brand-900/40 px-4 py-1.5 text-sm font-semibold text-brand-200">
                {site.fullName}
              </p>
              <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                {currentUser ? (
                  <>
                    Welcome,{' '}
                    <span className="text-brand-400">{currentUser.username}</span>!
                  </>
                ) : (
                  <>
                    Move with confidence.{' '}
                    <span className="text-brand-400">Train your way.</span>
                  </>
                )}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-slate-300 sm:text-xl">
                {site.description} Build strength, improve mobility, and stay consistent with workouts
                designed for wheelchair users, adaptive athletes, and everyone in between.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button size="lg" onClick={() => onNavigate('/workouts')}>
                  Browse workouts
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center lg:justify-end"
            >
              <Logo variant="full" className="max-w-sm lg:max-w-md" />
            </motion.div>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mobilityLevels.map((level, i) => (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.4 }}
                className="card-hover card-surface p-5"
              >
                <span className="text-2xl" aria-hidden="true">{level.icon}</span>
                <p className="mt-3 font-semibold text-white">{level.label}</p>
                <p className="mt-1 text-sm text-slate-400">Workouts tailored for you</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding section-alt px-4 sm:px-6 lg:px-8" aria-labelledby="features-heading">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Phase 1 Platform"
            title="Everything you need to start moving"
            description="RollnFitness delivers real value from day one — adaptive workouts, guidance, tracking, and community built for accessibility first."
          />
          <div className="grid gap-6 sm:grid-cols-2">
            {coreFeatures.map((feature) => (
              <article key={feature.title} className="card-hover card-surface p-6">
                <span className="text-3xl" aria-hidden="true">{feature.icon}</span>
                <h3 id="features-heading" className="mt-4 text-xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 leading-relaxed text-slate-300">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding px-4 sm:px-6 lg:px-8" aria-labelledby="vision-heading">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-8 shadow-glow sm:p-12">
            <h2 id="vision-heading" className="font-display text-3xl font-bold text-white sm:text-4xl">
              Fitness should welcome every body
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-brand-100">
              Most fitness apps assume everyone moves the same way. RollnFitness is built differently —
              inclusive, empowering, and designed around how you actually move, train, and grow.
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                'Discover adaptive workouts for your mobility level',
                'Track progress and build lasting habits',
                'Get personalized fitness and nutrition guidance',
                'Stay motivated with challenges and accountability',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span className="text-brand-50">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Button
                variant="secondary"
                size="lg"
                className="!border-white/30 !bg-white/10 !text-white hover:!bg-white/20"
                onClick={() => onNavigate('/join')}
              >
                Join the waitlist
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding section-alt px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <SectionHeader
            eyebrow="Coming later"
            title="RollnFitness+"
            description="Future movement intelligence — activity estimation, wearable integrations, push count tracking, and advanced analytics. Not part of Phase 1, but on the roadmap."
          />
          <Button variant="ghost" onClick={() => onNavigate('/sports-pass')}>
            Explore Sports Pass instead →
          </Button>
        </div>
      </section>
    </>
  )
}
