
import { User } from './types';
import { apiFetch } from '@/lib/api';
import { mockUsers } from '@/modules/auth/data/users';

export const getUsers = async (): Promise<User[]> => {
  try {
    console.log('Fetching users from API...');
    const data = await apiFetch<User[] | any>('/users');
    
    // Verifica se data é um array antes de chamar map
    if (Array.isArray(data)) {
      return data.map(user => ({
        ...user,
        // Garante que lastLogin é um objeto Date
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : new Date()
      }));
    } else {
      // Se não for um array, registra o erro e usa dados simulados
      console.error('Error fetching users from API:', 'Received non-array data:', data);
      console.log('Using mock user data as fallback');
      return [...mockUsers].map(({ password, ...user }) => ({
        ...user,
        lastLogin: new Date()
      }));
    }
  } catch (error) {
    console.error('Error fetching users from API:', error);
    console.log('Using mock user data as fallback');
    
    // Retorna mockUsers como fallback, removendo o campo password
    return [...mockUsers].map(({ password, ...user }) => ({
      ...user,
      lastLogin: new Date()
    }));
  }
};
