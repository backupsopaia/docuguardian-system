
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
    createdAt: dbUser.created_at,
    updatedAt: dbUser.updated_at,
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
