
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

export interface DepartmentFormProps {
  form: UseFormReturn<{
    name: string;
    description: string;
    isActive: boolean;
  }>;
  onSubmit: (values: {
    name: string;
    description: string;
    isActive: boolean;
  }) => Promise<void>;
  isEditing: boolean;
  onCancel: () => void;
}

export const DepartmentForm: React.FC<DepartmentFormProps> = ({
  form,
  onSubmit,
  isEditing,
  onCancel,
}) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = form;
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Departamento</Label>
          <Input
            id="name"
            {...register('name', { required: 'Nome é obrigatório' })}
            placeholder="Ex: Marketing"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Descreva o propósito do departamento"
            rows={3}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            {...register('isActive')}
          />
          <Label htmlFor="isActive">Departamento Ativo</Label>
        </div>
      </div>
      
      <DialogFooter className="mt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? 'Atualizando...' : 'Salvando...'}
            </>
          ) : (
            isEditing ? 'Atualizar' : 'Salvar'
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};
