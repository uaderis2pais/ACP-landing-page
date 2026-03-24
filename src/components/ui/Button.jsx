import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const variants = {
  primary: 'bg-[#155E5D] text-white hover:bg-[#0f4645] shadow-md hover:shadow-lg',
  outline: 'bg-transparent border border-white/20 text-white hover:border-[#155E5D] hover:text-[#155E5D] hover:bg-white/5 shadow-sm',
  ghost: 'bg-transparent hover:bg-white/5 text-gray-400',
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
        'inline-flex items-center justify-center font-bold tracking-tight rounded-2xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none',
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
