import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Header from './components/Header';
import ErrorBoundary from './components/shared/ErrorBoundary';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import CategoryPage from './pages/CategoryPage';
import MealDetailsPage from './pages/MealDetailsPage';
import IngredientMatcherPage from './pages/IngredientMatcherPage';

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="min-h-screen bg-neutral-50">
            <Header />
            
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/category/:category" element={<CategoryPage />} />
                <Route path="/meal/:id" element={<MealDetailsPage />} />
                <Route path="/ingredient-matcher" element={<IngredientMatcherPage />} />
                
                {/* 404 Page */}
                <Route 
                  path="*" 
                  element={
                    <div className="container mx-auto px-4 py-16 text-center">
                      <div className="text-6xl mb-4">🤔</div>
                      <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                        Page Not Found
                      </h1>
                      <p className="text-neutral-600 mb-6">
                        The page you're looking for doesn't exist.
                      </p>
                      <a
                        href="/"
                        className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                      >
                        Go Home
                      </a>
                    </div>
                  } 
                />
              </Routes>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-neutral-200 mt-16">
              <div className="container mx-auto px-4 py-8 text-center text-neutral-600">
                <p className="mb-2">
                  Built with ❤️ using{' '}
                  <a
                    href="https://www.themealdb.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    TheMealDB API
                  </a>
                </p>
                <p className="text-sm">
                  © {new Date().getFullYear()} MealDB Explorer. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;