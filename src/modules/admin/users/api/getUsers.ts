
import { User } from './types';
import { mapUserData, createMockUserData } from './userServiceUtils';
import { apiFetch } from '@/lib/api';

/**
 * Fetch all users
 */
export const getUsers = async (): Promise<User[]> => {
  try {
    // Attempt to fetch from API
    const data = await apiFetch<any[]>('/users');
    return data.map(mapUserData);
  } catch (error) {
    console.error('Error fetching users from API:', error);
    
    // Fall back to mock data if API call fails
    console.log('Using mock user data as fallback');
    return createMockUserData(15);
  }
};
