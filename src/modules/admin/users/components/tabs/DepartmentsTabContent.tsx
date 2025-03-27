
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DepartmentList } from '../DepartmentList';
import { Department } from '../../data/departments';

interface DepartmentsTabContentProps {
  departments: Department[];
  isLoading: boolean;
  onAddDepartment?: () => void;
  onEditDepartment: (department: Department) => void;
  onDepartmentUpdated: () => void;
}

export const DepartmentsTabContent: React.FC<DepartmentsTabContentProps> = ({
  departments,
  isLoading,
  onEditDepartment,
  onDepartmentUpdated
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Departamentos da Organização</CardTitle>
        <CardDescription>
          Gerencie departamentos e associe usuários a cada departamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DepartmentList 
          departments={departments}
          isLoading={isLoading}
          onEdit={onEditDepartment}
          onDepartmentUpdated={onDepartmentUpdated}
        />
      </CardContent>
    </Card>
  );
};
