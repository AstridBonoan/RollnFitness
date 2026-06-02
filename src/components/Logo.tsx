import { site } from '../data/site'

interface LogoProps {
  variant?: 'compact' | 'full'
  glow?: boolean
  className?: string
}

const logoSrc = `${import.meta.env.BASE_URL}rolln-logo.png?v=transparent`

const logoFilter =
  'brightness(1.04) contrast(1.1) saturate(1.2) drop-shadow(0 0 20px rgba(0, 242, 255, 0.35)) drop-shadow(0 0 40px rgba(57, 255, 20, 0.12))'

const logoFilterNav =
  'brightness(1.03) contrast(1.08) saturate(1.15) drop-shadow(0 0 14px rgba(0, 242, 255, 0.3))'

const logoFilterCompact =
  'brightness(1.02) contrast(1.06) saturate(1.1) drop-shadow(0 0 10px rgba(0, 242, 255, 0.25))'

export function Logo({ variant = 'compact', glow = false, className = '' }: LogoProps) {
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <div className="relative w-full max-w-xl pt-2">
          <div
            className="pointer-events-none absolute inset-0 scale-110 rounded-full bg-octane-400/10 blur-3xl"
            aria-hidden="true"
          />
          <img
            src={logoSrc}
            alt={site.logoAlt}
            className="relative h-auto w-full bg-transparent object-contain object-center"
            style={{ filter: logoFilter }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoSrc}
        alt={site.logoAlt}
        className="relative h-12 w-auto max-w-[240px] shrink-0 bg-transparent object-contain object-left sm:h-14 sm:max-w-[280px]"
        style={{ filter: glow ? logoFilterNav : logoFilterCompact }}
      />
    </div>
  )
}
