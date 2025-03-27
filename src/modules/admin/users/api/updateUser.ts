
import { supabase } from '@/integrations/supabase/client';
import { User } from './types';
import { mapDbUserToFrontend } from './userServiceUtils';

export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  try {
    console.log('Updating user in database:', id, userData);
    
    // Transform frontend format to database format
    const dbUser = {
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      is_active: userData.isActive
    };
    
    console.log('Transformed update data for database:', dbUser);
    
    // Update user in Supabase
    const { data, error } = await supabase
      .from('users')
      .update(dbUser)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user in Supabase:', error);
      throw new Error(`Failed to update user: ${error.message}`);
    }
    
    console.log('User updated successfully, response data:', data);
    
    // Map response back to frontend format
    return mapDbUserToFrontend(data);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
