
import React, { useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { departments } from '@/modules/admin/users/data/departments';
import { createUser, updateUser, User } from '@/modules/admin/users/api/userService';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }).optional(),
  role: z.enum(['admin', 'user']),
  department: z.string().min(1, { message: 'Departamento é obrigatório' }),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

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
  const formInitialized = useRef(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Cleanup function to prevent state updates after unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
      department: '',
      isActive: true,
      password: '',
    },
  });
  
  // Reset form when dialog opens or user changes
  useEffect(() => {
    if (open) {
      formInitialized.current = true;
      
      const values = isEditing && user 
        ? {
            name: user?.name || '',
            email: user?.email || '',
            role: (user?.role as 'admin' | 'user') || 'user',
            department: user?.department || '',
            isActive: user?.isActive || true,
            password: undefined,
          }
        : {
            name: '',
            email: '',
            password: '',
            role: 'user',
            department: '',
            isActive: true,
          };
      
      // Reset synchronously to avoid React reconciliation issues
      form.reset(values);
    }
  }, [open, user, isEditing, form]);
  
  const handleSubmit = useCallback(async (values: FormValues) => {
    if (!isMounted.current || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      if (isEditing && user) {
        await updateUser(user.id, values);
        toast.success(`Usuário ${values.name} atualizado com sucesso`);
      } else {
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
      
      // Safely reset form and close dialog
      form.reset();
      
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
  }, [isEditing, user, onOpenChange, onUserUpdated, form, isSubmitting]);
  
  const handleCloseDialog = useCallback(() => {
    if (isMounted.current && !isSubmitting) {
      form.reset();
      onOpenChange(false);
    }
  }, [form, onOpenChange, isSubmitting]);
  
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
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do usuário" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {!isEditing && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma função" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="user">Usuário</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um departamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept.id} value={dept.name}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Status do Usuário</FormLabel>
                    <FormDescription>
                      Usuário está ativo no sistema?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCloseDialog}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Atualizando...' : 'Criando...'}
                  </>
                ) : (
                  isEditing ? 'Atualizar' : 'Criar'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
