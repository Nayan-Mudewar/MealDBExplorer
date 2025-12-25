// Debounce function
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Truncate text
export const truncate = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Format match percentage
export const formatPercentage = (percentage) => {
  if (typeof percentage !== 'number') return '0%';
  return `${Math.round(percentage)}%`;
};

// Get match color based on percentage
export const getMatchColor = (percentage) => {
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 60) return 'text-blue-600';
  if (percentage >= 40) return 'text-yellow-600';
  return 'text-orange-600';
};

// Get match badge variant
export const getMatchBadgeVariant = (percentage) => {
  if (percentage >= 80) return 'success';
  if (percentage >= 60) return 'info';
  if (percentage >= 40) return 'warning';
  return 'default';
};

// Extract YouTube video ID
export const getYouTubeVideoId = (url) => {
  if (!url) return null;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
};

// Format cooking instructions into steps
export const formatInstructions = (instructions) => {
  if (!instructions) return [];
  
  // Try to split by common step indicators
  const steps = instructions
    .split(/\r?\n/)
    .map(step => step.trim())
    .filter(step => step.length > 0);
  
  // If no newlines, try splitting by periods followed by capital letters
  if (steps.length === 1) {
    return instructions
      .split(/\.\s+(?=[A-Z])/)
      .map(step => step.trim())
      .filter(step => step.length > 0);
  }
  
  return steps;
};

// Check if image URL is valid
export const isValidImageUrl = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Get fallback image
export const getFallbackImage = () => {
  return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f5f5f5" width="400" height="400"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="32" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
};

// Local storage helpers
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },
};

// Scroll to top
export const scrollToTop = (smooth = true) => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto',
  });
};

// Check if element is in viewport
export const isInViewport = (element) => {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Generate unique ID
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};