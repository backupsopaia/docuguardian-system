
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Department } from '../../data/departments';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  description: z.string().min(5, { message: 'Descrição deve ter pelo menos 5 caracteres' }),
  isActive: z.boolean(),
});

export type DepartmentFormValues = z.infer<typeof formSchema>;

interface DepartmentFormProps {
  department: Department | null;
  isSubmitting: boolean;
  onSubmit: (values: DepartmentFormValues) => Promise<void>;
  onCancel: () => void;
}

export const DepartmentForm: React.FC<DepartmentFormProps> = ({
  department,
  isSubmitting,
  onSubmit,
  onCancel,
}) => {
  const isEditing = !!department;
  
  const form = useForm<DepartmentFormValues>({
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
    if (department) {
      form.reset({
        name: department.name || '',
        description: department.description || '',
        isActive: department.isActive || true,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        isActive: true,
      });
    }
  }, [department, form]);
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
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
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
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
        </div>
      </form>
    </Form>
  );
};
