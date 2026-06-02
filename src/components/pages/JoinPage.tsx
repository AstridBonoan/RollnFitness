import { useState } from 'react'
import { mobilityLevels } from '../../data/site'
import { Button } from '../ui/Button'
import { PageShell } from '../ui/PageShell'

type AuthMode = 'sign-up' | 'sign-in'
type Step = 'auth' | 'onboarding' | 'complete'

interface StoredUser {
  email: string
  username: string
  password: string
  mobility?: string
  onboarded: boolean
}

const USERS_KEY = 'rollnfitness-users'

const DEMO_USER: StoredUser = {
  email: 'demo@rollnfitness.com',
  username: 'DemoUser',
  password: 'demo12345',
  mobility: 'wheelchair',
  onboarded: true,
}

const inputClass =
  'mt-2 w-full rounded-xl border border-white/20 bg-navy-950 px-4 py-3 text-white transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20'

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? (JSON.parse(raw) as StoredUser[]) : []
  } catch {
    return []
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function ensureDemoUser() {
  const users = loadUsers()
  const index = users.findIndex(
    (u) => u.email.toLowerCase() === DEMO_USER.email.toLowerCase(),
  )

  if (index >= 0) {
    users[index] = { ...DEMO_USER }
  } else {
    users.push({ ...DEMO_USER })
  }

  saveUsers(users)
}

export function JoinPage() {
  const [mode, setMode] = useState<AuthMode>('sign-up')
  const [step, setStep] = useState<Step>('auth')
  const [error, setError] = useState('')
  const [mobility, setMobility] = useState('')
  const [form, setForm] = useState({ email: '', username: '', password: '' })

  const resetForm = () => {
    setForm({ email: '', username: '', password: '' })
    setError('')
  }

  const switchMode = (next: AuthMode) => {
    setMode(next)
    setStep('auth')
    resetForm()
  }

  const handleDemoLogin = () => {
    ensureDemoUser()
    setForm({
      email: DEMO_USER.email,
      username: DEMO_USER.username,
      password: DEMO_USER.password,
    })
    setError('')
    setStep('complete')
  }

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const users = loadUsers()
    const emailTaken = users.some(
      (u) => u.email.toLowerCase() === form.email.trim().toLowerCase(),
    )
    const usernameTaken = users.some(
      (u) => u.username.toLowerCase() === form.username.trim().toLowerCase(),
    )

    if (emailTaken) {
      setError('An account with this email already exists. Try signing in instead.')
      return
    }
    if (usernameTaken) {
      setError('This username is already taken. Please choose another.')
      return
    }

    users.push({
      email: form.email.trim(),
      username: form.username.trim(),
      password: form.password,
      onboarded: false,
    })
    saveUsers(users)
    setStep('onboarding')
  }

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const users = loadUsers()
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === form.email.trim().toLowerCase() &&
        u.username.toLowerCase() === form.username.trim().toLowerCase() &&
        u.password === form.password,
    )

    if (!user) {
      setError('Invalid email, username, or password. Please try again.')
      return
    }

    setStep('complete')
  }

  const handleOnboarding = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const users = loadUsers()
    const index = users.findIndex(
      (u) => u.email.toLowerCase() === form.email.trim().toLowerCase(),
    )

    if (index === -1) {
      setError('Something went wrong. Please sign up again.')
      setStep('auth')
      return
    }

    users[index] = { ...users[index], mobility, onboarded: true }
    saveUsers(users)
    setStep('complete')
  }

  if (step === 'complete') {
    return (
      <PageShell
        title={`Welcome, ${form.username}!`}
        description="You're signed in to RollnFitness. Start exploring adaptive workouts built for how you move."
      >
        <div className="rounded-2xl border border-brand-700 bg-brand-950/30 p-8 text-center">
          <span className="text-5xl" aria-hidden="true">🎉</span>
          <p className="mt-4 text-lg text-slate-200">
            Your account is ready. Fitness for every body starts here.
          </p>
        </div>
      </PageShell>
    )
  }

  if (step === 'onboarding') {
    return (
      <PageShell
        title="Tell us how you move"
        description="This helps us recommend the right adaptive workouts for you. You only need to answer this once."
      >
        <form
          onSubmit={handleOnboarding}
          className="mx-auto max-w-lg space-y-6 card-surface p-6 sm:p-8"
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
      </PageShell>
    )
  }

  return (
    <PageShell
      title={mode === 'sign-up' ? 'Create your account' : 'Welcome back'}
      description={
        mode === 'sign-up'
          ? 'Sign up for RollnFitness to access adaptive workouts, progress tracking, and more.'
          : 'Sign in to continue your RollnFitness journey.'
      }
    >
      <div className="mx-auto max-w-lg">
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

          <div className="relative flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-white/10" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">or</span>
            <div className="h-px flex-1 bg-white/10" aria-hidden="true" />
          </div>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={handleDemoLogin}
          >
            Try demo login
          </Button>
          <p className="text-center text-xs text-slate-500">
            Demo account — no sign-up required. Explore the platform instantly.
          </p>

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
      </div>
    </PageShell>
  )
}
