import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useDebounce } from '../hooks/useDebounce';
import clsx from 'clsx';

const SearchBar = ({ 
  onSearch,
  placeholder = "Search recipes...",
  autoFocus = false,
  className,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef(null);

  useEffect(() => {
    if (debouncedQuery !== undefined) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={clsx('relative', className)}
    >
      <div className={clsx(
        'relative flex items-center bg-white rounded-lg border-2 transition-all duration-200',
        isFocused 
          ? 'border-primary-500 shadow-lg ring-2 ring-primary-100' 
          : 'border-neutral-200 hover:border-neutral-300'
      )}>
        <div className="pl-4 text-neutral-400">
          <FaSearch className="w-5 h-5" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="flex-1 px-4 py-3 bg-transparent border-none outline-none text-neutral-900 placeholder-neutral-400"
          aria-label="Search recipes"
        />
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="pr-4 text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label="Clear search"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;