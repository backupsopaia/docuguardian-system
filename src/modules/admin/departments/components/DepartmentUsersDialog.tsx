
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { z } from 'zod';
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
  const isMounted = useRef(true);
  const isInitialized = useRef(false);
  
  // Cleanup function to prevent state updates after unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Initialize state when dialog opens with department data
  useEffect(() => {
    if (open && department && !isInitialized.current) {
      // Set initialization flag
      isInitialized.current = true;
      
      // Find users assigned to this department
      const assignedUsers = mockUsers.filter(user => 
        user.department === department.name
      );
      
      // Update state synchronously to avoid React reconciliation issues
      setDepartmentUsers(assignedUsers);
      setSearchQuery('');
    } else if (!open) {
      // Reset initialization flag when dialog closes
      isInitialized.current = false;
    }
  }, [department, open]);
  
  // Filtered users based on search query
  const filteredUsers = React.useMemo(() => {
    if (!searchQuery) return mockUsers;
    
    return mockUsers.filter(user => 
      (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);
  
  // Check if a user is assigned to the department
  const isUserInDepartment = useCallback((userId: string) => {
    return departmentUsers.some(u => u.id === userId);
  }, [departmentUsers]);
  
  // Toggle user assignment to department
  const toggleUserAssignment = useCallback((user: any) => {
    if (!isMounted.current) return;
    
    setDepartmentUsers(prev => {
      if (isUserInDepartment(user.id)) {
        return prev.filter(u => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  }, [isUserInDepartment]);
  
  // Handle save button click
  const handleSave = useCallback(() => {
    if (!isMounted.current || !department) return;
    
    // In a real app, you would make an API call here
    console.log('Saving department users:', departmentUsers);
    
    toast.success(`Usuários do departamento ${department.name} atualizados com sucesso`);
    
    if (isMounted.current) {
      setSearchQuery('');
      onOpenChange(false);
    }
  }, [department, departmentUsers, onOpenChange]);
  
  // Handle search input changes
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (isMounted.current) {
      setSearchQuery(e.target.value);
    }
  }, []);
  
  // Handle dialog close
  const handleCloseDialog = useCallback(() => {
    if (isMounted.current) {
      setSearchQuery('');
      onOpenChange(false);
    }
  }, [onOpenChange]);
  
  // Don't render anything if department is null
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
