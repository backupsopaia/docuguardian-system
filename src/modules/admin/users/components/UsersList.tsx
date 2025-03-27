import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getUsers, deleteUser } from '../api/userService';
import { User } from '../api/types';
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
  
  const isMounted = useRef(true);
  
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  const loadUsers = useCallback(async () => {
    if (!isMounted.current) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading users... (attempt ' + (loadAttempt + 1) + ')');
      const fetchedUsers = await getUsers();
      
      if (!isMounted.current) return;
      
      if (Array.isArray(fetchedUsers)) {
        console.log(`Successfully loaded ${fetchedUsers.length} users`);
        setUsers(fetchedUsers);
        
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
      if (!isMounted.current) return;
      
      console.error('Failed to load users:', error);
      setUsers([]);
      setError('Falha ao carregar usuários');
      toast.error('Falha ao carregar usuários');
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [loadAttempt]);
  
  useEffect(() => {
    if (!error) return;
    
    const timer = setTimeout(() => {
      if (isMounted.current) {
        setLoadAttempt(prev => prev + 1);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [error]);
  
  useEffect(() => {
    console.log('UsersList effect triggered, refreshTrigger:', refreshTrigger, 'loadAttempt:', loadAttempt);
    
    const timer = setTimeout(() => {
      if (isMounted.current) {
        loadUsers();
      }
    }, 0);
    
    return () => {
      clearTimeout(timer);
    };
  }, [loadUsers, refreshTrigger, loadAttempt]);
  
  const handleConfirmDelete = () => {
    if (!userToDelete || !isMounted.current) return;
    
    setIsDeleting(true);
    
    setTimeout(async () => {
      if (!isMounted.current || !userToDelete) return;
      
      try {
        await deleteUser(userToDelete.id);
        
        if (!isMounted.current) return;
        
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
        toast.success(`Usuário ${userToDelete.name} removido com sucesso`);
        setUserToDelete(null);
      } catch (error) {
        if (!isMounted.current) return;
        
        console.error('Failed to delete user:', error);
        toast.error('Falha ao remover usuário');
      } finally {
        if (isMounted.current) {
          setIsDeleting(false);
        }
      }
    }, 0);
  };

  const handleDeleteUser = (user: User) => {
    if (isMounted.current) {
      setUserToDelete(user);
    }
  };
  
  const handleDialogOpenChange = (open: boolean) => {
    if (!open && isMounted.current) {
      setUserToDelete(null);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-muted-foreground">Carregando usuários...</p>
      </div>
    );
  }
  
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
