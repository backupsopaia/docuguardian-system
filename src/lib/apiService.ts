
import { apiFetch, ApiError, API_BASE_URL } from './apiClient';
import { trySupabaseFallback } from './apiSupabaseFallback';

/**
 * Enhanced API fetch utility with Supabase fallback
 */
export const apiFetchWithFallback = async <T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> => {
  try {
    return await apiFetch<T>(endpoint, options, token);
  } catch (error) {
    // Try Supabase as a fallback
    return trySupabaseFallback<T>(endpoint, options, error);
  }
};

/**
 * Export everything from apiClient for backward compatibility
 */
export { ApiError, API_BASE_URL };
