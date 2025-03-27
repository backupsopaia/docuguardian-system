
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

// Get all users
export const getUsers = async (): Promise<User[]> => {
  try {
    // Add timeout to prevent indefinite hanging
    const timeoutPromise = new Promise<{data: null, error: Error}>(resolve => {
      setTimeout(() => {
        resolve({
          data: null,
          error: new Error('Request timed out after 10 seconds')
        });
      }, 10000);
    });

    const fetchPromise = fromTable('users').select('*');
    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (error) {
      console.error('Error fetching users:', error);
      // Fall back to mock data if API fails
      return mockUsers.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        isActive: user.isActive
      }));
    }
    
    // Handle null or undefined data
    if (!data) {
      console.error('No data returned from API');
      return [];
    }
    
    // Ensure data is an array
    if (!Array.isArray(data)) {
      console.error('Expected array but got:', data);
      return [];
    }
    
    // Map database format to frontend format if necessary
    return data.map(user => ({
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      role: user.role as 'admin' | 'user',
      department: user.department || '',
      isActive: user.is_active || false
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    // Fall back to mock data
    return mockUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      isActive: user.isActive
    }));
  }
};

// Create a new user
export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  try {
    // Add a small delay to prevent UI freeze
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Transform frontend format to database format
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
    // Add a small delay to prevent UI freeze
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Transform frontend format to database format
    const dbUser: Record<string, any> = {};
    
    if (userData.name !== undefined) dbUser.name = userData.name;
    if (userData.email !== undefined) dbUser.email = userData.email;
    if (userData.role !== undefined) dbUser.role = userData.role;
    if (userData.department !== undefined) dbUser.department = userData.department;
    if (userData.isActive !== undefined) dbUser.is_active = userData.isActive;
    
    const { data, error } = await fromTable('users')
      .update(dbUser)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating user:', error);
      throw new Error(error.message);
    }
    
    // Handle case where data is null or not an array
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error('Failed to update user: No data returned');
    }
    
    // Map response back to frontend format
    const updatedUser = data[0];
    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role as 'admin' | 'user',
      department: updatedUser.department || '',
      isActive: updatedUser.is_active
    };
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (id: string): Promise<void> => {
  try {
    // Add a small delay to prevent UI freeze
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const { error } = await fromTable('users').delete().eq('id', id);
    
    if (error) {
      console.error('Error deleting user:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
