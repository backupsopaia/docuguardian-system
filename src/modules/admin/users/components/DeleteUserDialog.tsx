
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
} from '@/components/ui/alert-dialog';
import { User } from '@/modules/admin/users/api/userService';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  onConfirmDelete,
}) => {
  const handleDelete = () => {
    onConfirmDelete();
    
    // Notificar dashboard sobre a remoção do usuário
    setTimeout(() => {
      try {
        supabase.channel('custom-all-channel')
          .send({
            type: 'broadcast',
            event: 'user-change',
            payload: { action: 'delete' }
          });
        
        console.log('Broadcast message sent for user deletion');
      } catch (error) {
        console.error('Error sending broadcast message:', error);
      }
    }, 500);
  };

  return (
    <AlertDialog open={!!user} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja remover o usuário <strong>{user?.name}</strong>?
            <br />
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Removendo...
              </>
            ) : (
              'Sim, remover'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
