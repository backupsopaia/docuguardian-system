
import { supabase } from '@/integrations/supabase/client';
import { User } from './types';
import { createMockUserData, mapDbUserToFrontend } from './userServiceUtils';

// Get all users with improved error handling and direct Supabase query
export const getUsers = async (): Promise<User[]> => {
  try {
    console.log('Fetching users from database...');
    
    // Query users directly from the 'users' table with proper handling
    const { data, error } = await supabase.from('users').select('*');
    
    if (error) {
      console.error('Error fetching users:', error);
      console.log('Falling back to mock data due to error');
      return createMockUserData();
    }
    
    // Log successful data retrieval
    console.log(`Successfully fetched ${data?.length || 0} users from database`);
    
    // Handle null or undefined data
    if (!data || !Array.isArray(data)) {
      console.error('No data or invalid data returned from Supabase');
      return [];
    }
    
    // Map database users to frontend model
    const mappedUsers = data.map(user => mapDbUserToFrontend(user));
    console.log('Mapped users to frontend model:', mappedUsers.length);
    return mappedUsers;
  } catch (error) {
    console.error('Unexpected error fetching users:', error);
    // Return mock data as fallback
    return createMockUserData();
  }
};
