
import { useAuth } from '@/modules/auth';
import { apiFetchWithFallback } from '@/lib/apiService';

/**
 * React hook for making authenticated API requests
 */
export const useApi = () => {
  const { token } = useAuth();
  
  return {
    /**
     * GET request
     */
    get: <T>(endpoint: string, options: RequestInit = {}) => 
      apiFetchWithFallback<T>(endpoint, { ...options, method: 'GET' }, token),
      
    /**
     * POST request
     */
    post: <T>(endpoint: string, data: any, options: RequestInit = {}) =>
      apiFetchWithFallback<T>(
        endpoint,
        {
          ...options,
          method: 'POST',
          body: JSON.stringify(data)
        },
        token
      ),
      
    /**
     * PUT request
     */
    put: <T>(endpoint: string, data: any, options: RequestInit = {}) =>
      apiFetchWithFallback<T>(
        endpoint,
        {
          ...options,
          method: 'PUT',
          body: JSON.stringify(data)
        },
        token
      ),
      
    /**
     * DELETE request
     */
    delete: <T>(endpoint: string, options: RequestInit = {}) =>
      apiFetchWithFallback<T>(
        endpoint,
        {
          ...options, 
          method: 'DELETE'
        },
        token
      ),
  };
};
