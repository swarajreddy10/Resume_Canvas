import { cn } from '@/lib/utils';
import { FileText, Loader2 } from 'lucide-react';

interface LoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'pulse' | 'brand';
  text?: string;
}

export function Loading({
  className,
  size = 'md',
  variant = 'spinner',
  text,
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  if (variant === 'brand') {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center space-y-4',
          className
        )}
      >
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 rounded-2xl animate-pulse"></div>
        </div>
        {text && <p className="text-sm text-gray-600 animate-pulse">{text}</p>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <div
            className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
            style={{ animationDelay: '0.1s' }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
            style={{ animationDelay: '0.2s' }}
          ></div>
        </div>
        {text && <span className="text-sm text-gray-600">{text}</span>}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Loader2
        className={cn('animate-spin text-blue-600', sizeClasses[size])}
      />
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  );
}

export function PageLoading({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <Loading variant="brand" text={text} />
    </div>
  );
}
