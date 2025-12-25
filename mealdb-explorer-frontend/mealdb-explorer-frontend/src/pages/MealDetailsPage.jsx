import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import Button from '../components/shared/Button';
import Badge from '../components/shared/Badge';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { mealService } from '../api/mealService';
import { 
  getFallbackImage, 
  getYouTubeVideoId, 
  formatInstructions,
  scrollToTop 
} from '../utils/helpers';
import { FaArrowLeft, FaCheckCircle, FaCircle, FaYoutube } from 'react-icons/fa';

const MealDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState({});

  const {
    data: meal,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ['meal', id],
    () => mealService.getMealById(id),
    {
      enabled: !!id,
      staleTime: 10 * 60 * 1000,
      retry: 2,
    }
  );

  useEffect(() => {
    scrollToTop(false);
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const toggleIngredient = (index) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const youtubeVideoId = meal?.youtubeUrl ? getYouTubeVideoId(meal.youtubeUrl) : null;
  const instructions = meal?.instructions ? formatInstructions(meal.instructions) : [];

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading recipe..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Recipe Not Found
          </h2>
          <p className="text-neutral-600 mb-6">
            {error.message || 'We could not find this recipe'}
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={handleBack} variant="outline">
              Go Back
            </Button>
            <Button onClick={refetch}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!meal) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <div className="relative bg-white">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            leftIcon={<FaArrowLeft />}
            onClick={handleBack}
          >
            Back
          </Button>
        </div>

        <div className="container mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image */}
            <div className="relative aspect-square lg:aspect-auto lg:h-[500px] rounded-2xl overflow-hidden shadow-xl">
              <img
                src={imageError ? getFallbackImage() : meal.thumbnailUrl}
                alt={meal.name}
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-bold font-display text-neutral-900 mb-4">
                {meal.name}
              </h1>

              <div className="flex flex-wrap gap-3 mb-6">
                {meal.category && (
                  <Badge variant="primary" size="lg">
                    {meal.category}
                  </Badge>
                )}
                {meal.area && (
                  <Badge variant="default" size="lg">
                    🌍 {meal.area}
                  </Badge>
                )}
                {meal.tags && meal.tags.map((tag, index) => (
                  <Badge key={index} variant="default" size="lg">
                    {tag}
                  </Badge>
                ))}
              </div>

              {meal.ingredients && meal.ingredients.length > 0 && (
                <div className="text-neutral-600 text-lg">
                  <span className="font-semibold">{meal.ingredients.length}</span> ingredients
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Instructions */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card">
              <h2 className="text-2xl font-bold font-display text-neutral-900 mb-6 flex items-center gap-2">
                👨‍🍳 Instructions
              </h2>

              <div className="space-y-4">
                {instructions.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-600 font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                    <p className="flex-1 text-neutral-700 leading-relaxed pt-1">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Video */}
            {youtubeVideoId && (
              <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card">
                <h2 className="text-2xl font-bold font-display text-neutral-900 mb-6 flex items-center gap-2">
                  <FaYoutube className="text-red-600" />
                  Video Tutorial
                </h2>

                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                    title="Recipe video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ingredients */}
            <section className="bg-white rounded-2xl p-6 shadow-card sticky top-24">
              <h2 className="text-2xl font-bold font-display text-neutral-900 mb-6 flex items-center gap-2">
                📝 Ingredients
              </h2>

              <div className="space-y-3">
                {meal.ingredients && meal.ingredients.length > 0 ? (
                  meal.ingredients.map((ingredient, index) => (
                    <button
                      key={index}
                      onClick={() => toggleIngredient(index)}
                      className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors text-left group"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {checkedIngredients[index] ? (
                          <FaCheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <FaCircle className="w-5 h-5 text-neutral-300 group-hover:text-neutral-400" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`font-medium ${
                            checkedIngredients[index] 
                              ? 'line-through text-neutral-400' 
                              : 'text-neutral-900'
                          }`}>
                            {ingredient.name}
                          </span>
                          <span className="text-sm text-neutral-500 whitespace-nowrap">
                            {ingredient.measure}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-neutral-500 text-center py-4">
                    No ingredients listed
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealDetailsPage;