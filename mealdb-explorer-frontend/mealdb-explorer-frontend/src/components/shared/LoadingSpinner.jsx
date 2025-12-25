import React from 'react';
import clsx from 'clsx';

const LoadingSpinner = ({ 
  size = 'md',
  color = 'primary',
  fullScreen = false,
  text,
}) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4',
  };

  const colors = {
    primary: 'border-primary-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    neutral: 'border-neutral-500 border-t-transparent',
  };

  const spinner = (
    <div className={clsx(
      'animate-spin rounded-full',
      sizes[size],
      colors[color]
    )} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-50">
        {spinner}
        {text && (
          <p className="mt-4 text-neutral-600 font-medium">
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {spinner}
      {text && (
        <p className="mt-4 text-neutral-600 text-sm">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;