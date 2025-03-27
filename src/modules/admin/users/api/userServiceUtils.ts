
import { User } from './types';
import { mockUsers } from '@/modules/admin/users/data/users';

// Create a promise that will resolve after a timeout
export const createTimeoutPromise = <T>(timeoutMs: number, errorMessage: string): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(errorMessage));
    }, timeoutMs);
  });
};

// Map database user to frontend format
export const mapDbUserToFrontend = (dbUser: any): User => {
  return {
    id: dbUser.id,
    name: dbUser.name || '',
    email: dbUser.email || '',
    role: dbUser.role as 'admin' | 'user',
    department: dbUser.department || '',
    isActive: dbUser.is_active ?? false
  };
};

// Map frontend user to database format
export const mapFrontendUserToDb = (userData: Partial<User>): Record<string, any> => {
  const dbUser: Record<string, any> = {};
  
  if (userData.name !== undefined) dbUser.name = userData.name;
  if (userData.email !== undefined) dbUser.email = userData.email;
  if (userData.role !== undefined) dbUser.role = userData.role;
  if (userData.department !== undefined) dbUser.department = userData.department;
  if (userData.isActive !== undefined) dbUser.is_active = userData.isActive;
  
  return dbUser;
};

// Create mock user data for fallback
export const createMockUserData = (): User[] => {
  return mockUsers.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    isActive: user.isActive
  }));
};
