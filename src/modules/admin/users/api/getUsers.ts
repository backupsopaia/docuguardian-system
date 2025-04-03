
import { User } from './types';
import { apiFetch } from '@/lib/api';
import { getUsersWithSupabase } from './getUsersWithSupabase';

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
      // Se não for um array, tenta usar o Supabase
      console.error('Error fetching users from API:', 'Received non-array data:', data);
      return getUsersWithSupabase();
    }
  } catch (error) {
    console.error('Error fetching users from API:', error);
    // Tenta usar o Supabase como alternativa
    return getUsersWithSupabase();
  }
};
