
// Security alerts
export const securityAlerts = [
  { 
    id: 1, 
    level: 'high' as const, 
    message: 'Multiple failed login attempts detected from IP 192.168.1.54', 
    time: '35 minutes ago',
    status: 'unresolved' as const
  },
  { 
    id: 2, 
    level: 'medium' as const, 
    message: 'Unusual document download activity from user john.smith@example.com', 
    time: '2 hours ago',
    status: 'investigating' as const
  },
  { 
    id: 3, 
    level: 'low' as const, 
    message: 'New device login from Marketing department', 
    time: '5 hours ago',
    status: 'resolved' as const
  },
];

// Login attempts
export const loginAttempts = [
  { id: 1, user: 'sarah.johnson@example.com', status: 'success' as const, location: 'New York, USA', device: 'Windows 10 - Chrome', time: '10 minutes ago', ip: '203.45.67.89' },
  { id: 2, user: 'unknown', status: 'failed' as const, location: 'Beijing, China', device: 'Linux - Firefox', time: '15 minutes ago', ip: '118.76.45.23', attempts: 3 },
  { id: 3, user: 'mike.wilson@example.com', status: 'success' as const, location: 'London, UK', device: 'MacOS - Safari', time: '22 minutes ago', ip: '84.23.67.105' },
  { id: 4, user: 'unknown', status: 'failed' as const, location: 'Moscow, Russia', device: 'Android - Chrome Mobile', time: '45 minutes ago', ip: '176.32.45.67', attempts: 5 },
];
