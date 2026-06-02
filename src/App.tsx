import { useEffect, useState } from 'react'
import { useTheme } from './hooks/useTheme'
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
import './index.css'

function getRoute() {
  const raw = window.location.hash.replace('#', '') || '/'
  return raw.startsWith('/') ? raw : `/${raw}`
}

function App() {
  const { isDark, toggleTheme } = useTheme()
  const [pathname, setPathname] = useState(getRoute)

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

  return (
    <div className="min-h-screen bg-surface transition-colors duration-300 dark:bg-surface-dark">
      <SkipLink />
      <Navbar
        isDark={isDark}
        onThemeToggle={toggleTheme}
        pathname={pathname}
        onNavigate={navigateTo}
      />
      <main id="main-content">
        {pathname === '/' && <HomePage onNavigate={navigateTo} />}
        {pathname === '/workouts' && <WorkoutsPage />}
        {pathname === '/progress' && <ProgressPage />}
        {pathname === '/nutrition' && <NutritionPage />}
        {pathname === '/challenges' && <ChallengesPage />}
        {pathname === '/sports-pass' && <SportsPassPage onNavigate={navigateTo} />}
        {pathname === '/join' && <JoinPage />}
      </main>
      <Footer onNavigate={navigateTo} />
    </div>
  )
}

export default App
