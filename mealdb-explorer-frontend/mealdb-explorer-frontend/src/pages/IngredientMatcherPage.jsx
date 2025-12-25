import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import Button from '../components/shared/Button';
import Badge from '../components/shared/Badge';
import Card from '../components/shared/Card';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';
import { mealService } from '../api/mealService';
import { formatPercentage, getMatchColor, getMatchBadgeVariant, getFallbackImage } from '../utils/helpers';
import { FaPlus, FaTimes, FaArrowLeft, FaSearch } from 'react-icons/fa';

const IngredientMatcherPage = () => {
  const navigate = useNavigate();
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [minMatch, setMinMatch] = useState(30);

  const mutation = useMutation(
    (data) => mealService.whatCanICook(data.ingredients, data.minMatchPercentage),
    {
      onError: (error) => {
        console.error('Error finding matches:', error);
      },
    }
  );

  const handleAddIngredient = () => {
    const trimmed = ingredientInput.trim();
    
    if (trimmed && !ingredients.includes(trimmed.toLowerCase())) {
      setIngredients([...ingredients, trimmed]);
      setIngredientInput('');
    }
  };

  const handleRemoveIngredient = (ingredient) => {
    setIngredients(ingredients.filter(ing => ing !== ingredient));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleFindMatches = () => {
    if (ingredients.length === 0) {
      return;
    }

    mutation.mutate({
      ingredients,
      minMatchPercentage: minMatch,
    });
  };

  const handleReset = () => {
    setIngredients([]);
    setIngredientInput('');
    mutation.reset();
  };

  const handleMealClick = (mealId) => {
    navigate(`/meal/${mealId}`);
  };

  const results = mutation.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          leftIcon={<FaArrowLeft />}
          onClick={() => navigate('/')}
          className="mb-4"
        >
          Back to Home
        </Button>

        <h1 className="text-3xl md:text-4xl font-bold font-display text-neutral-900 mb-3">
          🍳 What Can I Cook?
        </h1>
        <p className="text-neutral-600 text-lg">
          Enter the ingredients you have, and we'll find recipes you can make!
        </p>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ingredient Input */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">
              Your Ingredients
            </h2>

            {/* Input Field */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., chicken, rice, onion"
                className="flex-1 px-4 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
              />
              <Button
                onClick={handleAddIngredient}
                disabled={!ingredientInput.trim()}
                leftIcon={<FaPlus />}
                size="md"
              >
                Add
              </Button>
            </div>

            {/* Ingredient List */}
            <div className="mb-4 min-h-[100px]">
              {ingredients.length === 0 ? (
                <p className="text-neutral-400 text-center py-8 text-sm">
                  Start adding ingredients...
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ingredient, index) => (
                    <Badge
                      key={index}
                      variant="primary"
                      size="md"
                      className="flex items-center gap-2"
                    >
                      {ingredient}
                      <button
                        onClick={() => handleRemoveIngredient(ingredient)}
                        className="hover:text-primary-900"
                        aria-label={`Remove ${ingredient}`}
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Match Threshold */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Minimum Match: {minMatch}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={minMatch}
                onChange={(e) => setMinMatch(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-neutral-500 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleFindMatches}
                disabled={ingredients.length === 0 || mutation.isLoading}
                loading={mutation.isLoading}
                fullWidth
                leftIcon={<FaSearch />}
              >
                Find Recipes
              </Button>
              
              {(ingredients.length > 0 || mutation.data) && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  disabled={mutation.isLoading}
                >
                  Reset
                </Button>
              )}
            </div>

            {/* Error Message */}
            {mutation.isError && (
              <p className="mt-4 text-red-600 text-sm">
                {mutation.error?.message || 'Failed to find recipes'}
              </p>
            )}
          </Card>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          {mutation.isLoading && (
            <LoadingSpinner text="Finding matching recipes..." />
          )}

          {mutation.isSuccess && results.length === 0 && (
            <EmptyState
              icon="😔"
              title="No recipes found"
              description={`We couldn't find any recipes with at least ${minMatch}% match. Try lowering the minimum match percentage or adding more common ingredients.`}
            />
          )}

          {mutation.isSuccess && results.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                Found {results.length} Recipe{results.length !== 1 ? 's' : ''}
              </h2>

              <div className="space-y-4">
                {results.map((result, index) => (
                  <Card
                    key={index}
                    hoverable
                    clickable
                    onClick={() => handleMealClick(result.meal.id)}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Image */}
                      <div className="sm:w-32 sm:h-32 aspect-square flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100">
                        <img
                          src={result.meal.thumbnailUrl || getFallbackImage()}
                          alt={result.meal.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="font-bold text-lg text-neutral-900 line-clamp-1">
                            {result.meal.name}
                          </h3>
                          
                          <Badge
                            variant={getMatchBadgeVariant(result.matchPercentage)}
                            size="lg"
                            className="flex-shrink-0"
                          >
                            {formatPercentage(result.matchPercentage)}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 mb-3 text-sm text-neutral-600">
                          <Badge variant="default" size="sm">
                            {result.meal.category}
                          </Badge>
                          {result.meal.area && (
                            <span>{result.meal.area}</span>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-green-600 font-medium">
                              ✓ {result.matchedIngredientsCount} ingredients you have
                            </span>
                          </div>
                          
                          {result.missingIngredients.length > 0 && (
                            <div className="text-sm text-neutral-600">
                              <span className="font-medium">Need:</span>{' '}
                              {result.missingIngredients.slice(0, 3).join(', ')}
                              {result.missingIngredients.length > 3 && (
                                <span> +{result.missingIngredients.length - 3} more</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {!mutation.isLoading && !mutation.isSuccess && !mutation.isError && (
            <EmptyState
              icon="🔍"
              title="Ready to cook?"
              description="Add your ingredients and click 'Find Recipes' to discover what you can make!"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default IngredientMatcherPage;