import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import RandomMealButton from '../components/RandomMealButton';
import CategoryList from '../components/CategoryList';
import MealGrid from '../components/MealGrid';
import { mealService } from '../api/mealService';
import { scrollToTop } from '../utils/helpers';

const HomePage = () => {
  const [displayMeals, setDisplayMeals] = useState([]);

  // Fetch categories
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery('categories', mealService.getCategories, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch popular meals (search with empty string gets all)
  const {
    data: meals,
    isLoading: mealsLoading,
    error: mealsError,
  } = useQuery(
    'popularMeals',
    () => mealService.searchMeals(''), // Empty search returns popular meals
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  );

  useEffect(() => {
    scrollToTop(false);
  }, []);

  useEffect(() => {
    if (meals) {
      // Shuffle and take first 12 for variety
      const shuffled = [...meals].sort(() => Math.random() - 0.5);
      setDisplayMeals(shuffled.slice(0, 12));
    }
  }, [meals]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section - Random Meal */}
      <section>
        <RandomMealButton />
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-2xl font-bold font-display text-neutral-900 mb-6">
          📂 Browse by Category
        </h2>
        <CategoryList 
          categories={categories} 
          loading={categoriesLoading}
        />
        {categoriesError && (
          <p className="text-red-600 text-sm mt-2">
            Failed to load categories
          </p>
        )}
      </section>

      {/* Popular Recipes Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-display text-neutral-900">
            🔥 Popular Recipes
          </h2>
        </div>
        
        <MealGrid
          meals={displayMeals}
          loading={mealsLoading}
          error={mealsError?.message}
          emptyMessage="No recipes available"
          emptyDescription="We couldn't load any recipes at the moment"
        />
      </section>
    </div>
  );
};

export default HomePage;