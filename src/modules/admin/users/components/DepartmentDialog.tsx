
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { createDepartment, updateDepartment } from '@/modules/admin/departments/api/departmentsService';
import { Department } from '../data/departments';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  description: z.string().min(5, { message: 'Descrição deve ter pelo menos 5 caracteres' }),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface DepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  onSuccess?: () => void;
}

export const DepartmentDialog: React.FC<DepartmentDialogProps> = ({ 
  open, 
  onOpenChange, 
  department,
  onSuccess
}) => {
  const isEditing = !!department;
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditing 
      ? {
          name: department?.name || '',
          description: department?.description || '',
          isActive: department?.isActive || true,
        }
      : {
          name: '',
          description: '',
          isActive: true,
        },
  });
  
  React.useEffect(() => {
    if (open && department) {
      form.reset({
        name: department.name || '',
        description: department.description || '',
        isActive: department.isActive || true,
      });
    } else if (open && !department) {
      form.reset({
        name: '',
        description: '',
        isActive: true,
      });
    }
  }, [open, department, form]);
  
  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      if (isEditing && department) {
        await updateDepartment(department.id, values);
        toast.success(`Departamento ${values.name} atualizado com sucesso`);
      } else {
        // Make sure we're passing required fields to createDepartment
        const newDepartment = {
          name: values.name,
          description: values.description,
          isActive: values.isActive
        };
        await createDepartment(newDepartment);
        toast.success(`Departamento ${values.name} criado com sucesso`);
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        isEditing 
          ? `Erro ao atualizar o departamento` 
          : `Erro ao criar o departamento`
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Departamento' : 'Adicionar Departamento'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite as informações do departamento existente' 
              : 'Preencha as informações para criar um novo departamento'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Departamento</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do departamento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descrição do departamento e suas responsabilidades"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Status do Departamento</FormLabel>
                    <FormDescription>
                      Departamento está ativo na organização?
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
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting 
                  ? (isEditing ? 'Atualizando...' : 'Criando...') 
                  : (isEditing ? 'Atualizar' : 'Criar')
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
