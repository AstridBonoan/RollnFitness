import { useState } from 'react'
import { mobilityLevels } from '../../data/site'
import { Button } from '../ui/Button'
import { PageShell } from '../ui/PageShell'

export function JoinPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobility: '',
    interest: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <PageShell
        title="You're on the list!"
        description="Thank you for joining the RollnFitness early access waitlist. We'll reach out when your spot is ready."
      >
        <div className="rounded-2xl border border-brand-700 bg-brand-950/30 p-8 text-center">
          <span className="text-5xl" aria-hidden="true">🎉</span>
          <p className="mt-4 text-lg text-slate-200">
            Welcome to the RollnFitness community. Fitness for every body starts here.
          </p>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell
      title="Get Early Access"
      description="Be among the first to experience RollnFitness. Join the waitlist for adaptive workouts, progress tracking, and personalized guidance."
    >
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-lg space-y-6 card-surface p-6 sm:p-8"
        aria-label="Early access waitlist form"
      >
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-white">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-2 w-full rounded-xl border border-white/20 bg-navy-950 px-4 py-3 text-white transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-white">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-2 w-full rounded-xl border border-white/20 bg-navy-950 px-4 py-3 text-white transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20"
          />
        </div>

        <fieldset>
          <legend className="block text-sm font-semibold text-white">How do you move?</legend>
          <div className="mt-3 space-y-2">
            {mobilityLevels.map((level) => (
              <label
                key={level.id}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 px-4 py-3 transition-colors has-[:checked]:border-brand-500 has-[:checked]:bg-brand-950/40"
              >
                <input
                  type="radio"
                  name="mobility"
                  value={level.id}
                  required
                  checked={form.mobility === level.id}
                  onChange={(e) => setForm({ ...form, mobility: e.target.value })}
                  className="h-4 w-4 text-brand-500 focus:ring-brand-400"
                />
                <span className="text-slate-200">
                  {level.icon} {level.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="interest" className="block text-sm font-semibold text-white">
            What interests you most?
          </label>
          <select
            id="interest"
            required
            value={form.interest}
            onChange={(e) => setForm({ ...form, interest: e.target.value })}
            className="mt-2 w-full rounded-xl border border-white/20 bg-navy-950 px-4 py-3 text-white focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20"
          >
            <option value="">Select an option</option>
            <option value="workouts">Adaptive workouts</option>
            <option value="progress">Progress tracking</option>
            <option value="nutrition">Nutrition guidance</option>
            <option value="sports-pass">Sports Pass programs</option>
            <option value="all">Everything</option>
          </select>
        </div>

        <Button type="submit" size="lg" className="w-full">
          Join the waitlist
        </Button>

        <p className="text-center text-xs text-slate-400">
          We respect your privacy. No spam — just updates on RollnFitness launch.
        </p>
      </form>
    </PageShell>
  )
}
