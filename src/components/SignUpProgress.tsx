interface SignUpProgressProps {
  step: 1 | 2 | 3
}

const steps = [
  { num: 1, label: 'Account' },
  { num: 2, label: 'Mobility' },
  { num: 3, label: 'Goals' },
] as const

export function SignUpProgress({ step }: SignUpProgressProps) {
  return (
    <nav aria-label="Sign up progress" className="mb-8">
      <ol className="flex items-center justify-between gap-2">
        {steps.map(({ num, label }) => {
          const done = num < step
          const active = num === step

          return (
            <li key={num} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full items-center">
                {num > 1 && (
                  <div
                    className={`h-0.5 flex-1 ${done || active ? 'bg-brand-500' : 'bg-white/10'}`}
                    aria-hidden="true"
                  />
                )}
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    done
                      ? 'bg-brand-500 text-white'
                      : active
                        ? 'bg-brand-500/20 text-brand-300 ring-2 ring-brand-500'
                        : 'bg-white/10 text-slate-500'
                  }`}
                  aria-current={active ? 'step' : undefined}
                >
                  {done ? '✓' : num}
                </span>
                {num < 3 && (
                  <div
                    className={`h-0.5 flex-1 ${done ? 'bg-brand-500' : 'bg-white/10'}`}
                    aria-hidden="true"
                  />
                )}
              </div>
              <span
                className={`text-xs font-medium ${active ? 'text-brand-300' : 'text-slate-500'}`}
              >
                {label}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
