
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/modules/auth';

// Import dashboard components
import StatCard from '@/components/admin/dashboard/StatCard';
import LoginActivityMonitor from '@/components/admin/dashboard/LoginActivityMonitor';
import PendingDocuments from '@/components/admin/dashboard/PendingDocuments';
import SecurityAlerts from '@/components/admin/dashboard/SecurityAlerts';
import DepartmentStorage from '@/components/admin/dashboard/DepartmentStorage';
import SystemStatus from '@/components/admin/dashboard/SystemStatus';

// Import dashboard data from our modular structure
import { 
  stats, 
  loginAttempts, 
  pendingDocuments, 
  securityAlerts, 
  departmentUsage,
  totalStorageUsed,
  totalStorageCapacity,
  lastSystemCheck,
  getActiveUsersCount
} from '@/modules/admin/dashboard/data';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeUsers, setActiveUsers] = useState<number>(stats[1].count as number);
  const [updatedStats, setUpdatedStats] = useState(stats);
  
  // Buscar usuários ativos ao carregar o componente
  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const count = await getActiveUsersCount();
        setActiveUsers(count);
        
        // Atualizar a estatística de usuários ativos
        const newStats = [...stats];
        newStats[1] = {
          ...newStats[1],
          count: count
        };
        
        setUpdatedStats(newStats);
      } catch (error) {
        console.error('Erro ao buscar contagem de usuários:', error);
      }
    };
    
    fetchActiveUsers();
    
    // Configurar subscription do Supabase para atualizações em tempo real
    const usersChannel = supabase
      .channel('public:users')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'users' }, 
        async () => {
          // Quando houver qualquer alteração na tabela users
          try {
            const count = await getActiveUsersCount();
            setActiveUsers(count);
            
            // Atualizar a estatística de usuários ativos
            const newStats = [...stats];
            newStats[1] = {
              ...newStats[1],
              count: count
            };
            
            setUpdatedStats(newStats);
            toast.info('Dados de usuários atualizados no painel');
          } catch (error) {
            console.error('Erro ao atualizar dados em tempo real:', error);
          }
        }
      )
      .subscribe();
    
    return () => {
      // Cleanup do canal de subscription
      supabase.removeChannel(usersChannel);
    };
  }, []);
  
  if (!user || user.role !== 'admin') return null;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview and analytics</p>
      </div>
      
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {updatedStats.map((stat) => (
          <StatCard 
            key={stat.name}
            name={stat.name}
            count={stat.count}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>
      
      {/* Security Monitoring and Pending Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Login Monitoring */}
        <LoginActivityMonitor loginAttempts={loginAttempts} />
        
        {/* Documents Awaiting Approval */}
        <PendingDocuments documents={pendingDocuments} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Security Alerts */}
        <SecurityAlerts alerts={securityAlerts} />
        
        {/* Storage Usage */}
        <DepartmentStorage 
          departmentUsage={departmentUsage}
          totalUsed={totalStorageUsed}
          totalCapacity={totalStorageCapacity}
        />
      </div>
      
      {/* System Status */}
      <SystemStatus lastChecked={lastSystemCheck} />
    </div>
  );
};

export default AdminDashboard;
