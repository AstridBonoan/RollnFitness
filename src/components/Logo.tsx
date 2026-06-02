import { site } from '../data/site'

interface LogoProps {
  variant?: 'compact' | 'full'
  glow?: boolean
  className?: string
}

const logoSrc = `${import.meta.env.BASE_URL}rolln-logo.png?v=bronze-3`

const logoFilter =
  'brightness(1.05) contrast(1.08) saturate(1.15) drop-shadow(0 0 18px rgba(232, 148, 58, 0.45)) drop-shadow(0 4px 14px rgba(234, 88, 12, 0.25))'

const logoFilterNav =
  'brightness(1.04) contrast(1.06) saturate(1.1) drop-shadow(0 0 12px rgba(232, 148, 58, 0.35))'

const logoFilterCompact =
  'brightness(1.03) contrast(1.05) saturate(1.08) drop-shadow(0 0 8px rgba(200, 118, 42, 0.3))'

export function Logo({ variant = 'compact', glow = false, className = '' }: LogoProps) {
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <div className="relative w-full max-w-lg pt-2">
          <div
            className="pointer-events-none absolute inset-0 scale-110 rounded-full bg-brand-400/15 blur-3xl"
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
        className="relative h-11 w-auto max-w-[200px] shrink-0 bg-transparent object-contain object-left sm:h-12 sm:max-w-[220px]"
        style={{ filter: glow ? logoFilterNav : logoFilterCompact }}
      />
    </div>
  )
}
