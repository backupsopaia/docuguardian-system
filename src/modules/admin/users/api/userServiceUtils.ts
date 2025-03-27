
import { User, UserResponse } from './types';

/**
 * Maps a user from the database format to the frontend format
 */
export const mapDbUserToFrontend = (dbUser: any): User => {
  console.log('Mapping DB user to frontend format:', dbUser);
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role,
    department: dbUser.department,
    isActive: dbUser.is_active,
    created_at: dbUser.created_at,
    updated_at: dbUser.updated_at,
  };
};

/**
 * Maps a user from the frontend format to the database format
 */
export const mapFrontendUserToDb = (user: Omit<User, 'id'>): any => {
  console.log('Mapping frontend user to DB format:', user);
  return {
    name: user.name,
    email: user.email,
    role: user.role, 
    department: user.department,
    is_active: user.isActive,
  };
};

/**
 * Creates mock user data for fallback when the database is not available
 */
export const createMockUserData = (): User[] => {
  console.log('Creating mock user data as fallback');
  return [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      department: 'Management',
      isActive: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Test User',
      email: 'user@example.com',
      role: 'user',
      department: 'General',
      isActive: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];
};
