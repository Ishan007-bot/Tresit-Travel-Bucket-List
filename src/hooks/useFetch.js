import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for data fetching with loading and error states
 * @param {Function} fetchFunction - The function to fetch data
 * @param {Array} dependencies - Dependencies array for useEffect
 * @param {Boolean} immediate - Whether to fetch data immediately
 * @returns {Object} - Object containing data, loading, error, and execute function
 */
const useFetch = (fetchFunction, dependencies = [], immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Execute function to trigger fetch
  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching data...', fetchFunction.name || 'anonymous function');
      
      const result = await fetchFunction(...args);
      
      // Check if result is valid
      if (result === undefined || result === null) {
        console.warn('Fetch returned no data');
        setData(null);
        setError(new Error('No data returned from the server'));
        return null;
      }
      
      console.log('Fetch successful:', result);
      setData(result);
      return result;
    } catch (err) {
      console.error('Fetch error:', err);
      
      // Format error message for display
      const errorMessage = err.message || 'An unknown error occurred';
      setError(new Error(`Failed to fetch data: ${errorMessage}`));
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  // Function to retry fetch with incremented retry count
  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  // Initial fetch if immediate is true
  useEffect(() => {
    if (immediate || retryCount > 0) {
      execute();
    }
  }, [...dependencies, execute, retryCount]);

  return { 
    data, 
    loading, 
    error, 
    execute,
    retry
  };
};

export default useFetch; 