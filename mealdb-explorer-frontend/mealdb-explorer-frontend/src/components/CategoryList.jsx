import React, { useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CategoryList = ({ categories, loading }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef(null);

  // Get selected category from URL
  const selectedCategory = location.pathname.includes('/category/')
    ? decodeURIComponent(location.pathname.split('/category/')[1])
    : null;

  const handleCategoryClick = (categoryName) => {
    if (selectedCategory === categoryName) {
      // Deselect - go back to home
      navigate('/');
    } else {
      navigate(`/category/${encodeURIComponent(categoryName)}`);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 h-10 w-24 bg-neutral-200 rounded-full animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Navigation Buttons - Hidden on mobile */}
      <button
        onClick={() => scroll('left')}
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 items-center justify-center w-8 h-8 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
        aria-label="Scroll left"
      >
        <FaChevronLeft className="w-4 h-4 text-neutral-600" />
      </button>

      <button
        onClick={() => scroll('right')}
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 items-center justify-center w-8 h-8 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
        aria-label="Scroll right"
      >
        <FaChevronRight className="w-4 h-4 text-neutral-600" />
      </button>

      {/* Categories */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar scroll-smooth"
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.name;
          
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className={clsx(
                'flex-shrink-0 px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200',
                'border-2 whitespace-nowrap',
                isSelected
                  ? 'bg-primary-500 text-white border-primary-600 scale-105 shadow-md'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-primary-300 hover:bg-primary-50'
              )}
              aria-pressed={isSelected}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryList;