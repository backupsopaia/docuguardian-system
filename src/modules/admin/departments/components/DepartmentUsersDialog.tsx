
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { mockUsers } from '@/modules/admin/users/data/users';

interface DepartmentUsersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: any | null;
}

export const DepartmentUsersDialog: React.FC<DepartmentUsersDialogProps> = ({ 
  open, 
  onOpenChange, 
  department 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentUsers, setDepartmentUsers] = useState<any[]>([]);
  // Ref to track component mounted state
  const isMounted = useRef(true);
  
  // Clean up function to prevent state updates after unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Reset state when dialog opens/closes or department changes
  useEffect(() => {
    if (open && department && isMounted.current) {
      // In a real app, you would fetch users assigned to this department
      // Use setTimeout to prevent race conditions
      setTimeout(() => {
        if (isMounted.current) {
          const assignedUsers = mockUsers.filter(user => 
            user.department === department.name
          );
          setDepartmentUsers(assignedUsers);
        }
      }, 0);
    }
  }, [department, open]);
  
  // Safe filtering with null checks
  const filteredUsers = React.useMemo(() => {
    if (!searchQuery) return mockUsers;
    
    return mockUsers.filter(user => 
      (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);
  
  const isUserInDepartment = (userId: string) => {
    return departmentUsers.some(u => u.id === userId);
  };
  
  const toggleUserAssignment = (user: any) => {
    if (!isMounted.current) return;
    
    if (isUserInDepartment(user.id)) {
      setDepartmentUsers(prev => prev.filter(u => u.id !== user.id));
    } else {
      setDepartmentUsers(prev => [...prev, user]);
    }
  };
  
  const handleSave = () => {
    if (!isMounted.current || !department) return;
    
    // In a real app, you would make an API call here
    console.log('Saving department users:', departmentUsers);
    
    toast.success(`Usuários do departamento ${department.name} atualizados com sucesso`);
    onOpenChange(false);
  };
  
  // Safely handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isMounted.current) {
      setSearchQuery(e.target.value);
    }
  };
  
  // Close dialog handler with safety check
  const handleCloseDialog = () => {
    if (isMounted.current) {
      // Clear state before closing to prevent memory leaks
      setSearchQuery('');
      onOpenChange(false);
    }
  };
  
  if (!department) return null;
  
  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Usuários do Departamento: {department.name}</DialogTitle>
          <DialogDescription>
            Gerencie os usuários que pertencem a este departamento
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          <Input 
            placeholder="Buscar usuários..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="mb-4"
          />
          
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
                {filteredUsers.map(user => (
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
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <DialogFooter className="mt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCloseDialog}
          >
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
