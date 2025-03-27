
/**
 * This file is kept for backward compatibility
 * It re-exports everything from the new modular API structure
 */

export { ApiError, API_BASE_URL } from './apiClient';
export { apiFetchWithFallback as apiFetch } from './apiService';
export { useApi } from '@/hooks/useApi';
