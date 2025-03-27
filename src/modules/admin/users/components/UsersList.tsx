
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
  const deleteInProgress = useRef(false);
  const lastRefreshTrigger = useRef(refreshTrigger);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  const loadUsers = useCallback(async () => {
    if (!isMounted.current) return;
    
    // Evita múltiplas chamadas simultâneas
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading users... (attempt ' + (loadAttempt + 1) + ')');
      
      // Usa setTimeout para quebrar potenciais ciclos de atualizações de estado
      setTimeout(async () => {
        try {
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
        } catch (innerError) {
          if (!isMounted.current) return;
          
          console.error('Failed to load users:', innerError);
          setUsers([]);
          setError('Falha ao carregar usuários');
          toast.error('Falha ao carregar usuários');
        } finally {
          if (isMounted.current) {
            setIsLoading(false);
          }
        }
      }, 0);
    } catch (error) {
      if (!isMounted.current) return;
      
      console.error('Failed to load users:', error);
      setUsers([]);
      setError('Falha ao carregar usuários');
      toast.error('Falha ao carregar usuários');
      setIsLoading(false);
    }
  }, [loadAttempt, isLoading]);
  
  // Tentar novamente se houver erro
  useEffect(() => {
    if (!error) return;
    
    const timer = setTimeout(() => {
      if (isMounted.current) {
        setLoadAttempt(prev => prev + 1);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [error]);
  
  // Efeito para carregar usuários quando muda o refreshTrigger
  useEffect(() => {
    // Evita carregamentos duplicados
    if (lastRefreshTrigger.current === refreshTrigger) return;
    lastRefreshTrigger.current = refreshTrigger;
    
    console.log('UsersList effect triggered, refreshTrigger:', refreshTrigger, 'loadAttempt:', loadAttempt);
    
    // Usa setTimeout para evitar renderizações em cascata
    const timer = setTimeout(() => {
      if (isMounted.current && !isLoading) {
        loadUsers();
      }
    }, 50);
    
    return () => {
      clearTimeout(timer);
    };
  }, [loadUsers, refreshTrigger, loadAttempt, isLoading]);
  
  // Carregamento inicial
  useEffect(() => {
    if (!isLoading && users.length === 0 && !error) {
      loadUsers();
    }
  }, [loadUsers, isLoading, users.length, error]);
  
  const handleConfirmDelete = useCallback(() => {
    if (!userToDelete || !isMounted.current || deleteInProgress.current) return;
    
    deleteInProgress.current = true;
    setIsDeleting(true);
    
    // Use setTimeout para quebrar potenciais ciclos de atualizações de estado
    setTimeout(async () => {
      try {
        await deleteUser(userToDelete.id);
        
        if (!isMounted.current) return;
        
        // Atualiza a lista de usuários sem recarregar toda a lista
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
        toast.success(`Usuário ${userToDelete.name} removido com sucesso`);
      } catch (error) {
        if (!isMounted.current) return;
        
        console.error('Failed to delete user:', error);
        toast.error('Falha ao remover usuário');
      } finally {
        if (isMounted.current) {
          setIsDeleting(false);
          setUserToDelete(null); // Limpa o usuário para excluir imediatamente após a operação
          deleteInProgress.current = false;
        }
      }
    }, 10);
  }, [userToDelete]);

  const handleDeleteUser = useCallback((user: User) => {
    if (isMounted.current && !deleteInProgress.current) {
      setUserToDelete(user);
    }
  }, []);
  
  const handleDialogOpenChange = useCallback((open: boolean) => {
    if (!open && isMounted.current && !isDeleting) {
      setUserToDelete(null);
    }
  }, [isDeleting]);
  
  const handleRetry = useCallback(() => {
    setLoadAttempt(prev => prev + 1);
  }, []);
  
  if (isLoading && users.length === 0) {
    return (
      <div className="flex justify-center items-center p-4 sm:p-8">
        <p className="text-muted-foreground">Carregando usuários...</p>
      </div>
    );
  }
  
  if (error && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4 sm:p-8 gap-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={handleRetry} variant="outline">
          Tentar novamente
        </Button>
      </div>
    );
  }
  
  return (
    <div className="w-full overflow-hidden">
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
    </div>
  );
};
