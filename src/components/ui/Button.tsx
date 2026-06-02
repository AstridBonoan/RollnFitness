type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand-500 text-white hover:bg-brand-400 shadow-glow',
  secondary:
    'bg-navy-800 text-brand-300 border border-brand-700 hover:bg-navy-700 hover:text-brand-200',
  ghost: 'text-slate-200 hover:bg-white/10',
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
      className={`touch-target inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-200 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
