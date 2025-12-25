import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import MealGrid from '../components/MealGrid';
import Button from '../components/shared/Button';
import { mealService } from '../api/mealService';
import { scrollToTop } from '../utils/helpers';
import { FaArrowLeft } from 'react-icons/fa';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const {
    data: meals,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ['search', query],
    () => mealService.searchMeals(query),
    {
      enabled: !!query,
      staleTime: 2 * 60 * 1000,
      cacheTime: 5 * 60 * 1000,
      retry: 2,
    }
  );

  useEffect(() => {
    scrollToTop(false);
  }, [query]);

  // If no query, redirect to home
  useEffect(() => {
    if (!query) {
      navigate('/');
    }
  }, [query, navigate]);

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
          Search Results
        </h1>
        
        <p className="text-neutral-600">
          {isLoading ? (
            'Searching...'
          ) : error ? (
            'Error searching for recipes'
          ) : (
            <>
              Found <span className="font-semibold">{meals?.length || 0}</span> recipe
              {meals?.length !== 1 ? 's' : ''} for "
              <span className="font-semibold">{query}</span>"
            </>
          )}
        </p>
      </div>

      {/* Results */}
      <MealGrid
        meals={meals}
        loading={isLoading}
        error={error?.message}
        emptyMessage={`No recipes found for "${query}"`}
        emptyDescription="Try searching with different keywords or browse categories"
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

export default SearchResultsPage;