
import { fromTable } from '@/integrations/supabase/client';
import { ApiError } from '@/lib/apiClient';

// Delete a user with improved error handling
export const deleteUser = async (id: string): Promise<void> => {
  if (!id) {
    throw new ApiError('User ID is required', 400);
  }

  console.log('Deleting user with ID:', id);
  
  try {
    const { error } = await fromTable('users').delete().eq('id', id);
    
    if (error) {
      console.error('Error deleting user from Supabase:', error);
      throw new ApiError(error.message, 500, error);
    }
    
    console.log('User successfully deleted');
  } catch (err) {
    console.error('Error in deleteUser operation:', err);
    
    // Standardize error format
    if (err instanceof ApiError) {
      throw err;
    }
    
    throw new ApiError(
      err instanceof Error ? err.message : 'Unknown error deleting user',
      500
    );
  }
};
