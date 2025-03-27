
import React, { useEffect, useState } from 'react';
import { 
  FileEdit, 
  Users, 
  Building2, 
  FolderOpenIcon, 
  FileIcon, 
  ClipboardListIcon, 
  ShieldAlertIcon,
  Loader2
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Department } from '../data/departments';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DepartmentListProps {
  departments: Department[];
  isLoading: boolean;
  onEdit: (department: Department) => void;
  onManageUsers?: (department: Department) => void;
  onManageFolders?: (department: Department) => void;
  onManageTasks?: (department: Department) => void;
  onManageRestrictions?: (department: Department) => void;
  onManageDocuments?: (department: Department) => void;
  onDepartmentUpdated: () => void;
}

export const DepartmentList: React.FC<DepartmentListProps> = ({
  departments,
  isLoading,
  onEdit,
  onManageUsers,
  onManageFolders,
  onManageTasks,
  onManageRestrictions,
  onManageDocuments,
  onDepartmentUpdated
}) => {
  const [localDepartments, setLocalDepartments] = useState<Department[]>(departments);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  
  // Update local departments when props change
  useEffect(() => {
    setLocalDepartments(departments);
  }, [departments]);
  
  // Subscribe to Supabase realtime updates for departments
  useEffect(() => {
    const channel = supabase
      .channel('departments-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'departments' 
        },
        (payload) => {
          console.log('Departments change received:', payload);
          onDepartmentUpdated(); // Trigger parent refresh
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [onDepartmentUpdated]);

  // Manually refresh departments from Supabase
  const refreshDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');
        
      if (error) {
        console.error('Error fetching departments:', error);
        return;
      }
      
      if (data) {
        setLocalDepartments(data as Department[]);
      }
    } catch (error) {
      console.error('Unexpected error fetching departments:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <span className="ml-2">Carregando departamentos...</span>
      </div>
    );
  }
  
  if (localDepartments.length === 0) {
    return (
      <div className="text-center py-8">
        <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-medium">Nenhum departamento encontrado</h3>
        <p className="text-muted-foreground mb-4">
          Comece adicionando o primeiro departamento da sua organização
        </p>
        <Button 
          onClick={() => refreshDepartments()}
          variant="outline" 
          size="sm"
        >
          Atualizar lista
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Usuários</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localDepartments.map((department) => (
            <TableRow key={department.id}>
              <TableCell className="font-medium">{department.name}</TableCell>
              <TableCell className="max-w-xs truncate">
                {department.description || 'Sem descrição'}
              </TableCell>
              <TableCell>
                {department.isActive ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Ativo
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    Inativo
                  </Badge>
                )}
              </TableCell>
              <TableCell>{department.userCount || 0} usuários</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(department)}
                    title="Editar departamento"
                  >
                    <FileEdit className="h-4 w-4" />
                  </Button>
                  
                  {onManageUsers && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onManageUsers(department)}
                      title="Gerenciar usuários"
                    >
                      <Users className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {onManageFolders && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onManageFolders(department)}
                      title="Gerenciar pastas"
                    >
                      <FolderOpenIcon className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {onManageTasks && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onManageTasks(department)}
                      title="Gerenciar tarefas"
                    >
                      <ClipboardListIcon className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {onManageDocuments && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onManageDocuments(department)}
                      title="Gerenciar documentos"
                    >
                      <FileIcon className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {onManageRestrictions && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onManageRestrictions(department)}
                      title="Gerenciar restrições"
                    >
                      <ShieldAlertIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
