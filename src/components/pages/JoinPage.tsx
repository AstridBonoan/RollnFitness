import { useEffect, useState } from 'react'
import {
  DEMO_CREDENTIALS,
  findUserByLogin,
  getCurrentUser,
  interestLabel,
  loadUsers,
  mobilityLabel,
  saveUsers,
  setSession,
  updateUser,
  type User,
} from '../../lib/auth'
import { mobilityLevels } from '../../data/site'
import { SignUpProgress } from '../SignUpProgress'
import { Button } from '../ui/Button'
import { PageShell } from '../ui/PageShell'

type AuthMode = 'sign-up' | 'sign-in'
type Step = 'auth' | 'onboarding' | 'goals' | 'complete'

const inputClass =
  'mt-2 w-full rounded-xl border border-white/20 bg-navy-950 px-4 py-3 text-white transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20'

const interests = [
  { value: 'workouts', label: 'Adaptive workouts' },
  { value: 'progress', label: 'Progress tracking' },
  { value: 'nutrition', label: 'Nutrition guidance' },
  { value: 'sports-pass', label: 'Sports Pass programs' },
  { value: 'all', label: 'Everything' },
] as const

interface JoinPageProps {
  onNavigate: (path: string) => void
  onAuthChange: () => void
}

export function JoinPage({ onNavigate, onAuthChange }: JoinPageProps) {
  const [mode, setMode] = useState<AuthMode>('sign-up')
  const [step, setStep] = useState<Step>('auth')
  const [error, setError] = useState('')
  const [mobility, setMobility] = useState('')
  const [interest, setInterest] = useState('')
  const [form, setForm] = useState({ email: '', username: '', login: '', password: '' })

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) return

    setForm({ email: user.email, username: user.username, login: user.username, password: user.password })
    setMobility(user.mobility ?? '')
    setInterest(user.interest ?? '')

    if (user.onboarded) {
      setStep('complete')
    } else if (user.mobility) {
      setStep('goals')
    } else {
      setStep('onboarding')
    }
  }, [])

  const resetForm = () => {
    setForm({ email: '', username: '', login: '', password: '' })
    setMobility('')
    setInterest('')
    setError('')
  }

  const switchMode = (next: AuthMode) => {
    setMode(next)
    setStep('auth')
    resetForm()
  }

  const beginOnboarding = (user: User) => {
    setForm({ email: user.email, username: user.username, login: user.username, password: user.password })
    setSession(user.email)
    onAuthChange()
    setMobility(user.mobility ?? '')
    setInterest(user.interest ?? '')
    setStep(user.mobility ? 'goals' : 'onboarding')
  }

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const users = loadUsers()
    const email = form.email.trim()
    const username = form.username.trim()

    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      setError('An account with this email already exists. Try signing in instead.')
      return
    }
    if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      setError('This username is already taken. Please choose another.')
      return
    }

    const newUser: User = {
      email,
      username,
      password: form.password,
      onboarded: false,
    }
    users.push(newUser)
    saveUsers(users)
    beginOnboarding(newUser)
  }

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const user = findUserByLogin(form.login, form.password)
    if (!user) {
      setError('Invalid username, email, or password. Please try again.')
      return
    }

    setSession(user.email)
    setForm({ email: user.email, username: user.username, login: user.username, password: user.password })
    onAuthChange()

    if (user.onboarded) {
      setMobility(user.mobility ?? '')
      setInterest(user.interest ?? '')
      onNavigate('/')
      return
    }

    beginOnboarding(user)
  }

  const handleOnboarding = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const updated = updateUser(form.email, { mobility, onboarded: false })
    if (!updated) {
      setError('Something went wrong. Please sign up again.')
      setStep('auth')
      return
    }

    setStep('goals')
  }

  const handleGoals = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const updated = updateUser(form.email, { interest, mobility, onboarded: true })
    if (!updated) {
      setError('Something went wrong. Please sign up again.')
      setStep('auth')
      return
    }

    onAuthChange()
    onNavigate('/')
  }

  if (step === 'complete') {
    const user = getCurrentUser()
    const username = user?.username ?? form.username

    return (
      <PageShell
        title={`Welcome, ${username}!`}
        description="Your RollnFitness account is set up. Here's what we tailored for you."
      >
        <SignUpProgress step={3} />

        <div className="mx-auto max-w-lg space-y-6">
          <div className="card-surface p-6 sm:p-8">
            <span className="text-4xl" aria-hidden="true">
              🎉
            </span>
            <p className="mt-4 text-lg text-slate-200">
              You're all set. Fitness for every body starts here.
            </p>

            {user?.mobility && (
              <dl className="mt-6 space-y-3 border-t border-white/10 pt-6 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-400">How you move</dt>
                  <dd className="font-medium text-white">{mobilityLabel(user.mobility)}</dd>
                </div>
                {user.interest && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-400">Focus area</dt>
                    <dd className="font-medium text-white">{interestLabel(user.interest)}</dd>
                  </div>
                )}
              </dl>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button size="lg" onClick={() => onNavigate('/workouts')}>
              Browse workouts
            </Button>
            <Button variant="secondary" size="lg" onClick={() => onNavigate('/progress')}>
              Track progress
            </Button>
            <Button variant="secondary" size="lg" onClick={() => onNavigate('/nutrition')}>
              Nutrition tips
            </Button>
            <Button variant="ghost" size="lg" onClick={() => onNavigate('/challenges')}>
              Join a challenge
            </Button>
          </div>
        </div>
      </PageShell>
    )
  }

  if (step === 'goals') {
    return (
      <PageShell
        title="What are your goals?"
        description="Step 3 of 3 — we'll prioritize content based on what matters most to you."
      >
        <div className="mx-auto max-w-lg">
          <SignUpProgress step={3} />

          <form
            onSubmit={handleGoals}
            className="space-y-6 card-surface p-6 sm:p-8"
            aria-label="Goals onboarding form"
          >
            <fieldset>
              <legend className="block text-sm font-semibold text-white">
                What interests you most?
              </legend>
              <div className="mt-3 space-y-2">
                {interests.map((item) => (
                  <label
                    key={item.value}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 px-4 py-3 transition-colors has-[:checked]:border-brand-500 has-[:checked]:bg-brand-950/40"
                  >
                    <input
                      type="radio"
                      name="interest"
                      value={item.value}
                      required
                      checked={interest === item.value}
                      onChange={(e) => setInterest(e.target.value)}
                      className="h-4 w-4 text-brand-500 focus:ring-brand-400"
                    />
                    <span className="text-slate-200">{item.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {error && (
              <p className="rounded-lg bg-red-950/50 px-4 py-3 text-sm text-red-300" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full">
              Finish setup
            </Button>
          </form>
        </div>
      </PageShell>
    )
  }

  if (step === 'onboarding') {
    const displayName = getCurrentUser()?.username ?? form.username

    return (
      <PageShell
        title={`Welcome, ${displayName}!`}
        description="Step 2 of 3 — tell us how you move so we can recommend the right adaptive workouts for you."
      >
        <div className="mx-auto max-w-lg">
          <SignUpProgress step={2} />

          <form
            onSubmit={handleOnboarding}
            className="space-y-6 card-surface p-6 sm:p-8"
            aria-label="Mobility onboarding form"
          >
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
                      checked={mobility === level.id}
                      onChange={(e) => setMobility(e.target.value)}
                      className="h-4 w-4 text-brand-500 focus:ring-brand-400"
                    />
                    <span className="text-slate-200">
                      {level.icon} {level.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {error && (
              <p className="rounded-lg bg-red-950/50 px-4 py-3 text-sm text-red-300" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full">
              Continue
            </Button>
          </form>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell
      title={mode === 'sign-up' ? 'Create your account' : 'Welcome back'}
      description={
        mode === 'sign-up'
          ? 'Step 1 of 3 — sign up for RollnFitness to access adaptive workouts, progress tracking, and more.'
          : 'Sign in to continue your RollnFitness journey.'
      }
    >
      <div className="mx-auto max-w-lg">
        {mode === 'sign-up' && <SignUpProgress step={1} />}

        <div
          className="mb-6 flex rounded-xl border border-white/10 bg-navy-950 p-1"
          role="tablist"
          aria-label="Sign up or sign in"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'sign-up'}
            onClick={() => switchMode('sign-up')}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
              mode === 'sign-up'
                ? 'bg-brand-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign up
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'sign-in'}
            onClick={() => switchMode('sign-in')}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
              mode === 'sign-in'
                ? 'bg-brand-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign in
          </button>
        </div>

        <form
          onSubmit={mode === 'sign-up' ? handleSignUp : handleSignIn}
          className="space-y-5 card-surface p-6 sm:p-8"
          aria-label={mode === 'sign-up' ? 'Sign up form' : 'Sign in form'}
        >
          {mode === 'sign-up' ? (
            <>
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
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-white">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  autoComplete="username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className={inputClass}
                />
              </div>
            </>
          ) : (
            <div>
              <label htmlFor="login" className="block text-sm font-semibold text-white">
                Username or email
              </label>
              <input
                id="login"
                type="text"
                required
                autoComplete="username"
                value={form.login}
                onChange={(e) => setForm({ ...form, login: e.target.value })}
                className={inputClass}
              />
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-white">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={inputClass}
            />
            {mode === 'sign-up' && (
              <p className="mt-1.5 text-xs text-slate-400">Must be at least 8 characters.</p>
            )}
          </div>

          {error && (
            <p className="rounded-lg bg-red-950/50 px-4 py-3 text-sm text-red-300" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full">
            {mode === 'sign-up' ? 'Create account' : 'Sign in'}
          </Button>

          <p className="text-center text-xs text-slate-400">
            {mode === 'sign-up' ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('sign-in')}
                  className="font-semibold text-brand-400 hover:text-brand-300"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                New to RollnFitness?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('sign-up')}
                  className="font-semibold text-brand-400 hover:text-brand-300"
                >
                  Create an account
                </button>
              </>
            )}
          </p>
        </form>

        <aside
          className="mt-6 rounded-xl border border-white/10 bg-navy-950/80 px-5 py-4 sm:px-6"
          aria-label="Demo account credentials to type in"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Demo credentials
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {mode === 'sign-up'
              ? 'Type these into the form above to create your demo account.'
              : 'After sign-up, sign in with your username or email and password.'}
          </p>
          <dl className="mt-3 space-y-2 font-mono text-sm">
            {mode === 'sign-up' ? (
              <>
                <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                  <dt className="text-slate-500">Email</dt>
                  <dd className="font-semibold text-brand-200">{DEMO_CREDENTIALS.email}</dd>
                </div>
                <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                  <dt className="text-slate-500">Username</dt>
                  <dd className="font-semibold text-brand-200">{DEMO_CREDENTIALS.username}</dd>
                </div>
              </>
            ) : (
              <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                <dt className="text-slate-500">Username or email</dt>
                <dd className="font-semibold text-brand-200">
                  {DEMO_CREDENTIALS.username} or {DEMO_CREDENTIALS.email}
                </dd>
              </div>
            )}
            <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
              <dt className="text-slate-500">Password</dt>
              <dd className="font-semibold text-brand-200">{DEMO_CREDENTIALS.password}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </PageShell>
  )
}
