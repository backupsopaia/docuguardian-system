
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getUsers, deleteUser, User } from '../api/userService';
import { UsersTable } from './UsersTable';
import { DeleteUserDialog } from './DeleteUserDialog';

interface UsersListProps {
  onEdit: (user: User) => void;
  onPermissions: (user: User) => void;
  refreshTrigger?: number;
}

export const UsersList: React.FC<UsersListProps> = ({ onEdit, onPermissions, refreshTrigger }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Optimized data loading function that doesn't block the UI
  const loadUsers = useCallback(async () => {
    if (!isLoading) {
      setIsLoading(true);
    }
    setError(null);
    
    try {
      console.log('Loading users...');
      const fetchedUsers = await getUsers();
      
      // Ensure we're working with an array before setting state
      if (Array.isArray(fetchedUsers)) {
        console.log(`Successfully loaded ${fetchedUsers.length} users`);
        setUsers(fetchedUsers);
      } else {
        console.error('Expected users to be an array but got:', typeof fetchedUsers);
        setUsers([]);
        setError('Failed to load users: Invalid data format');
        toast.error('Falha ao carregar usuários: formato inválido');
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      setUsers([]);
      setError('Failed to load users');
      toast.error('Falha ao carregar usuários');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);
  
  useEffect(() => {
    console.log('UsersList effect triggered, refreshTrigger:', refreshTrigger);
    loadUsers();
  }, [loadUsers, refreshTrigger]);
  
  // Handle deletion confirmation
  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    
    // Perform deletion in a non-blocking way
    setTimeout(async () => {
      try {
        await deleteUser(userToDelete.id);
        // Update state without doing a full reload
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
        toast.success(`Usuário ${userToDelete.name} removido com sucesso`);
        setUserToDelete(null);
      } catch (error) {
        console.error('Failed to delete user:', error);
        toast.error('Falha ao remover usuário');
      } finally {
        setIsDeleting(false);
      }
    }, 0);
  };

  // Handle delete user request
  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
  };
  
  // Handle dialog close
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setUserToDelete(null);
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-muted-foreground">Carregando usuários...</p>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={loadUsers} variant="outline">
          Tentar novamente
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <UsersTable 
        users={users}
        onEdit={onEdit}
        onPermissions={onPermissions}
        onDelete={handleDeleteUser}
      />
      
      <DeleteUserDialog
        user={userToDelete}
        isDeleting={isDeleting}
        onOpenChange={handleDialogOpenChange}
        onConfirmDelete={handleConfirmDelete}
      />
    </>
  );
};
