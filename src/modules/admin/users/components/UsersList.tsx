
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [loadAttempt, setLoadAttempt] = useState(0);
  
  // Reference to track if component is mounted
  const isMounted = useRef(true);
  
  // Clean up function to prevent state updates after unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Optimized data loading function with safety checks
  const loadUsers = useCallback(async () => {
    if (!isMounted.current) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading users... (attempt ' + (loadAttempt + 1) + ')');
      const fetchedUsers = await getUsers();
      
      // Guard against component unmount during async operation
      if (!isMounted.current) return;
      
      // Verify the response is an array
      if (Array.isArray(fetchedUsers)) {
        console.log(`Successfully loaded ${fetchedUsers.length} users`);
        setUsers(fetchedUsers);
        
        // If we got an empty array but this isn't our first attempt, show a message
        if (fetchedUsers.length === 0 && loadAttempt > 0) {
          toast.info('Nenhum usuário encontrado no sistema');
        }
      } else {
        console.error('Expected users to be an array but got:', typeof fetchedUsers);
        setUsers([]);
        setError('Falha ao carregar usuários: formato inválido');
        toast.error('Falha ao carregar usuários: formato inválido');
      }
    } catch (error) {
      // Guard against component unmount during async operation
      if (!isMounted.current) return;
      
      console.error('Failed to load users:', error);
      setUsers([]);
      setError('Falha ao carregar usuários');
      toast.error('Falha ao carregar usuários');
    } finally {
      // Guard against component unmount
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [loadAttempt]);
  
  // Retry loading if previous attempt failed
  useEffect(() => {
    if (!error) return;
    
    const timer = setTimeout(() => {
      if (isMounted.current) {
        setLoadAttempt(prev => prev + 1);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [error]);
  
  // Load users when component mounts or refreshTrigger changes
  useEffect(() => {
    console.log('UsersList effect triggered, refreshTrigger:', refreshTrigger, 'loadAttempt:', loadAttempt);
    loadUsers();
    
    // Clean up any pending operations
    return () => {
      // No specific cleanup needed beyond the isMounted check
    };
  }, [loadUsers, refreshTrigger, loadAttempt]);
  
  // Handle deletion confirmation with safety checks
  const handleConfirmDelete = () => {
    if (!userToDelete || !isMounted.current) return;
    
    setIsDeleting(true);
    
    // Perform deletion safely
    deleteUser(userToDelete.id)
      .then(() => {
        if (!isMounted.current) return;
        
        // Update state without doing a full reload
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
        toast.success(`Usuário ${userToDelete.name} removido com sucesso`);
        setUserToDelete(null);
      })
      .catch(error => {
        if (!isMounted.current) return;
        
        console.error('Failed to delete user:', error);
        toast.error('Falha ao remover usuário');
      })
      .finally(() => {
        if (isMounted.current) {
          setIsDeleting(false);
        }
      });
  };

  // Handle delete user request
  const handleDeleteUser = (user: User) => {
    if (isMounted.current) {
      setUserToDelete(user);
    }
  };
  
  // Handle dialog close
  const handleDialogOpenChange = (open: boolean) => {
    if (!open && isMounted.current) {
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
  
  // Error state with retry button
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={() => setLoadAttempt(prev => prev + 1)} variant="outline">
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
      
      {userToDelete && (
        <DeleteUserDialog
          user={userToDelete}
          isDeleting={isDeleting}
          onOpenChange={handleDialogOpenChange}
          onConfirmDelete={handleConfirmDelete}
        />
      )}
    </>
  );
};
