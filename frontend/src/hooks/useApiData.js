import { useState, useEffect, useCallback } from 'react';
import { useApi } from '@/contexts/ApiContext';

// Generic data fetching hook
export const useApiData = (apiFunction, dependencies = [], immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate, ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

// Specific hooks for common data types
export const useUserProfile = () => {
  const { getProfile } = useApi();
  return useApiData(getProfile);
};

export const useCourses = (filters = {}) => {
  const { getCourses } = useApi();
  return useApiData(() => getCourses(filters), [JSON.stringify(filters)]);
};

export const useAssignments = (filters = {}) => {
  const { getAssignments } = useApi();
  return useApiData(() => getAssignments(filters), [JSON.stringify(filters)]);
};

export const useDashboardStats = () => {
  const { getDashboardStats } = useApi();
  return useApiData(getDashboardStats);
};

export const useAdminUsers = (filters = {}) => {
  const { api } = useApi();
  return useApiData(() => api.users.getUsers(filters), [JSON.stringify(filters)]);
};