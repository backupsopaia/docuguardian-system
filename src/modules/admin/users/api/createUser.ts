
import { fromTable } from '@/integrations/supabase/client';
import { User, UserResponse } from './types';
import { mapDbUserToFrontend } from './userServiceUtils';

// Create a new user with non-blocking operations
export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  try {
    console.log('Creating user in database:', userData);
    
    // Transform frontend format to database format in a non-blocking way
    const dbUser = {
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      is_active: userData.isActive
    };
    
    const { data, error } = await fromTable('users').insert(dbUser).select();
    
    if (error) {
      console.error('Error creating user:', error);
      throw new Error(error.message);
    }
    
    // Handle case where data is null or not an array
    if (!data || !Array.isArray(data) || data.length === 0) {
      const errorMsg = 'Failed to create user: No data returned';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    console.log('User created successfully, response data:', data[0]);
    
    // Map response back to frontend format
    return mapDbUserToFrontend(data[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};
