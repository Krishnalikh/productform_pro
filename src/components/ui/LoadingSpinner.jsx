import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 'medium', text = '', className = '' }) {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className={`animate-spin text-blue-600 ${sizeClasses?.[size]}`} />
        {text && (
          <p className="text-sm text-gray-600">{text}</p>
        )}
      </div>
    </div>
  );
}