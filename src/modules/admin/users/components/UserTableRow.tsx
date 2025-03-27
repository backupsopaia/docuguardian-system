
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
    <TableRow>
      <TableCell className="font-medium">
        <div>
          {user.name}
          <div className="sm:hidden text-xs text-muted-foreground mt-1 truncate max-w-[200px]">
            {user.email}
          </div>
          <div className="sm:hidden text-xs text-muted-foreground mt-1">
            {user.role === 'admin' ? 'Administrador' : 'Usuário'}
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
      <TableCell className="hidden md:table-cell">{user.department}</TableCell>
      <TableCell className="hidden sm:table-cell">
        {user.role === 'admin' ? 'Administrador' : 'Usuário'}
      </TableCell>
      <TableCell>
        <Badge 
          variant={user.isActive ? "success" : "destructive"}
          className="whitespace-nowrap"
        >
          {user.isActive ? 'Ativo' : 'Inativo'}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
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
