
import { FileTextIcon, UsersIcon, ShieldAlertIcon, DatabaseIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Função para obter o número de usuários ativos
export const getActiveUsersCount = async (): Promise<number> => {
  try {
    const { data, error, count } = await supabase
      .from('users')
      .select('id', { count: 'exact' })
      .eq('is_active', true);
    
    if (error) {
      console.error('Erro ao buscar usuários ativos:', error);
      return 873; // Valor padrão caso ocorra erro
    }
    
    return count || 0;
  } catch (error) {
    console.error('Erro inesperado ao buscar usuários:', error);
    return 873; // Valor padrão caso ocorra erro
  }
};

// Statistics
export const stats = [
  { 
    name: 'Total Documents', 
    count: 12489, 
    change: '+14%', 
    trend: 'up' as const, 
    icon: FileTextIcon, 
    color: 'bg-blue-500' 
  },
  { 
    name: 'Active Users', 
    count: 873, // Este valor será atualizado dinamicamente
    change: '+7%', 
    trend: 'up' as const, 
    icon: UsersIcon, 
    color: 'bg-emerald-500' 
  },
  { 
    name: 'Security Incidents', 
    count: 3, 
    change: '-25%', 
    trend: 'down' as const, 
    icon: ShieldAlertIcon, 
    color: 'bg-amber-500' 
  },
  { 
    name: 'Storage Used', 
    count: '768GB', 
    change: '+5%', 
    trend: 'up' as const, 
    icon: DatabaseIcon, 
    color: 'bg-violet-500' 
  },
];

// Calculated totals for storage
export const totalStorageUsed = 768;
export const totalStorageCapacity = 1450;
export const lastSystemCheck = 'Today at 09:45 AM';
