
import React from 'react';
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

export const UserDialog: React.FC<UserDialogProps> = ({ open, onOpenChange, user, onUserUpdated }) => {
  const isEditing = !!user;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditing 
      ? {
          name: user?.name || '',
          email: user?.email || '',
          role: user?.role || 'user',
          department: user?.department || '',
          isActive: user?.isActive || true,
        }
      : {
          name: '',
          email: '',
          role: 'user',
          department: '',
          isActive: true,
        },
  });
  
  const handleSubmit = async (values: FormValues) => {
    try {
      if (isEditing && user) {
        // For updates, we can pass partial data
        await updateUser(user.id, values);
        toast.success(`Usuário ${values.name} atualizado com sucesso`);
      } else {
        // For creation, ensure all required fields are present
        const newUser: Omit<User, 'id'> = {
          name: values.name,
          email: values.email,
          role: values.role,
          department: values.department,
          isActive: values.isActive
        };
        await createUser(newUser);
        toast.success(`Usuário ${values.name} criado com sucesso`);
      }
      
      form.reset();
      onOpenChange(false);
      
      // Refresh the user list
      if (onUserUpdated) {
        onUserUpdated();
      }
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error(`Erro ao ${isEditing ? 'atualizar' : 'criar'} usuário`);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
