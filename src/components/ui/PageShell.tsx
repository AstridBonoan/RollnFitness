interface PageShellProps {
  title: string
  description: string
  children: React.ReactNode
}

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <div className="section-padding px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 max-w-3xl">
          <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">{description}</p>
        </header>
        {children}
      </div>
    </div>
  )
}
