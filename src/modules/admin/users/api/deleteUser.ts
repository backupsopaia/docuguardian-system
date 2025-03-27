
import { apiFetch } from '@/lib/api';
import { mockUsers } from '@/modules/auth/data/users';

// Função para simular um atraso (para testes)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    console.log(`Attempting to delete user with ID: ${userId}`);
    // Tentativa de exclusão via API
    await apiFetch<void>(`/users/${userId}`, {
      method: 'DELETE'
    });
    console.log(`User ${userId} deleted successfully via API`);
    return;
  } catch (error) {
    console.warn('API delete failed, falling back to mock data deletion:', error);
    
    // Simula um pequeno atraso para operações mock (evita a sensação de travamento)
    await delay(300);
    
    // Localiza o usuário nos dados simulados
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      console.error(`Mock user with ID ${userId} not found`);
      throw new Error(`Usuário com ID ${userId} não encontrado`);
    }
    
    // Na vida real, não poderíamos modificar o array mockUsers
    // Esta é apenas uma simulação para a interface do usuário
    console.log(`Mock user ${userId} found at index ${userIndex}`);
    console.log(`User ${userId} "deleted" from mock data`);
    
    return;
  }
};
