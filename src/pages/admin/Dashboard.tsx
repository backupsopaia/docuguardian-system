
import React from 'react';
import { useAuth } from '@/context/AuthContext';

// Import dashboard components
import StatCard from '@/components/admin/dashboard/StatCard';
import LoginActivityMonitor from '@/components/admin/dashboard/LoginActivityMonitor';
import PendingDocuments from '@/components/admin/dashboard/PendingDocuments';
import SecurityAlerts from '@/components/admin/dashboard/SecurityAlerts';
import DepartmentStorage from '@/components/admin/dashboard/DepartmentStorage';
import SystemStatus from '@/components/admin/dashboard/SystemStatus';

// Import dashboard data
import { 
  stats, 
  loginAttempts, 
  pendingDocuments, 
  securityAlerts, 
  departmentUsage,
  totalStorageUsed,
  totalStorageCapacity,
  lastSystemCheck
} from '@/components/admin/dashboard/DashboardData';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'admin') return null;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview and analytics</p>
      </div>
      
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
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
