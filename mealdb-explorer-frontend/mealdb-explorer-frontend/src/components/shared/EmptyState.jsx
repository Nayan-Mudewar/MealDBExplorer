import React from 'react';
import Button from './Button';

const EmptyState = ({ 
  icon,
  title,
  description,
  action,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="mb-4 text-6xl">
          {icon}
        </div>
      )}
      
      {title && (
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">
          {title}
        </h3>
      )}
      
      {description && (
        <p className="text-neutral-600 mb-6 max-w-md">
          {description}
        </p>
      )}
      
      {action && onAction && (
        <Button onClick={onAction}>
          {actionLabel || action}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;