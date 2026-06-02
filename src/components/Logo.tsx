import { site } from '../data/site'

interface LogoProps {
  variant?: 'compact' | 'full'
  className?: string
}

const logoSrc = `${import.meta.env.BASE_URL}rolln-logo.png`

const logoFilter =
  'brightness(1.08) contrast(1.08) saturate(1.15) drop-shadow(0 0 18px rgba(34,211,238,0.35)) drop-shadow(0 4px 16px rgba(34,211,238,0.2))'

const logoFilterCompact =
  'brightness(1.06) contrast(1.06) saturate(1.1) drop-shadow(0 0 10px rgba(34,211,238,0.3))'

export function Logo({ variant = 'compact', className = '' }: LogoProps) {
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <div className="relative w-full max-w-md">
          <div
            className="pointer-events-none absolute inset-0 scale-110 rounded-full bg-brand-400/15 blur-3xl"
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
      <img
        src={logoSrc}
        alt=""
        aria-hidden="true"
        className="h-10 w-auto shrink-0 bg-transparent object-contain sm:h-12"
        style={{ filter: logoFilterCompact }}
      />
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
