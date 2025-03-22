
import React, { useState } from 'react';
import { FileEdit, Trash2, Users, FolderOpen, ClipboardList, ShieldAlert } from 'lucide-react';
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
import { departments } from '@/modules/admin/users/data/departments';

interface DepartmentListProps {
  onEdit: (department: any) => void;
  onManageUsers?: (department: any) => void;
  onManageFolders?: (department: any) => void;
  onManageTasks?: (department: any) => void;
  onManageRestrictions?: (department: any) => void;
}

export const DepartmentList: React.FC<DepartmentListProps> = ({ 
  onEdit, 
  onManageUsers,
  onManageFolders,
  onManageTasks,
  onManageRestrictions
}) => {
  const [depts, setDepts] = useState(departments);
  const [deptToDelete, setDeptToDelete] = useState<any | null>(null);
  
  const handleDelete = () => {
    if (!deptToDelete) return;
    
    // In a real app, you would make an API call here
    setDepts(depts.filter(dept => dept.id !== deptToDelete.id));
    toast.success(`Departamento ${deptToDelete.name} removido com sucesso`);
    setDeptToDelete(null);
  };
  
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
            {depts.map(dept => (
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
                      {onManageFolders && (
                        <DropdownMenuItem onClick={() => onManageFolders(dept)}>
                          <FolderOpen className="mr-2 h-4 w-4" />
                          Pastas e Documentos
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
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
