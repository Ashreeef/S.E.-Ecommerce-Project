import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fullScreen?: boolean;
  text?: string;
}

const sizeClasses = {
  sm: 'h-6 w-6 border-2',
  md: 'h-10 w-10 border-2',
  lg: 'h-12 w-12 border-b-2',
  xl: 'h-16 w-16 border-b-2',
};

export function LoadingSpinner({ 
  size = 'lg', 
  className,
  fullScreen = false,
  text
}: LoadingSpinnerProps) {
  const spinner = (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <div className={cn(
        'animate-spin rounded-full border-gray-900',
        sizeClasses[size]
      )} />
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}
