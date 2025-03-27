
import React from 'react';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DepartmentDialogHeader } from './DepartmentDialogHeader';
import { DepartmentForm } from './DepartmentForm';
import { Department } from '@/modules/admin/users/data/departments';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { createDepartment, updateDepartment } from '@/modules/admin/departments/api/departmentsService';
import { supabase } from '@/integrations/supabase/client';

// Schema validation
const formSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
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
  onSuccess,
}) => {
  const isEditing = !!department;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditing
      ? {
          name: department.name,
          description: department.description || '',
          isActive: department.isActive,
        }
      : {
          name: '',
          description: '',
          isActive: true,
        },
  });
  
  React.useEffect(() => {
    if (open) {
      form.reset(
        isEditing
          ? {
              name: department?.name || '',
              description: department?.description || '',
              isActive: department?.isActive ?? true,
            }
          : {
              name: '',
              description: '',
              isActive: true,
            }
      );
    }
  }, [open, department, isEditing, form]);
  
  const handleSubmit = async (values: FormValues) => {
    try {
      if (isEditing && department) {
        await updateDepartment(department.id, values);
        toast.success(`Departamento ${values.name} atualizado com sucesso`);
      } else {
        await createDepartment(values);
        toast.success(`Departamento ${values.name} criado com sucesso`);
      }
      
      // Fechar o diálogo e resetar o formulário
      form.reset();
      onOpenChange(false);
      
      // Notificar que a operação foi concluída com sucesso
      if (onSuccess) {
        onSuccess();
      }
      
      // Notificar o painel do administrador sobre a mudança
      supabase.channel('custom-all-channel')
        .send({
          type: 'broadcast',
          event: 'department-change',
          payload: { action: isEditing ? 'update' : 'create' }
        });
        
    } catch (error) {
      console.error('Erro ao salvar departamento:', error);
      toast.error(`Erro ao ${isEditing ? 'atualizar' : 'criar'} departamento`);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DepartmentDialogHeader department={department} />
        
        <DepartmentForm 
          form={form} 
          onSubmit={handleSubmit} 
          isEditing={isEditing} 
          onCancel={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};
