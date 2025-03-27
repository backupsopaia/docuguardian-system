
import React, { useState, useEffect, useCallback } from 'react';
import { FileEdit, Trash2, ShieldCheck, UserCog } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { getUsers, deleteUser, User } from '@/modules/admin/users/api/userService';

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
  
  const loadUsers = useCallback(async () => {
    // Don't set loading state if we're already loading
    if (!isLoading) {
      setIsLoading(true);
    }
    setError(null);
    
    try {
      // Wrap in a setTimeout to prevent UI freezing
      setTimeout(async () => {
        try {
          const fetchedUsers = await getUsers();
          
          // Ensure fetchedUsers is an array before setting state
          if (Array.isArray(fetchedUsers)) {
            setUsers(fetchedUsers);
          } else {
            console.error('Expected users to be an array but got:', fetchedUsers);
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
      }, 0);
    } catch (error) {
      console.error('Error in setTimeout:', error);
      setIsLoading(false);
      setError('An unexpected error occurred');
      toast.error('Erro inesperado ao carregar usuários');
    }
  }, [isLoading]);
  
  useEffect(() => {
    loadUsers();
  }, [loadUsers, refreshTrigger]);
  
  const handleDelete = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    
    // Wrap in setTimeout to prevent UI freezing
    setTimeout(async () => {
      try {
        await deleteUser(userToDelete.id);
        setUsers(users.filter(user => user.id !== userToDelete.id));
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
        <Button onClick={loadUsers} variant="outline">
          Tentar novamente
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
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
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? "destructive" : "outline"}>
                      {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "default" : "secondary"} className={user.isActive ? "bg-green-600 hover:bg-green-700" : ""}>
                      {user.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Menu</span>
                          <UserCog className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(user)}>
                          <FileEdit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onPermissions(user)}>
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Permissões e Restrições
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => setUserToDelete(user)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remover
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog 
        open={!!userToDelete} 
        onOpenChange={(open) => !open && setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Tem certeza que deseja remover o usuário <strong>{userToDelete?.name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={e => {
                e.preventDefault();
                handleDelete();
              }} 
              className="bg-destructive text-destructive-foreground"
              disabled={isDeleting}
            >
              {isDeleting ? 'Removendo...' : 'Remover'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
