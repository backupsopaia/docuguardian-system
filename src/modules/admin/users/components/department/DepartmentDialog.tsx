
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Department } from '@/modules/admin/users/data/departments';
import { createDepartment, updateDepartment } from '@/modules/admin/departments/api/departmentsService';
import { toast } from 'sonner';
import { DepartmentDialogHeader } from './DepartmentDialogHeader';
import { DepartmentForm } from './DepartmentForm';

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
  
  // Define the form with required fields
  const form = useForm<{
    name: string;
    description: string;
    isActive: boolean;
  }>({
    defaultValues: {
      name: department?.name || '',
      description: department?.description || '',
      isActive: department?.is_active ?? true,
    },
  });
  
  const handleSubmit = async (values: {
    name: string;
    description: string;
    isActive: boolean;
  }) => {
    try {
      if (isEditing && department) {
        // Update existing department
        await updateDepartment(department.id, {
          name: values.name,
          description: values.description,
          is_active: values.isActive,
        });
        toast.success(`Departamento ${values.name} atualizado com sucesso`);
      } else {
        // Create new department
        await createDepartment({
          name: values.name,
          description: values.description,
          is_active: values.isActive,
        });
        toast.success(`Departamento ${values.name} criado com sucesso`);
      }
      
      // Close dialog and refresh data
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving department:', error);
      toast.error('Falha ao salvar departamento');
    }
  };
  
  const handleCancel = () => {
    onOpenChange(false);
    form.reset();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DepartmentDialogHeader isEditing={isEditing} />
        
        <DepartmentForm 
          form={form} 
          onSubmit={handleSubmit} 
          isEditing={isEditing} 
          onCancel={handleCancel} 
        />
      </DialogContent>
    </Dialog>
  );
};
