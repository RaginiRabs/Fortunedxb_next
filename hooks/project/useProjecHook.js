import { useState, useCallback } from 'react';
import api, { apiFormData } from '@/lib/axios';

/**
 * Custom hook for Project API operations
 * Provides CRUD operations with loading and error states
 */

// Fetch all projects
export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async (developerId = null) => {
    setLoading(true);
    setError(null);
    try {
      const params = developerId ? { developer_id: developerId } : {};
      const res = await api.get('/api/projects', { params });
      
      if (res.data.success) {
        setProjects(res.data.data);
        return res.data.data;
      } else {
        throw new Error(res.data.message || 'Failed to fetch projects');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch projects';
      setError(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    return fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    refetch,
  };
}

// Fetch single project
export function useProject(projectId) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProject = useCallback(async (id = projectId) => {
    if (!id) return null;
    
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/projects/${id}`);
      
      if (res.data.success) {
        setProject(res.data.data);
        return res.data.data;
      } else {
        throw new Error(res.data.message || 'Project not found');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch project';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  return {
    project,
    loading,
    error,
    fetchProject,
  };
}

// Create project mutation
export function useCreateProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createProject = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFormData.post('/api/projects', formData);
      
      if (res.data.success) {
        return {
          success: true,
          data: res.data.data,
          message: res.data.message || 'Project created successfully',
        };
      } else {
        throw new Error(res.data.message || 'Failed to create project');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create project';
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
    createProject,
    loading,
    error,
  };
}

// Update project mutation
export function useUpdateProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProject = useCallback(async (projectId, formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFormData.put(`/api/projects/${projectId}`, formData);
      
      if (res.data.success) {
        return {
          success: true,
          message: res.data.message || 'Project updated successfully',
        };
      } else {
        throw new Error(res.data.message || 'Failed to update project');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update project';
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
    updateProject,
    loading,
    error,
  };
}

// Delete project mutation
export function useDeleteProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteProject = useCallback(async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.delete(`/api/projects/${projectId}`);
      
      if (res.data.success) {
        return {
          success: true,
          message: res.data.message || 'Project deleted successfully',
        };
      } else {
        throw new Error(res.data.message || 'Failed to delete project');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete project';
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
    deleteProject,
    loading,
    error,
  };
}

// Get next sequence for project code
export function useProjectSequence() {
  const [loading, setLoading] = useState(false);

  const getNextSequence = useCallback(async (year, city) => {
    setLoading(true);
    try {
      const res = await api.get('/api/projects/next-sequence', {
        params: { year, city }
      });
      
      if (res.data.success) {
        return res.data.sequence;
      }
      return 1;
    } catch (err) {
      console.error('Failed to get sequence:', err);
      return 1;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getNextSequence,
    loading,
  };
}

// Combined hook with all operations
export default function useProjectHook() {
  const projectsHook = useProjects();
  const createHook = useCreateProject();
  const updateHook = useUpdateProject();
  const deleteHook = useDeleteProject();
  const sequenceHook = useProjectSequence();

  return {
    // List operations
    projects: projectsHook.projects,
    fetchProjects: projectsHook.fetchProjects,
    projectsLoading: projectsHook.loading,
    projectsError: projectsHook.error,
    refetchProjects: projectsHook.refetch,

    // Create operations
    createProject: createHook.createProject,
    createLoading: createHook.loading,
    createError: createHook.error,

    // Update operations
    updateProject: updateHook.updateProject,
    updateLoading: updateHook.loading,
    updateError: updateHook.error,

    // Delete operations
    deleteProject: deleteHook.deleteProject,
    deleteLoading: deleteHook.loading,
    deleteError: deleteHook.error,

    // Sequence
    getNextSequence: sequenceHook.getNextSequence,
  };
}