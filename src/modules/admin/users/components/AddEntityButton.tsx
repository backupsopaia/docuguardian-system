
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AddEntityButtonProps {
  onClick: () => void;
  entityType: 'user' | 'department';
}

export const AddEntityButton: React.FC<AddEntityButtonProps> = ({ onClick, entityType }) => {
  const label = entityType === 'user' ? 'Adicionar Usuário' : 'Adicionar Departamento';
  
  return (
    <Button onClick={onClick}>
      <Plus className="mr-2 h-4 w-4" /> {label}
    </Button>
  );
};
