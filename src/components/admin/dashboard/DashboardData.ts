
import { 
  FileTextIcon, 
  UsersIcon, 
  ShieldAlertIcon,
  DatabaseIcon 
} from 'lucide-react';

// Statistics
export const stats = [
  { 
    name: 'Total Documents', 
    count: 12489, 
    change: '+14%', 
    trend: 'up', 
    icon: FileTextIcon, 
    color: 'bg-blue-500' 
  },
  { 
    name: 'Active Users', 
    count: 873, 
    change: '+7%', 
    trend: 'up', 
    icon: UsersIcon, 
    color: 'bg-emerald-500' 
  },
  { 
    name: 'Security Incidents', 
    count: 3, 
    change: '-25%', 
    trend: 'down', 
    icon: ShieldAlertIcon, 
    color: 'bg-amber-500' 
  },
  { 
    name: 'Storage Used', 
    count: '768GB', 
    change: '+5%', 
    trend: 'up', 
    icon: DatabaseIcon, 
    color: 'bg-violet-500' 
  },
];

// Security alerts
export const securityAlerts = [
  { 
    id: 1, 
    level: 'high', 
    message: 'Multiple failed login attempts detected from IP 192.168.1.54', 
    time: '35 minutes ago',
    status: 'unresolved'
  },
  { 
    id: 2, 
    level: 'medium', 
    message: 'Unusual document download activity from user john.smith@example.com', 
    time: '2 hours ago',
    status: 'investigating'
  },
  { 
    id: 3, 
    level: 'low', 
    message: 'New device login from Marketing department', 
    time: '5 hours ago',
    status: 'resolved'
  },
];

// Login attempts
export const loginAttempts = [
  { id: 1, user: 'sarah.johnson@example.com', status: 'success', location: 'New York, USA', device: 'Windows 10 - Chrome', time: '10 minutes ago', ip: '203.45.67.89' },
  { id: 2, user: 'unknown', status: 'failed', location: 'Beijing, China', device: 'Linux - Firefox', time: '15 minutes ago', ip: '118.76.45.23', attempts: 3 },
  { id: 3, user: 'mike.wilson@example.com', status: 'success', location: 'London, UK', device: 'MacOS - Safari', time: '22 minutes ago', ip: '84.23.67.105' },
  { id: 4, user: 'unknown', status: 'failed', location: 'Moscow, Russia', device: 'Android - Chrome Mobile', time: '45 minutes ago', ip: '176.32.45.67', attempts: 5 },
];

// Pending documents
export const pendingDocuments = [
  { id: 'DOC-2023-04567', title: 'Q4 Financial Report', submitter: 'Jennifer Lee', department: 'Finance', submitted: '2 hours ago', priority: 'high' },
  { id: 'DOC-2023-04568', title: 'Marketing Campaign Proposal', submitter: 'David Chen', department: 'Marketing', submitted: '4 hours ago', priority: 'medium' },
  { id: 'DOC-2023-04569', title: 'Employee Handbook Update', submitter: 'Rachel Kim', department: 'HR', submitted: '1 day ago', priority: 'low' },
  { id: 'DOC-2023-04570', title: 'Product Roadmap 2023', submitter: 'Alex Johnson', department: 'Product', submitted: '2 days ago', priority: 'medium' },
];

// Department storage usage
export const departmentUsage = [
  { department: 'Marketing', used: 215, total: 500, percentage: 43 },
  { department: 'Finance', used: 187, total: 300, percentage: 62 },
  { department: 'HR', used: 95, total: 150, percentage: 63 },
  { department: 'IT', used: 271, total: 500, percentage: 54 },
];

// Calculated totals for storage
export const totalStorageUsed = 768;
export const totalStorageCapacity = 1450;
export const lastSystemCheck = 'Today at 09:45 AM';
