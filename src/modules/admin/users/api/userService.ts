
import { supabase, fromTable } from '@/integrations/supabase/client';
import { mockUsers } from '@/modules/admin/users/data/users';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  department: string;
  isActive: boolean;
  created_at?: string;
  updated_at?: string;
}

// Get all users with optimized error handling
export const getUsers = async (): Promise<User[]> => {
  // Create a promise that will resolve after a timeout
  const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) => {
    setTimeout(() => {
      resolve({
        data: null,
        error: new Error('Request timed out after 10 seconds'),
      });
    }, 10000);
  });

  try {
    // Use Promise.race to either get data or timeout
    const fetchPromise = fromTable('users').select('*');
    const result = await Promise.race([fetchPromise, timeoutPromise]);
    
    // Destructure after checking result is valid
    const { data, error } = result || { data: null, error: new Error('Invalid response') };
    
    if (error) {
      console.error('Error fetching users:', error);
      // Return mock data in a non-blocking way
      return Promise.resolve(mockUsers.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        isActive: user.isActive
      })));
    }
    
    // Handle null or undefined data
    if (!data) {
      console.error('No data returned from API');
      return [];
    }
    
    // Ensure data is an array before mapping
    if (!Array.isArray(data)) {
      console.error('Expected array but got:', typeof data);
      return [];
    }
    
    // Process data in a non-blocking way using a small delay
    return new Promise(resolve => {
      setTimeout(() => {
        const mappedData = data.map(user => ({
          id: user.id,
          name: user.name || '',
          email: user.email || '',
          role: user.role as 'admin' | 'user',
          department: user.department || '',
          isActive: user.is_active ?? false  // Use nullish coalescing for boolean
        }));
        resolve(mappedData);
      }, 0);
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    // Return mock data in a non-blocking way
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockUsers.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          isActive: user.isActive
        })));
      }, 0);
    });
  }
};

// Create a new user with non-blocking operations
export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  try {
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
      throw new Error('Failed to create user: No data returned');
    }
    
    // Map response back to frontend format
    const newUser = data[0];
    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as 'admin' | 'user',
      department: newUser.department || '',
      isActive: newUser.is_active
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update an existing user
export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  try {
    // Transform frontend format to database format
    const dbUser: Record<string, any> = {};
    
    if (userData.name !== undefined) dbUser.name = userData.name;
    if (userData.email !== undefined) dbUser.email = userData.email;
    if (userData.role !== undefined) dbUser.role = userData.role;
    if (userData.department !== undefined) dbUser.department = userData.department;
    if (userData.isActive !== undefined) dbUser.is_active = userData.isActive;
    
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
          const updatedUser = data[0];
          resolve({
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role as 'admin' | 'user',
            department: updatedUser.department || '',
            isActive: updatedUser.is_active
          });
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
