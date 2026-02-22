"use client";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'white';
  label?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'primary',
  label = 'Loading...'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  const variantClasses = {
    primary: 'border-blue-600 border-t-transparent',
    secondary: 'border-slate-600 border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  return (
    <div className="flex items-center justify-center" role="status" aria-live="polite">
      <div
        className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-full animate-spin`}
        aria-label={label}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
