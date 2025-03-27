
import React, { useEffect } from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
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
  const [open, setOpen] = React.useState(true);
  
  // Sincroniza o estado aberto/fechado entre o componente pai e filho
  useEffect(() => {
    if (!open) {
      // Usa setTimeout para evitar atualizações de estado em cascata
      setTimeout(() => {
        onOpenChange(false);
      }, 0);
    }
  }, [open, onOpenChange]);
  
  const handleConfirm = (e: React.MouseEvent) => {
    // Impede propagação de eventos que possam interferir em outros componentes
    e.preventDefault();
    e.stopPropagation();
    
    // Usa setTimeout para evitar potenciais ciclos de atualização de estado
    setTimeout(() => {
      onConfirmDelete();
    }, 0);
  };
  
  const handleCancel = (e: React.MouseEvent) => {
    // Impede propagação de eventos que possam interferir em outros componentes
    e.preventDefault();
    e.stopPropagation();
    
    setOpen(false);
  };
  
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-[90%] sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmação de exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Você tem certeza que deseja excluir o usuário <strong>{user.name}</strong>?
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel 
            onClick={handleCancel}
            disabled={isDeleting} 
            className="mt-0 w-full sm:w-auto"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={isDeleting} 
            className="w-full sm:w-auto bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
