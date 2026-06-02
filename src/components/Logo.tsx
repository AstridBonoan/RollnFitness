import { site } from '../data/site'

interface LogoProps {
  variant?: 'compact' | 'full'
  glow?: boolean
  className?: string
}

const logoSrc = `${import.meta.env.BASE_URL}rolln-logo.png`

const logoFilter =
  'brightness(1.06) contrast(1.06) saturate(1.12) drop-shadow(0 0 14px rgba(34,211,238,0.28)) drop-shadow(0 4px 12px rgba(34,211,238,0.16))'

const logoFilterNav =
  'brightness(1.04) contrast(1.04) saturate(1.08) drop-shadow(0 0 10px rgba(34,211,238,0.24))'

const logoFilterCompact =
  'brightness(1.04) contrast(1.04) saturate(1.05) drop-shadow(0 0 6px rgba(34,211,238,0.15))'

export function Logo({ variant = 'compact', glow = false, className = '' }: LogoProps) {
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <div className="relative w-full max-w-md">
          <div
            className="pointer-events-none absolute inset-0 scale-110 rounded-full bg-brand-400/12 blur-2xl"
            aria-hidden="true"
          />
          <img
            src={logoSrc}
            alt={site.logoAlt}
            className="relative h-auto w-full bg-transparent object-contain"
            style={{ filter: logoFilter }}
          />
        </div>
        <p className="mt-4 font-display text-xl font-bold text-white sm:text-2xl">
          {site.fullName}
        </p>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      <div className="relative shrink-0">
        <img
          src={logoSrc}
          alt=""
          aria-hidden="true"
          className="relative h-10 w-auto shrink-0 bg-transparent object-contain sm:h-12"
          style={{ filter: glow ? logoFilterNav : logoFilterCompact }}
        />
      </div>
      <div className="min-w-0 text-left leading-tight">
        <p className="truncate font-display text-base font-bold text-white sm:text-lg">
          RollnFitness
        </p>
        <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-brand-300 sm:text-xs">
          by RollnEnterprises
        </p>
      </div>
    </div>
  )
}
