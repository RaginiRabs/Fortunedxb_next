'use client';
import { useState, useCallback } from 'react';

/**
 * Parse API error response for display
 */
const parseApiError = (error) => {
  // Network error
  if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
    return {
      type: 'network',
      message: 'Unable to connect. Please check your internet connection.',
    };
  }

  // API returned error
  if (error.code) {
    switch (error.code) {
      case 'VALIDATION_ERROR':
        return {
          type: 'validation',
          message: error.message,
          fields: error.fields || {},
        };
      case 'NOT_FOUND':
        return {
          type: 'notFound',
          message: error.message || 'Resource not found',
        };
      case 'UNAUTHORIZED':
        return {
          type: 'auth',
          message: 'Please login to continue',
        };
      case 'DUPLICATE_ENTRY':
        return {
          type: 'duplicate',
          message: error.message || 'This entry already exists',
        };
      default:
        return {
          type: 'server',
          message: error.message || 'Something went wrong. Please try again.',
        };
    }
  }

  // Generic error
  return {
    type: 'unknown',
    message: error.message || 'An unexpected error occurred.',
  };
};

/**
 * Custom hook for API calls with loading, error, and success states
 */
export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const execute = useCallback(async (apiCall, options = {}) => {
    const { onSuccess, onError, showError = true } = options;

    setLoading(true);
    if (showError) setError(null);

    try {
      const response = await apiCall();
      const data = await response.json();

      if (!response.ok || !data.success) {
        const parsedError = parseApiError(data.error || { message: data.message });

        if (showError) setError(parsedError);
        if (onError) onError(parsedError, data);

        return { success: false, error: parsedError, data: null };
      }

      if (onSuccess) onSuccess(data);
      return { success: true, error: null, data: data.data };
    } catch (err) {
      const parsedError = parseApiError(err);

      if (showError) setError(parsedError);
      if (onError) onError(parsedError);

      return { success: false, error: parsedError, data: null };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    clearError,
    execute,
  };
}

export default useApi;