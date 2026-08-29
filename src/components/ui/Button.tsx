import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg border font-medium transition-all duration-200 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none';
    const variants = {
      primary: 'bg-[var(--color-primary)] text-[#111] border-[var(--color-primary)] hover:-translate-y-0.5',
      secondary: 'bg-transparent text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-text)]',
      danger: 'bg-red-600 text-white border-red-600',
      ghost: 'bg-transparent border-transparent hover:bg-black/5 dark:hover:bg-white/10',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2 text-sm',
      lg: 'h-12 px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
