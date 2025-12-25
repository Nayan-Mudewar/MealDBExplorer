import React from 'react';
import clsx from 'clsx';

const Skeleton = ({ 
  variant = 'text',
  width,
  height,
  className,
  count = 1,
  ...props 
}) => {
  const baseStyles = 'animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:468px_100%]';

  const variants = {
    text: 'h-4 rounded',
    title: 'h-8 rounded',
    circle: 'rounded-full',
    rect: 'rounded-lg',
  };

  const skeletonStyle = {
    width: width || '100%',
    height: height || (variant === 'circle' ? width : undefined),
  };

  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={clsx(
        baseStyles,
        variants[variant],
        className
      )}
      style={skeletonStyle}
      {...props}
    />
  ));

  return count > 1 ? (
    <div className="space-y-3">
      {skeletons}
    </div>
  ) : (
    skeletons[0]
  );
};

// Skeleton variants for common patterns
export const SkeletonCard = ({ count = 1 }) => {
  const cards = Array.from({ length: count }, (_, i) => (
    <div key={i} className="bg-white rounded-lg overflow-hidden shadow-card">
      <Skeleton variant="rect" height="200px" className="rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton variant="title" width="80%" />
        <Skeleton variant="text" width="60%" />
      </div>
    </div>
  ));

  return count > 1 ? <>{cards}</> : cards[0];
};

export const SkeletonText = ({ lines = 3 }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton 
          key={i} 
          variant="text" 
          width={i === lines - 1 ? '70%' : '100%'} 
        />
      ))}
    </div>
  );
};

export default Skeleton;