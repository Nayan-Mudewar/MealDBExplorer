import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDice } from 'react-icons/fa';
import Button from './shared/Button';
import { mealService } from '../api/mealService';

const RandomMealButton = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRandomMeal = async () => {
    setLoading(true);
    setError(null);

    try {
      const meal = await mealService.getRandomMeal();
      
      if (meal && meal.id) {
        // Small delay for better UX
        setTimeout(() => {
          navigate(`/meal/${meal.id}`);
        }, 300);
      } else {
        setError('Could not fetch random meal');
      }
    } catch (err) {
      console.error('Error fetching random meal:', err);
      setError(err.message || 'Failed to fetch random meal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white shadow-xl">
      <div className="max-w-md mx-auto text-center">
        <div className="text-5xl mb-4 animate-bounce-slow">
          🍽️
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold font-display mb-3">
          I'm Feeling Hungry
        </h2>
        
        <p className="text-primary-100 mb-6">
          Can't decide what to cook? Let us surprise you with a random recipe!
        </p>
        
        <Button
          onClick={handleRandomMeal}
          loading={loading}
          disabled={loading}
          variant="secondary"
          size="lg"
          leftIcon={<FaDice className="w-5 h-5" />}
          className="bg-white text-primary-600 hover:bg-primary-50"
        >
          {loading ? 'Finding a recipe...' : 'Surprise Me!'}
        </Button>
        
        {error && (
          <p className="mt-4 text-sm text-red-200">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default RandomMealButton;