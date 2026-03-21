import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const variants = {
  primary: 'bg-sushi-red text-white hover:bg-red-700 shadow-[0_0_20px_rgba(217,30,24,0.3)]',
  outline: 'bg-transparent border border-white/30 text-white hover:bg-white/10',
  ghost: 'bg-transparent hover:bg-white/5 text-white',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-8 py-4',
  icon: 'p-2',
};

const Button = forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-sm transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
