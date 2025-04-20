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

  // Execute function to trigger fetch
  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  // Initial fetch if immediate is true
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [...dependencies, execute]);

  return { data, loading, error, execute };
};

export default useFetch; 