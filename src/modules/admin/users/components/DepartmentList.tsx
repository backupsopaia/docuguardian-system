
import React, { useState } from 'react';
import { FileEdit, Trash2, Users, FolderOpen, ClipboardList, ShieldAlert, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Department } from '../data/departments';
import { deleteDepartment } from '@/modules/admin/departments/api/departmentsService';
import { Skeleton } from "@/components/ui/skeleton";

interface DepartmentListProps {
  departments: Department[];
  isLoading?: boolean;
  onEdit: (department: Department) => void;
  onManageUsers?: (department: Department) => void;
  onManageFolders?: (department: Department) => void;
  onManageTasks?: (department: Department) => void;
  onManageRestrictions?: (department: Department) => void;
  onManageDocuments?: (department: Department) => void;
  onDepartmentUpdated?: () => void;
}

export const DepartmentList: React.FC<DepartmentListProps> = ({ 
  departments,
  isLoading = false,
  onEdit, 
  onManageUsers,
  onManageFolders,
  onManageTasks,
  onManageRestrictions,
  onManageDocuments,
  onDepartmentUpdated
}) => {
  const [deptToDelete, setDeptToDelete] = useState<Department | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (!deptToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteDepartment(deptToDelete.id);
      toast.success(`Departamento ${deptToDelete.name} removido com sucesso`);
      if (onDepartmentUpdated) onDepartmentUpdated();
    } catch (error) {
      toast.error('Erro ao remover departamento');
    } finally {
      setIsDeleting(false);
      setDeptToDelete(null);
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }
  
  if (departments.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md">
        <p className="text-muted-foreground">Nenhum departamento encontrado</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Usuários</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map(dept => (
              <TableRow key={dept.id}>
                <TableCell className="font-medium">{dept.name}</TableCell>
                <TableCell>{dept.description}</TableCell>
                <TableCell>{dept.userCount}</TableCell>
                <TableCell>
                  <Badge variant="default" className={dept.isActive ? "bg-green-600 hover:bg-green-700" : ""}>
                    {dept.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Menu</span>
                        <FileEdit className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(dept)}>
                        <FileEdit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      {onManageUsers && (
                        <DropdownMenuItem onClick={() => onManageUsers(dept)}>
                          <Users className="mr-2 h-4 w-4" />
                          Gerenciar Usuários
                        </DropdownMenuItem>
                      )}
                      {onManageDocuments && (
                        <DropdownMenuItem onClick={() => onManageDocuments(dept)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Gerenciar Documentos
                        </DropdownMenuItem>
                      )}
                      {onManageFolders && (
                        <DropdownMenuItem onClick={() => onManageFolders(dept)}>
                          <FolderOpen className="mr-2 h-4 w-4" />
                          Pastas e Permissões
                        </DropdownMenuItem>
                      )}
                      {onManageTasks && (
                        <DropdownMenuItem onClick={() => onManageTasks(dept)}>
                          <ClipboardList className="mr-2 h-4 w-4" />
                          Tarefas
                        </DropdownMenuItem>
                      )}
                      {onManageRestrictions && (
                        <DropdownMenuItem onClick={() => onManageRestrictions(dept)}>
                          <ShieldAlert className="mr-2 h-4 w-4" />
                          Restrições
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => setDeptToDelete(dept)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remover
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={!!deptToDelete} onOpenChange={(open) => !open && setDeptToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover departamento</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Tem certeza que deseja remover o departamento <strong>{deptToDelete?.name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground"
              disabled={isDeleting}
            >
              {isDeleting ? 'Removendo...' : 'Remover'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
