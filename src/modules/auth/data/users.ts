
export const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@docuguardian.com',
    password: 'admin123',
    role: 'admin' as const,
    department: 'IT',
    isActive: true,
    lastLogin: new Date()
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@docuguardian.com',
    password: 'user123',
    role: 'user' as const,
    department: 'Marketing',
    isActive: true,
    lastLogin: new Date()
  }
];
