
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { UsersList } from '../UsersList';
import { User } from '../../api/types';

interface UsersTabContentProps {
  onAddUser: () => void;
  onEditUser: (user: User) => void;
  onOpenRestrictions: (user: User) => void;
  refreshTrigger: number;
}

export const UsersTabContent: React.FC<UsersTabContentProps> = ({
  onEditUser,
  onOpenRestrictions,
  refreshTrigger
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">Usuários do Sistema</CardTitle>
        <CardDescription className="text-sm">
          Gerencie os usuários, defina permissões e configure restrições de acesso
        </CardDescription>
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
