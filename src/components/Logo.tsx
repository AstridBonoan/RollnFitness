import { site } from '../data/site'

interface LogoProps {
  variant?: 'compact' | 'full'
  className?: string
}

const logoSrc = `${import.meta.env.BASE_URL}rolln-logo.png`

export function Logo({ variant = 'compact', className = '' }: LogoProps) {
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <img
          src={logoSrc}
          alt={site.logoAlt}
          className="h-auto w-full max-w-md object-contain drop-shadow-[0_4px_24px_rgba(34,211,238,0.15)]"
        />
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
        className="h-10 w-auto shrink-0 object-contain drop-shadow-sm sm:h-12"
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
