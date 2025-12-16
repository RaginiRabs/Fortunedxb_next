import { useState, useCallback } from 'react';
import api, { apiFormData } from '@/lib/axios';

/**
 * Custom hook for Developer API operations
 * Provides CRUD operations with loading and error states
 */

// Fetch all developers
export function useDevelopers() {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDevelopers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/developers');
      
      if (res.data.success) {
        setDevelopers(res.data.data);
        return res.data.data;
      } else {
        throw new Error(res.data.message || 'Failed to fetch developers');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch developers';
      setError(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    return fetchDevelopers();
  }, [fetchDevelopers]);

  return {
    developers,
    loading,
    error,
    fetchDevelopers,
    refetch,
  };
}

// Fetch single developer
export function useDeveloper(developerId) {
  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDeveloper = useCallback(async (id = developerId) => {
    if (!id) return null;
    
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/developers/${id}`);
      
      if (res.data.success) {
        setDeveloper(res.data.data);
        return res.data.data;
      } else {
        throw new Error(res.data.message || 'Developer not found');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch developer';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [developerId]);

  return {
    developer,
    loading,
    error,
    fetchDeveloper,
  };
}

// Create developer mutation
export function useCreateDeveloper() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createDeveloper = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFormData.post('/api/developers', formData);
      
      if (res.data.success) {
        return {
          success: true,
          data: res.data.data,
          message: res.data.message || 'Developer created successfully',
        };
      } else {
        throw new Error(res.data.message || 'Failed to create developer');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create developer';
      setError(errorMsg);
      return {
        success: false,
        error: errorMsg,
        fields: err.response?.data?.error?.fields || {},
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createDeveloper,
    loading,
    error,
  };
}

// Update developer mutation
export function useUpdateDeveloper() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateDeveloper = useCallback(async (developerId, formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFormData.put(`/api/developers/${developerId}`, formData);
      
      if (res.data.success) {
        return {
          success: true,
          data: res.data.data,
          message: res.data.message || 'Developer updated successfully',
        };
      } else {
        throw new Error(res.data.message || 'Failed to update developer');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update developer';
      setError(errorMsg);
      return {
        success: false,
        error: errorMsg,
        fields: err.response?.data?.error?.fields || {},
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateDeveloper,
    loading,
    error,
  };
}

// Delete developer mutation
export function useDeleteDeveloper() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteDeveloper = useCallback(async (developerId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.delete(`/api/developers/${developerId}`);
      
      if (res.data.success) {
        return {
          success: true,
          message: res.data.message || 'Developer deleted successfully',
        };
      } else {
        throw new Error(res.data.message || 'Failed to delete developer');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete developer';
      setError(errorMsg);
      return {
        success: false,
        error: errorMsg,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    deleteDeveloper,
    loading,
    error,
  };
}

// Combined hook with all operations
export default function useDeveloperHook() {
  const developersHook = useDevelopers();
  const createHook = useCreateDeveloper();
  const updateHook = useUpdateDeveloper();
  const deleteHook = useDeleteDeveloper();

  return {
    // List operations
    developers: developersHook.developers,
    fetchDevelopers: developersHook.fetchDevelopers,
    developersLoading: developersHook.loading,
    developersError: developersHook.error,
    refetchDevelopers: developersHook.refetch,

    // Create operations
    createDeveloper: createHook.createDeveloper,
    createLoading: createHook.loading,
    createError: createHook.error,

    // Update operations
    updateDeveloper: updateHook.updateDeveloper,
    updateLoading: updateHook.loading,
    updateError: updateHook.error,

    // Delete operations
    deleteDeveloper: deleteHook.deleteDeveloper,
    deleteLoading: deleteHook.loading,
    deleteError: deleteHook.error,
  };
}