import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './shared/Card';
import Badge from './shared/Badge';
import { getFallbackImage, truncate } from '../utils/helpers';

const MealCard = ({ meal }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    navigate(`/meal/${meal.id}`);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <Card
      hoverable
      clickable
      onClick={handleClick}
      padding={false}
      className="overflow-hidden group"
      role="article"
      aria-label={`Recipe: ${meal.name}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <img
          src={imageError ? getFallbackImage() : meal.thumbnailUrl}
          alt={meal.name}
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {truncate(meal.name, 50)}
        </h3>

        <div className="flex items-center gap-2 flex-wrap">
          {meal.category && (
            <Badge variant="default" size="sm">
              {meal.category}
            </Badge>
          )}
          
          {meal.area && (
            <span className="text-sm text-neutral-500">
              {meal.area}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MealCard;