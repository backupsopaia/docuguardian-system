
import React from 'react';
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
import { User } from '../api/userService';

interface DeleteUserDialogProps {
  user: User | null;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
}

export const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  user,
  isDeleting,
  onOpenChange,
  onConfirmDelete
}) => {
  return (
    <AlertDialog 
      open={!!user} 
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover usuário</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Tem certeza que deseja remover o usuário <strong>{user?.name}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={e => {
              e.preventDefault();
              onConfirmDelete();
            }} 
            className="bg-destructive text-destructive-foreground"
            disabled={isDeleting}
          >
            {isDeleting ? 'Removendo...' : 'Remover'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
