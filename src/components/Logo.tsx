import { site } from '../data/site'

interface LogoProps {
  variant?: 'compact' | 'full'
  className?: string
}

const cache = 'mark-v3'
const markSrc = `${import.meta.env.BASE_URL}rolln-logo-mark.png?v=${cache}`

function BrandText({ stacked }: { stacked?: boolean }) {
  if (stacked) {
    return (
      <div className="flex flex-col items-center gap-0.5 text-center">
        <span className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {site.name}
        </span>
        <span className="text-sm font-medium text-octane-300/90 sm:text-base">
          by {site.parentCompany}
        </span>
      </div>
    )
  }

  return (
    <div className="min-w-0 leading-tight">
      <span className="block truncate font-display text-base font-bold tracking-tight text-white sm:text-lg">
        {site.name}
      </span>
      <span className="block truncate text-[11px] font-medium text-slate-400 sm:text-xs">
        by {site.parentCompany}
      </span>
    </div>
  )
}

export function Logo({ variant = 'compact', className = '' }: LogoProps) {
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center gap-5 text-center ${className}`}>
        <img
          src={markSrc}
          alt=""
          aria-hidden="true"
          className="h-auto w-full max-w-[280px] bg-transparent object-contain sm:max-w-[320px]"
        />
        <BrandText stacked />
      </div>
    )
  }

  return (
    <div className={`flex min-w-0 items-center gap-2.5 sm:gap-3 ${className}`}>
      <img
        src={markSrc}
        alt=""
        aria-hidden="true"
        className="h-10 w-10 shrink-0 bg-transparent object-contain sm:h-11 sm:w-11"
      />
      <BrandText />
      <span className="sr-only">{site.logoAlt}</span>
    </div>
  )
}
