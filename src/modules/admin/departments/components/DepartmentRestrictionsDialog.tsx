
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckSquare, Square } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';

interface DepartmentRestrictionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: any | null;
}

interface Permission {
  id: string;
  module: string;
  action: string;
  description: string;
  granted: boolean;
}

// Mock data for department permissions
const mockPermissions: Permission[] = [
  { id: '1', module: 'Documentos', action: 'create', description: 'Criar documentos', granted: true },
  { id: '2', module: 'Documentos', action: 'edit', description: 'Editar documentos', granted: true },
  { id: '3', module: 'Documentos', action: 'delete', description: 'Excluir documentos', granted: false },
  { id: '4', module: 'Documentos', action: 'approve', description: 'Aprovar documentos', granted: false },
  { id: '5', module: 'Processos', action: 'view', description: 'Visualizar processos', granted: true },
  { id: '6', module: 'Processos', action: 'create', description: 'Criar processos', granted: false },
  { id: '7', module: 'Riscos', action: 'view', description: 'Visualizar riscos', granted: true },
  { id: '8', module: 'Riscos', action: 'manage', description: 'Gerenciar riscos', granted: false },
  { id: '9', module: 'Qualidade', action: 'view', description: 'Visualizar indicadores', granted: true },
  { id: '10', module: 'Projetos', action: 'view', description: 'Visualizar projetos', granted: true },
  { id: '11', module: 'Ativos', action: 'view', description: 'Visualizar ativos', granted: true },
];

export const DepartmentRestrictionsDialog: React.FC<DepartmentRestrictionsDialogProps> = ({ 
  open, 
  onOpenChange, 
  department 
}) => {
  const [permissions, setPermissions] = useState<Permission[]>(mockPermissions);
  
  // Get unique modules for grouping
  const modules = Array.from(new Set(permissions.map(p => p.module)));
  
  const togglePermission = (permissionId: string) => {
    setPermissions(permissions.map(p => 
      p.id === permissionId ? { ...p, granted: !p.granted } : p
    ));
  };
  
  const handleSave = () => {
    // In a real app, you would make an API call here
    console.log('Saving department permissions:', permissions);
    
    toast.success(`Permissões do departamento ${department?.name} atualizadas com sucesso`);
    onOpenChange(false);
  };
  
  if (!department) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Restrições e Permissões: {department.name}</DialogTitle>
          <DialogDescription>
            Configure as permissões de acesso deste departamento aos diversos módulos do sistema
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 pt-2">
          {modules.map(module => (
            <div key={module} className="space-y-2">
              <h3 className="font-medium text-sm">{module}</h3>
              <Separator />
              <div className="space-y-2">
                {permissions
                  .filter(p => p.module === module)
                  .map(permission => (
                    <Card key={permission.id} className="p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <Label>{permission.description}</Label>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => togglePermission(permission.id)}
                          className={permission.granted ? "text-green-600" : "text-muted-foreground"}
                        >
                          {permission.granted ? (
                            <CheckSquare className="h-5 w-5" />
                          ) : (
                            <Square className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
        
        <DialogFooter className="mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
