import { site } from '../data/site'

interface LogoProps {
  variant?: 'compact' | 'full'
  className?: string
}

/** Intrinsic size of rolln-logo-mark.png (matches process-mark.mjs output). */
const MARK_WIDTH = 392
const MARK_HEIGHT = 176

const cache = 'mark-v4'
const base = import.meta.env.BASE_URL
const mark1x = `${base}rolln-logo-mark.png?v=${cache}`
const mark2x = `${base}rolln-logo-mark@2x.png?v=${cache}`

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

function LogoMark({ className }: { className: string }) {
  return (
    <img
      src={mark1x}
      srcSet={`${mark1x} 1x, ${mark2x} 2x`}
      width={MARK_WIDTH}
      height={MARK_HEIGHT}
      alt=""
      aria-hidden="true"
      decoding="async"
      fetchPriority="high"
      className={className}
    />
  )
}

export function Logo({ variant = 'compact', className = '' }: LogoProps) {
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center gap-5 text-center ${className}`}>
        <LogoMark className="h-36 w-auto max-w-full shrink-0 sm:h-44 lg:h-52" />
        <BrandText stacked />
      </div>
    )
  }

  return (
    <div className={`flex min-w-0 items-center gap-2.5 sm:gap-3 ${className}`}>
      <LogoMark className="h-12 w-auto max-w-[8.75rem] shrink-0 sm:h-14 sm:max-w-[10.5rem]" />
      <BrandText />
      <span className="sr-only">{site.logoAlt}</span>
    </div>
  )
}
