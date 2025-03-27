
import { User } from './types';

/**
 * Utility functions for user service
 */

/**
 * Map user data from API response to User type
 */
export const mapUserData = (userData: any): User => {
  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    role: userData.role || 'user',
    department: userData.department || '',
    isActive: userData.is_active !== undefined ? userData.is_active : true,
    created_at: userData.created_at || new Date().toISOString(),
    updated_at: userData.updated_at || new Date().toISOString()
  };
};

/**
 * Map database user format to frontend format
 */
export const mapDbUserToFrontend = (dbUser: any): User => {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role || 'user',
    department: dbUser.department || '',
    isActive: dbUser.is_active !== undefined ? dbUser.is_active : true,
    created_at: dbUser.created_at || new Date().toISOString(),
    updated_at: dbUser.updated_at || new Date().toISOString()
  };
};

/**
 * Map frontend user format to database format
 */
export const mapFrontendUserToDb = (frontendUser: Omit<User, 'id'>): any => {
  return {
    name: frontendUser.name,
    email: frontendUser.email,
    role: frontendUser.role,
    department: frontendUser.department,
    is_active: frontendUser.isActive,
    // Include password only if it exists
    ...(frontendUser.password ? { password: frontendUser.password } : {})
  };
};

/**
 * Create mock user data for testing
 */
export const createMockUserData = (count: number = 10): User[] => {
  const roles = ['admin', 'user'];
  const departments = ['Marketing', 'IT', 'Finance', 'HR', 'Operations', 'Sales'];
  const users: User[] = [];

  for (let i = 0; i < count; i++) {
    const id = crypto.randomUUID();
    const role = roles[Math.floor(Math.random() * roles.length)] as 'admin' | 'user';
    const department = departments[Math.floor(Math.random() * departments.length)];
    const isActive = Math.random() > 0.2; // 80% chance of being active
    const createdDate = new Date(Date.now() - Math.floor(Math.random() * 10000000000));
    
    users.push({
      id,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role,
      department,
      isActive,
      created_at: createdDate.toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  return users;
};
