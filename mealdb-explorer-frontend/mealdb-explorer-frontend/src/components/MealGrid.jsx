import React from 'react';
import MealCard from './MealCard';
import { SkeletonCard } from './shared/Skeleton';
import EmptyState from './shared/EmptyState';

const MealGrid = ({ 
  meals, 
  loading, 
  error,
  emptyMessage = "No meals found",
  emptyDescription = "Try searching for something else or browse categories",
}) => {
  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        title="Oops! Something went wrong"
        description={error}
      />
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!meals || meals.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title={emptyMessage}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {meals.map((meal) => (
        <MealCard key={meal.id} meal={meal} />
      ))}
    </div>
  );
};

export default MealGrid;