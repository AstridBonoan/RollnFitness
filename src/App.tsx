import { useEffect, useState } from 'react'
import { SkipLink } from './components/SkipLink'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { HomePage } from './components/pages/HomePage'
import { WorkoutsPage } from './components/pages/WorkoutsPage'
import { ProgressPage } from './components/pages/ProgressPage'
import { NutritionPage } from './components/pages/NutritionPage'
import { ChallengesPage } from './components/pages/ChallengesPage'
import { SportsPassPage } from './components/pages/SportsPassPage'
import { JoinPage } from './components/pages/JoinPage'
import { clearSession, getCurrentUser, type User } from './lib/auth'
import './index.css'

function getRoute() {
  const raw = window.location.hash.replace('#', '') || '/'
  return raw.startsWith('/') ? raw : `/${raw}`
}

function App() {
  const [pathname, setPathname] = useState(getRoute)
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser)

  const refreshAuth = () => setCurrentUser(getCurrentUser())

  useEffect(() => {
    const handleHashChange = () => setPathname(getRoute())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigateTo = (path: string) => {
    if (getRoute() !== path) {
      window.location.hash = path
      setPathname(path)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSignOut = () => {
    clearSession()
    refreshAuth()
    navigateTo('/')
  }

  return (
    <div className="min-h-screen bg-navy-950">
      <SkipLink />
      <Navbar
        pathname={pathname}
        onNavigate={navigateTo}
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />
      <main id="main-content">
        {pathname === '/' && <HomePage onNavigate={navigateTo} />}
        {pathname === '/workouts' && <WorkoutsPage />}
        {pathname === '/progress' && <ProgressPage />}
        {pathname === '/nutrition' && <NutritionPage />}
        {pathname === '/challenges' && <ChallengesPage />}
        {pathname === '/sports-pass' && <SportsPassPage onNavigate={navigateTo} />}
        {pathname === '/join' && (
          <JoinPage onNavigate={navigateTo} onAuthChange={refreshAuth} />
        )}
      </main>
      <Footer onNavigate={navigateTo} />
    </div>
  )
}

export default App
