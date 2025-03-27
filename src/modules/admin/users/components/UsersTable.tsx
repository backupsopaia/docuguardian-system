
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from '../api/types';
import { UserTableRow } from './UserTableRow';

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onPermissions: (user: User) => void;
  onDelete: (user: User) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  onEdit,
  onPermissions,
  onDelete
}) => {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[120px]">Nome</TableHead>
            <TableHead className="min-w-[180px] hidden sm:table-cell">Email</TableHead>
            <TableHead className="min-w-[140px] hidden md:table-cell">Departamento</TableHead>
            <TableHead className="min-w-[100px] hidden sm:table-cell">Função</TableHead>
            <TableHead className="w-[90px]">Status</TableHead>
            <TableHead className="w-[100px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                Nenhum usuário encontrado
              </TableCell>
            </TableRow>
          ) : (
            users.map(user => (
              <UserTableRow
                key={user.id}
                user={user}
                onEdit={onEdit}
                onPermissions={onPermissions}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
