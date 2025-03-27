
import React, { useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { mockUsers } from '@/modules/admin/users/data/users';
import { DepartmentUsersTable } from './DepartmentUsersTable';
import { UserSearchInput } from './UserSearchInput';
import { useDepartmentUsers } from '../hooks/useDepartmentUsers';

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
  const isMounted = useRef(true);
  const isInitialized = useRef(false);
  
  // Find users assigned to this department
  const findDepartmentUsers = () => {
    if (!department) return [];
    return mockUsers.filter(user => user.department === department.name);
  };
  
  const {
    searchQuery,
    setSearchQuery,
    departmentUsers,
    filteredUsers,
    isUserInDepartment,
    toggleUserAssignment,
    resetDepartmentUsers
  } = useDepartmentUsers(mockUsers, []);
  
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
      
      // Find and set department users
      const assignedUsers = findDepartmentUsers();
      resetDepartmentUsers(assignedUsers);
    } else if (!open) {
      // Reset initialization flag when dialog closes
      isInitialized.current = false;
    }
  }, [department, open, resetDepartmentUsers]);
  
  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isMounted.current) {
      setSearchQuery(e.target.value);
    }
  };
  
  // Handle save button click
  const handleSave = () => {
    if (!isMounted.current || !department) return;
    
    // In a real app, you would make an API call here
    console.log('Saving department users:', departmentUsers);
    
    toast.success(`Usuários do departamento ${department.name} atualizados com sucesso`);
    
    if (isMounted.current) {
      setSearchQuery('');
      onOpenChange(false);
    }
  };
  
  // Handle dialog close
  const handleCloseDialog = () => {
    if (isMounted.current) {
      setSearchQuery('');
      onOpenChange(false);
    }
  };
  
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
          <UserSearchInput 
            value={searchQuery} 
            onChange={handleSearchChange} 
          />
          
          <DepartmentUsersTable 
            users={filteredUsers} 
            isUserInDepartment={isUserInDepartment} 
            toggleUserAssignment={toggleUserAssignment} 
          />
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
