
import React, { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { User, createUser, updateUser } from '@/modules/admin/users/api/userService';
import { UserForm } from './UserForm';
import { UserFormValues } from './schema';

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onUserUpdated?: () => void;
}

export const UserDialog: React.FC<UserDialogProps> = ({ 
  open, 
  onOpenChange, 
  user, 
  onUserUpdated 
}) => {
  const isEditing = !!user;
  const isMounted = useRef(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Cleanup function to prevent state updates after unmount
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  const handleSubmit = useCallback(async (values: UserFormValues) => {
    if (!isMounted.current || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      console.log('Submitting form with values:', values);
      
      if (isEditing && user) {
        console.log('Updating existing user:', user.id, values);
        await updateUser(user.id, values);
        toast.success(`Usuário ${values.name} atualizado com sucesso`);
      } else {
        console.log('Creating new user with values:', values);
        const newUser: Omit<User, 'id'> = {
          name: values.name,
          email: values.email,
          role: values.role,
          department: values.department,
          isActive: values.isActive,
          ...(values.password ? { password: values.password } : {})
        };
        
        await createUser(newUser);
        toast.success(`Usuário ${values.name} criado com sucesso`);
      }
      
      if (onUserUpdated) {
        onUserUpdated();
      }
      
      // Close dialog
      if (isMounted.current) {
        onOpenChange(false);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      if (isMounted.current) {
        toast.error(`Erro ao ${isEditing ? 'atualizar' : 'criar'} usuário`);
        setIsSubmitting(false);
      }
    }
  }, [isEditing, user, onOpenChange, onUserUpdated, isSubmitting]);
  
  const handleCloseDialog = useCallback(() => {
    if (isMounted.current && !isSubmitting) {
      onOpenChange(false);
    }
  }, [onOpenChange, isSubmitting]);
  
  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Usuário' : 'Adicionar Usuário'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite as informações do usuário existente' 
              : 'Preencha as informações para criar um novo usuário'}
          </DialogDescription>
        </DialogHeader>
        
        <UserForm
          user={user}
          isEditing={isEditing}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={handleCloseDialog}
        />
      </DialogContent>
    </Dialog>
  );
};
