import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { User } from '../api/types';
import { UserActionsDropdown } from './UserActionsDropdown';

interface UserTableRowProps {
  user: User;
  onEdit: (user: User) => void;
  onPermissions: (user: User) => void;
  onDelete: (user: User) => void;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  onEdit,
  onPermissions,
  onDelete
}) => {
  return (
    <TableRow key={user.id}>
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.department}</TableCell>
      <TableCell>
        <Badge variant={user.role === 'admin' ? "destructive" : "outline"}>
          {user.role === 'admin' ? 'Administrador' : 'Usuário'}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={user.isActive ? "default" : "secondary"} className={user.isActive ? "bg-green-600 hover:bg-green-700" : ""}>
          {user.isActive ? 'Ativo' : 'Inativo'}
        </Badge>
      </TableCell>
      <TableCell>
        <UserActionsDropdown 
          user={user}
          onEdit={onEdit}
          onPermissions={onPermissions}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
};
