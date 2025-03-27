
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  department: string;
  isActive: boolean;
  created_at?: string;
  updated_at?: string;
  password?: string; // Added optional password field
}

// Response types for better type safety
export interface GetUsersResponse {
  data: User[];
  error: Error | null;
}

export interface UserResponse {
  data: User | null;
  error: Error | null;
}

export interface DeleteUserResponse {
  error: Error | null;
}
