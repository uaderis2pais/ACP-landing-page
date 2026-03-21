import { cn } from '../../utils/cn';

export function Badge({ children, className, variant = 'default' }) {
  const variants = {
    default: 'bg-sushi-red text-white',
    outline: 'border border-sushi-gold text-sushi-gold bg-transparent',
  };

  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
