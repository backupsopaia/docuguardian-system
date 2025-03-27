
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { UsersList } from '../UsersList';
import { User } from '../../api/types';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

interface UsersTabContentProps {
  onAddUser: () => void;
  onEditUser: (user: User) => void;
  onOpenRestrictions: (user: User) => void;
  refreshTrigger: number;
}

export const UsersTabContent: React.FC<UsersTabContentProps> = ({
  onAddUser,
  onEditUser,
  onOpenRestrictions,
  refreshTrigger
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-lg sm:text-xl">Usuários do Sistema</CardTitle>
          <CardDescription className="text-sm">
            Gerencie os usuários, defina permissões e configure restrições de acesso
          </CardDescription>
        </div>
        <Button 
          onClick={onAddUser} 
          size="sm" 
          className="w-full sm:w-auto"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Adicionar Usuário
        </Button>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
        <UsersList 
          onEdit={onEditUser} 
          onPermissions={onOpenRestrictions}
          refreshTrigger={refreshTrigger}
        />
      </CardContent>
    </Card>
  );
};
