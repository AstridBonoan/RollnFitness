type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-octane-500 text-carbon-950 hover:bg-octane-400 shadow-glow-octane font-bold uppercase tracking-wide',
  secondary:
    'bg-carbon-800 text-octane-300 border border-octane-700/50 hover:bg-carbon-700 hover:text-octane-200',
  ghost: 'text-steel-200 hover:bg-white/10',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`touch-target inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
