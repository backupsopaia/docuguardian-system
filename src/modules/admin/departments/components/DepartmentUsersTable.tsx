
import React, { useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from '@/components/ui/checkbox';

interface DepartmentUsersTableProps {
  users: any[];
  isUserInDepartment: (userId: string) => boolean;
  toggleUserAssignment: (user: any) => void;
}

export const DepartmentUsersTable: React.FC<DepartmentUsersTableProps> = ({ 
  users, 
  isUserInDepartment, 
  toggleUserAssignment 
}) => {
  if (users.length === 0) {
    return (
      <div className="rounded-md border p-4 text-center">
        Nenhum usuário encontrado
      </div>
    );
  }

  return (
    <div className="rounded-md border max-h-[400px] overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Seleção</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Cargo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>
                <Checkbox 
                  checked={isUserInDepartment(user.id)} 
                  onCheckedChange={() => toggleUserAssignment(user)}
                />
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
