
import { useAuth } from '@/modules/auth';

/**
 * API error class for standardized error handling
 */
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Base API URL - would be replaced with environment variable in production
 */
export const API_BASE_URL = '/api';

/**
 * API fetch utility that automatically handles auth tokens and standardized responses
 */
export const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Set default headers
  const headers = new Headers(options.headers);
  
  if (!headers.has('Content-Type') && !options.body) {
    headers.set('Content-Type', 'application/json');
  }
  
  // Add authorization header if token is provided
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Merge headers back into options
  const requestOptions: RequestInit = {
    ...options,
    headers
  };
  
  // Execute the request
  const response = await fetch(url, requestOptions);
  
  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return {} as T;
  }
  
  // Handle non-JSON responses
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    if (!response.ok) {
      throw new ApiError(response.statusText, response.status);
    }
    return {} as T;
  }
  
  // Parse JSON response
  const data = await response.json();
  
  // Handle error responses
  if (!response.ok) {
    throw new ApiError(
      data.message || response.statusText,
      response.status,
      data
    );
  }
  
  return data as T;
};

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
      apiFetch<T>(endpoint, { ...options, method: 'GET' }, token),
      
    /**
     * POST request
     */
    post: <T>(endpoint: string, data: any, options: RequestInit = {}) =>
      apiFetch<T>(
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
      apiFetch<T>(
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
      apiFetch<T>(
        endpoint,
        {
          ...options, 
          method: 'DELETE'
        },
        token
      ),
  };
};
