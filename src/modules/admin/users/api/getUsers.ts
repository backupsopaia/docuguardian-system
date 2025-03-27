
import { supabase } from '@/integrations/supabase/client';
import { User } from './types';
import { mapDbUserToFrontend, createMockUserData } from './userServiceUtils';

/**
 * Fetches all users from the database
 */
export const getUsers = async (): Promise<User[]> => {
  try {
    console.log('Fetching users from database...');
    
    // Fetch users from Supabase
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    // Handle error from Supabase
    if (error) {
      console.error('Error fetching users from Supabase:', error);
      console.log('Falling back to mock data...');
      // Fall back to mock data
      return createMockUserData();
    }
    
    // If no data is returned, or empty array, fall back to mock data
    if (!data || data.length === 0) {
      console.log('No users found in database, falling back to mock data...');
      return createMockUserData();
    }
    
    console.log(`Successfully fetched ${data.length} users from database`);
    
    // Map DB users to frontend format
    return data.map(mapDbUserToFrontend);
  } catch (error) {
    console.error('Error in getUsers:', error);
    console.log('Falling back to mock data due to error...');
    // Fall back to mock data in case of error
    return createMockUserData();
  }
};
