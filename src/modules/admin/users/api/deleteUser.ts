
import { fromTable } from '@/integrations/supabase/client';
import { DeleteUserResponse } from './types';

// Delete a user with non-blocking pattern
export const deleteUser = async (id: string): Promise<void> => {
  // Return a promise that executes the deletion in a non-blocking way
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const { error } = await fromTable('users').delete().eq('id', id);
        
        if (error) {
          console.error('Error deleting user:', error);
          reject(new Error(error.message));
          return;
        }
        
        resolve();
      } catch (err) {
        console.error('Error in deleteUser async operation:', err);
        reject(err);
      }
    }, 0);
  });
};
