
export interface Department {
  id: string;
  name: string;
  description: string;
  userCount: number;
  isActive: boolean;
}

export const departments: Department[] = [
  {
    id: '1',
    name: 'IT',
    description: 'Departamento de Tecnologia da Informação',
    userCount: 12,
    isActive: true,
  },
  {
    id: '2',
    name: 'Marketing',
    description: 'Departamento de Marketing e Comunicação',
    userCount: 8,
    isActive: true,
  },
  {
    id: '3',
    name: 'Financeiro',
    description: 'Departamento de Finanças e Contabilidade',
    userCount: 5,
    isActive: true,
  },
  {
    id: '4',
    name: 'RH',
    description: 'Departamento de Recursos Humanos',
    userCount: 3,
    isActive: true,
  },
  {
    id: '5',
    name: 'Jurídico',
    description: 'Departamento Jurídico',
    userCount: 2,
    isActive: true,
  },
  {
    id: '6',
    name: 'Vendas',
    description: 'Departamento de Vendas',
    userCount: 14,
    isActive: true,
  },
  {
    id: '7',
    name: 'Suporte',
    description: 'Departamento de Suporte ao Cliente',
    userCount: 6,
    isActive: false,
  },
];
