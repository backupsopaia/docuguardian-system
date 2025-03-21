
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  department: string;
  isActive: boolean;
  lastLogin: Date;
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@docuguardian.com',
    password: 'admin123',
    role: 'admin',
    department: 'IT',
    isActive: true,
    lastLogin: new Date()
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@docuguardian.com',
    password: 'user123',
    role: 'user',
    department: 'Marketing',
    isActive: true,
    lastLogin: new Date()
  },
  {
    id: '3',
    name: 'Carlos Silva',
    email: 'carlos@docuguardian.com',
    password: 'carlos123',
    role: 'user',
    department: 'Financeiro',
    isActive: true,
    lastLogin: new Date(Date.now() - 86400000 * 2)
  },
  {
    id: '4',
    name: 'Maria Oliveira',
    email: 'maria@docuguardian.com',
    password: 'maria123',
    role: 'user',
    department: 'RH',
    isActive: true,
    lastLogin: new Date(Date.now() - 86400000 * 5)
  },
  {
    id: '5',
    name: 'João Pereira',
    email: 'joao@docuguardian.com',
    password: 'joao123',
    role: 'admin',
    department: 'IT',
    isActive: true,
    lastLogin: new Date(Date.now() - 86400000 * 1)
  },
  {
    id: '6',
    name: 'Ana Costa',
    email: 'ana@docuguardian.com',
    password: 'ana123',
    role: 'user',
    department: 'Vendas',
    isActive: false,
    lastLogin: new Date(Date.now() - 86400000 * 30)
  },
  {
    id: '7',
    name: 'Paulo Santos',
    email: 'paulo@docuguardian.com',
    password: 'paulo123',
    role: 'user',
    department: 'Jurídico',
    isActive: true,
    lastLogin: new Date(Date.now() - 86400000 * 3)
  }
];
