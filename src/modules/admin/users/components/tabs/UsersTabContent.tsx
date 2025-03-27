
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { UsersList } from '../UsersList';
import { User } from '../../api/userService';

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
    <Card>
      <CardHeader>
        <CardTitle>Usuários do Sistema</CardTitle>
        <CardDescription>
          Gerencie os usuários, defina permissões e configure restrições de acesso
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UsersList 
          onEdit={onEditUser} 
          onPermissions={onOpenRestrictions}
          refreshTrigger={refreshTrigger}
        />
      </CardContent>
    </Card>
  );
};
