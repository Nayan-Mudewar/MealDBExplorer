import React from 'react';
import clsx from 'clsx';

const Card = ({ 
  children, 
  className,
  hoverable = false,
  clickable = false,
  onClick,
  padding = true,
  ...props 
}) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow-card',
        padding && 'p-4',
        hoverable && 'transition-all duration-200 hover:shadow-card-hover hover:-translate-y-1',
        clickable && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(e);
        }
      } : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;