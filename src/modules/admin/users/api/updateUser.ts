
import { fromTable } from '@/integrations/supabase/client';
import { User, UserResponse } from './types';
import { mapFrontendUserToDb, mapDbUserToFrontend } from './userServiceUtils';

// Update an existing user
export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  try {
    // Transform frontend format to database format
    const dbUser = mapFrontendUserToDb(userData);
    
    // Perform update in a way that doesn't block UI
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data, error } = await fromTable('users')
            .update(dbUser)
            .eq('id', id)
            .select();
          
          if (error) {
            console.error('Error updating user:', error);
            reject(new Error(error.message));
            return;
          }
          
          // Handle case where data is null or not an array
          if (!data || !Array.isArray(data) || data.length === 0) {
            reject(new Error('Failed to update user: No data returned'));
            return;
          }
          
          // Map response back to frontend format
          resolve(mapDbUserToFrontend(data[0]));
        } catch (err) {
          console.error('Error in updateUser async operation:', err);
          reject(err);
        }
      }, 0);
    });
  } catch (error) {
    console.error('Error preparing updateUser:', error);
    throw error;
  }
};
