
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
  { 
    id: 4, 
    level: 'high' as const, 
    message: 'Unauthorized access attempt to restricted documents', 
    time: '1 hour ago',
    status: 'unresolved' as const
  },
  { 
    id: 5, 
    level: 'medium' as const, 
    message: 'Password reset requested for admin account', 
    time: '3 hours ago',
    status: 'investigating' as const
  },
];

// Login attempts
export const loginAttempts = [
  { id: 1, user: 'sarah.johnson@example.com', status: 'success' as const, location: 'New York, USA', device: 'Windows 10 - Chrome', time: '10 minutes ago', ip: '203.45.67.89' },
  { id: 2, user: 'unknown', status: 'failed' as const, location: 'Beijing, China', device: 'Linux - Firefox', time: '15 minutes ago', ip: '118.76.45.23', attempts: 3 },
  { id: 3, user: 'mike.wilson@example.com', status: 'success' as const, location: 'London, UK', device: 'MacOS - Safari', time: '22 minutes ago', ip: '84.23.67.105' },
  { id: 4, user: 'unknown', status: 'failed' as const, location: 'Moscow, Russia', device: 'Android - Chrome Mobile', time: '45 minutes ago', ip: '176.32.45.67', attempts: 5 },
  { id: 5, user: 'carlos.mendez@example.com', status: 'success' as const, location: 'Madrid, Spain', device: 'MacOS - Chrome', time: '5 minutes ago', ip: '82.103.128.77' },
  { id: 6, user: 'emma.watson@example.com', status: 'success' as const, location: 'Paris, France', device: 'iPhone - Safari', time: '18 minutes ago', ip: '77.136.42.144' },
  { id: 7, user: 'unknown', status: 'failed' as const, location: 'Lagos, Nigeria', device: 'Windows 11 - Edge', time: '30 minutes ago', ip: '105.112.24.18', attempts: 2 },
];

// Security metrics
export const securityMetrics = {
  failedLogins: {
    today: 24,
    lastWeek: 187,
    change: '+12%'
  },
  documentsAccessed: {
    today: 1543,
    lastWeek: 10289,
    change: '-3%'
  },
  securityAlerts: {
    today: 8,
    lastWeek: 42,
    change: '+15%'
  }
};
