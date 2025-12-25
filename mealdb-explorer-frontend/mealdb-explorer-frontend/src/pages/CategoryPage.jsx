import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import MealGrid from '../components/MealGrid';
import CategoryList from '../components/CategoryList';
import Button from '../components/shared/Button';
import { mealService } from '../api/mealService';
import { scrollToTop } from '../utils/helpers';
import { FaArrowLeft } from 'react-icons/fa';

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  // Fetch categories for the list
  const {
    data: categories,
    isLoading: categoriesLoading,
  } = useQuery('categories', mealService.getCategories, {
    staleTime: 5 * 60 * 1000,
  });

  // Fetch meals for selected category
  const {
    data: meals,
    isLoading: mealsLoading,
    error,
    refetch,
  } = useQuery(
    ['categoryMeals', category],
    () => mealService.getMealsByCategory(category),
    {
      enabled: !!category,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      retry: 2,
    }
  );

  useEffect(() => {
    scrollToTop(false);
  }, [category]);

  const handleBack = () => {
    navigate('/');
  };

  const handleRetry = () => {
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          leftIcon={<FaArrowLeft />}
          onClick={handleBack}
          className="mb-4"
        >
          Back to Home
        </Button>

        <h1 className="text-3xl font-bold font-display text-neutral-900 mb-2">
          {category} Recipes
        </h1>
        
        <p className="text-neutral-600">
          {mealsLoading ? (
            'Loading recipes...'
          ) : error ? (
            'Error loading recipes'
          ) : (
            <>
              <span className="font-semibold">{meals?.length || 0}</span> recipe
              {meals?.length !== 1 ? 's' : ''} found
            </>
          )}
        </p>
      </div>

      {/* Category Navigation */}
      <div className="mb-8">
        <CategoryList 
          categories={categories} 
          loading={categoriesLoading}
        />
      </div>

      {/* Meals Grid */}
      <MealGrid
        meals={meals}
        loading={mealsLoading}
        error={error?.message}
        emptyMessage={`No ${category} recipes found`}
        emptyDescription="Try selecting a different category"
      />

      {/* Retry Button on Error */}
      {error && (
        <div className="flex justify-center mt-8">
          <Button onClick={handleRetry}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;