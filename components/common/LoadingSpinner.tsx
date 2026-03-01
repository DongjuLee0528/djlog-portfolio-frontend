import React from 'react';
import { COLORS } from '../../src/constants';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16'
} as const;

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = React.memo(({
  message = "로딩 중...",
  size = 'md',
  className = ''
}) => {
  const spinnerSize = SIZES[size];

  return (
    <div className={`flex justify-center items-center ${className}`} role="status" aria-live="polite">
      <div
        className={`${spinnerSize} border-4 border-[${COLORS.primary}]/30 border-t-[${COLORS.primary}] rounded-full animate-spin`}
        aria-hidden="true"
      />
      {message && (
        <span className={`ml-3 text-[${COLORS.text}]/60`} aria-label={message}>
          {message}
        </span>
      )}
      <span className="sr-only">{message}</span>
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';