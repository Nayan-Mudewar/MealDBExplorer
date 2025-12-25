import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import { FaUtensils, FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    } else if (location.pathname.includes('/search')) {
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <FaUtensils className="w-6 h-6 md:w-8 md:h-8" />
            <span className="font-display font-bold text-xl md:text-2xl">
              MealDB Explorer
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-neutral-700 hover:text-primary-600 transition-colors ${
                location.pathname === '/' ? 'text-primary-600 font-semibold' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/ingredient-matcher"
              className={`text-neutral-700 hover:text-primary-600 transition-colors ${
                location.pathname === '/ingredient-matcher' ? 'text-primary-600 font-semibold' : ''
              }`}
            >
              What Can I Cook?
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-600 hover:text-neutral-900"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white">
          <nav className="container mx-auto px-4 py-4">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-neutral-700 hover:text-primary-600"
            >
              Home
            </Link>
            <Link
              to="/ingredient-matcher"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-neutral-700 hover:text-primary-600"
            >
              What Can I Cook?
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;