
import { User } from './types';
import { supabase } from '@/integrations/supabase/client';
import { mockUsers } from '@/modules/auth/data/users';

export const getUsersWithSupabase = async (): Promise<User[]> => {
  try {
    console.log('Fetching users from Supabase...');
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    if (Array.isArray(data)) {
      return data.map(user => ({
        ...user,
        // Garante que lastLogin é um objeto Date
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : new Date()
      }));
    } else {
      console.error('Error fetching users from Supabase:', 'Received non-array data:', data);
      return fallbackToMockUsers();
    }
  } catch (error) {
    console.error('Error fetching users from Supabase:', error);
    return fallbackToMockUsers();
  }
};

const fallbackToMockUsers = (): User[] => {
  console.log('Using mock user data as fallback');
  return [...mockUsers].map(({ password, ...user }) => ({
    ...user,
    lastLogin: new Date()
  }));
};
