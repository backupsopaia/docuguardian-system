
import { FileTextIcon, UsersIcon, ShieldAlertIcon, DatabaseIcon } from 'lucide-react';

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
    count: 873, 
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
