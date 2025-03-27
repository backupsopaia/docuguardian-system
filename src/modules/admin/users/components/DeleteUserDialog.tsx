
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
import { Loader2 } from 'lucide-react';
import { User } from '../api/types';

interface DeleteUserDialogProps {
  user: User;
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
  // Prevent propagation of events to avoid state conflicts
  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onConfirmDelete();
  };

  const handleOpenChange = (open: boolean) => {
    if (!isDeleting) {
      onOpenChange(open);
    }
  };

  return (
    <AlertDialog open={true} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja remover o usuário <strong>{user.name}</strong>?<br />
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirmDelete}
            className="bg-destructive hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Removendo...
              </>
            ) : 'Remover'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
