
import React from 'react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Department } from '../../data/departments';

interface DepartmentDialogHeaderProps {
  department: Department | null;
}

export const DepartmentDialogHeader: React.FC<DepartmentDialogHeaderProps> = ({ department }) => {
  const isEditing = !!department;
  
  return (
    <DialogHeader>
      <DialogTitle>{isEditing ? 'Editar Departamento' : 'Adicionar Departamento'}</DialogTitle>
      <DialogDescription>
        {isEditing 
          ? 'Edite as informações do departamento existente' 
          : 'Preencha as informações para criar um novo departamento'}
      </DialogDescription>
    </DialogHeader>
  );
};
