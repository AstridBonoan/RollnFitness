export interface User {
  email: string
  username: string
  password: string
  mobility?: string
  interest?: string
  onboarded: boolean
}

const USERS_KEY = 'rollnfitness-users'
const SESSION_KEY = 'rollnfitness-session'

/** Hard-coded demo account — shown on Join page and used for one-click demo sign-up. */
export const DEMO_CREDENTIALS = {
  email: 'demo@rollnfitness.com',
  username: 'DemoUser',
  password: 'demo12345',
} as const

export const DEMO_USER: User = {
  ...DEMO_CREDENTIALS,
  onboarded: false,
}

export function isDemoSignIn(login: string, password: string): boolean {
  if (password !== DEMO_CREDENTIALS.password) return false
  const id = login.trim().toLowerCase()
  return id === DEMO_CREDENTIALS.email || id === DEMO_CREDENTIALS.username.toLowerCase()
}

export function findUserByLogin(login: string, password: string): User | null {
  const id = login.trim().toLowerCase()
  return (
    loadUsers().find(
      (u) =>
        u.password === password &&
        (u.email.toLowerCase() === id || u.username.toLowerCase() === id),
    ) ?? null
  )
}

export function loadUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? (JSON.parse(raw) as User[]) : []
  } catch {
    return []
  }
}

export function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getSessionEmail(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

export function setSession(email: string) {
  localStorage.setItem(SESSION_KEY, email.toLowerCase())
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function getCurrentUser(): User | null {
  const email = getSessionEmail()
  if (!email) return null
  return loadUsers().find((u) => u.email.toLowerCase() === email) ?? null
}

export function ensureDemoUser(): User {
  const users = loadUsers()
  const index = users.findIndex(
    (u) => u.email.toLowerCase() === DEMO_USER.email.toLowerCase(),
  )

  const demo: User = {
    ...DEMO_USER,
    ...(index >= 0 ? { mobility: users[index].mobility, interest: users[index].interest } : {}),
    onboarded: false,
  }

  if (index >= 0) {
    users[index] = demo
  } else {
    users.push(demo)
  }

  saveUsers(users)
  return demo
}

export function updateUser(email: string, patch: Partial<User>) {
  const users = loadUsers()
  const index = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase())
  if (index === -1) return null

  users[index] = { ...users[index], ...patch }
  saveUsers(users)
  return users[index]
}

export function mobilityLabel(id: string): string {
  const labels: Record<string, string> = {
    wheelchair: 'Wheelchair user',
    limited: 'Limited mobility',
    adaptive: 'Adaptive athlete',
    ambulatory: 'Ambulatory',
  }
  return labels[id] ?? id
}

export function interestLabel(id: string): string {
  const labels: Record<string, string> = {
    workouts: 'Adaptive workouts',
    progress: 'Progress tracking',
    nutrition: 'Nutrition guidance',
    'sports-pass': 'Sports Pass programs',
    all: 'Everything',
  }
  return labels[id] ?? id
}
