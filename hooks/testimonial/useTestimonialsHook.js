import { useState, useCallback } from 'react';
import api, { apiFormData } from '@/lib/axios';

/**
 * Custom hook for Testimonials API operations
 * Provides CRUD operations with loading and error states
 */

// Fetch all testimonials
export function useTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTestimonials = useCallback(async (options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      
      if (options.featured) params.set('featured', 'true');
      if (options.active !== undefined) params.set('active', options.active.toString());
      if (options.limit) params.set('limit', options.limit.toString());

      const queryString = params.toString();
      const url = `/api/testimonials${queryString ? `?${queryString}` : ''}`;
      
      const res = await api.get(url);

      if (res.data.success) {
        setTestimonials(res.data.data);
        return res.data.data;
      } else {
        throw new Error(res.data.message || 'Failed to fetch testimonials');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch testimonials';
      setError(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback((options = {}) => {
    return fetchTestimonials(options);
  }, [fetchTestimonials]);

  return {
    testimonials,
    loading,
    error,
    fetchTestimonials,
    refetch,
  };
}

// Fetch single testimonial
export function useTestimonial(testimonialId) {
  const [testimonial, setTestimonial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTestimonial = useCallback(async (id = testimonialId) => {
    if (!id) return null;

    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/testimonials/${id}`);

      if (res.data.success) {
        setTestimonial(res.data.data);
        return res.data.data;
      } else {
        throw new Error(res.data.message || 'Testimonial not found');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch testimonial';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [testimonialId]);

  return {
    testimonial,
    loading,
    error,
    fetchTestimonial,
  };
}

// Create testimonial mutation
export function useCreateTestimonial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createTestimonial = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFormData.post('/api/testimonials', formData);

      if (res.data.success) {
        return {
          success: true,
          data: res.data.data,
          message: res.data.message || 'Testimonial created successfully',
        };
      } else {
        throw new Error(res.data.message || 'Failed to create testimonial');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create testimonial';
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
    createTestimonial,
    loading,
    error,
  };
}

// Update testimonial mutation
export function useUpdateTestimonial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateTestimonial = useCallback(async (testimonialId, formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFormData.put(`/api/testimonials/${testimonialId}`, formData);

      if (res.data.success) {
        return {
          success: true,
          data: res.data.data,
          message: res.data.message || 'Testimonial updated successfully',
        };
      } else {
        throw new Error(res.data.message || 'Failed to update testimonial');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update testimonial';
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
    updateTestimonial,
    loading,
    error,
  };
}

// Delete testimonial mutation
export function useDeleteTestimonial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteTestimonial = useCallback(async (testimonialId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.delete(`/api/testimonials/${testimonialId}`);

      if (res.data.success) {
        return {
          success: true,
          message: res.data.message || 'Testimonial deleted successfully',
        };
      } else {
        throw new Error(res.data.message || 'Failed to delete testimonial');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete testimonial';
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
    deleteTestimonial,
    loading,
    error,
  };
}

// Combined hook with all operations
export default function useTestimonialsHook() {
  const testimonialsHook = useTestimonials();
  const createHook = useCreateTestimonial();
  const updateHook = useUpdateTestimonial();
  const deleteHook = useDeleteTestimonial();

  return {
    // List operations
    testimonials: testimonialsHook.testimonials,
    fetchTestimonials: testimonialsHook.fetchTestimonials,
    testimonialsLoading: testimonialsHook.loading,
    testimonialsError: testimonialsHook.error,
    refetchTestimonials: testimonialsHook.refetch,

    // Create operations
    createTestimonial: createHook.createTestimonial,
    createLoading: createHook.loading,
    createError: createHook.error,

    // Update operations
    updateTestimonial: updateHook.updateTestimonial,
    updateLoading: updateHook.loading,
    updateError: updateHook.error,

    // Delete operations
    deleteTestimonial: deleteHook.deleteTestimonial,
    deleteLoading: deleteHook.loading,
    deleteError: deleteHook.error,
  };
}