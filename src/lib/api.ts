
import { useAuth } from '@/modules/auth';
import { supabase, fromTable } from '@/integrations/supabase/client';

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
 * Now includes improved error handling and Supabase integration as fallback
 */
export const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> => {
  // Create a timeout promise to prevent hanging requests
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new ApiError('Request timed out after 15 seconds', 408));
    }, 15000);
  });

  try {
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
    
    // Execute the request with a timeout
    const response = await Promise.race([
      fetch(url, requestOptions),
      timeoutPromise
    ]);
    
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
  } catch (error) {
    console.log('API fetch failed, attempting to use Supabase directly:', error);
    
    // Try Supabase as a fallback
    return new Promise((resolve, reject) => {
      // Use setTimeout to prevent UI blocking
      setTimeout(async () => {
        try {
          // Extract the collection name from the endpoint
          const collection = endpoint.split('/').filter(Boolean)[0];
          
          if (collection) {
            // For simple GET requests, try to use Supabase as fallback
            if (options.method === 'GET' || !options.method) {
              const { data, error: supabaseError } = await fromTable(collection)
                .select('*');
                
              if (supabaseError) {
                reject(new ApiError(supabaseError.message, 500, supabaseError));
                return;
              }
              
              resolve(data as T);
              return;
            }
            
            // For POST requests (create)
            if (options.method === 'POST' && options.body) {
              const payload = JSON.parse(options.body.toString());
              const { data, error: supabaseError } = await fromTable(collection)
                .insert(payload)
                .select();
                
              if (supabaseError) {
                reject(new ApiError(supabaseError.message, 500, supabaseError));
                return;
              }
              
              resolve(data as T);
              return;
            }
            
            // For PUT requests (update)
            if (options.method === 'PUT' && options.body) {
              const id = endpoint.split('/').filter(Boolean)[1];
              const payload = JSON.parse(options.body.toString());
              
              if (id) {
                const { data, error: supabaseError } = await fromTable(collection)
                  .update(payload)
                  .eq('id', id)
                  .select();
                  
                if (supabaseError) {
                  reject(new ApiError(supabaseError.message, 500, supabaseError));
                  return;
                }
                
                resolve(data as T);
                return;
              }
            }
            
            // For DELETE requests
            if (options.method === 'DELETE') {
              const id = endpoint.split('/').filter(Boolean)[1];
              
              if (id) {
                const { error: supabaseError } = await fromTable(collection)
                  .delete()
                  .eq('id', id);
                  
                if (supabaseError) {
                  reject(new ApiError(supabaseError.message, 500, supabaseError));
                  return;
                }
                
                resolve({} as T);
                return;
              }
            }
          }
          
          // If we get here, we couldn't handle the request with Supabase
          // Fallback to original error
          if (error instanceof ApiError) {
            reject(error);
          } else {
            reject(new ApiError(
              error instanceof Error ? error.message : 'Unknown error occurred',
              500
            ));
          }
        } catch (err) {
          console.error('Error in Supabase fallback:', err);
          reject(err);
        }
      }, 0);
    });
  }
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
