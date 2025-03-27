
import { supabase, fromTable } from '@/integrations/supabase/client';
import { ApiError } from './apiClient';

/**
 * Attempts to perform API operations using Supabase as a fallback
 * when the regular API request fails
 */
export const trySupabaseFallback = async <T>(
  endpoint: string, 
  options: RequestInit = {},
  error: any
): Promise<T> => {
  console.log('API fetch failed, attempting to use Supabase directly:', error);
  
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
};
