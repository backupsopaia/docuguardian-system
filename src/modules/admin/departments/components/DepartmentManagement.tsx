
import React, { useState } from 'react';
import { 
  Plus, 
  FileEdit,
  Users,
  Building2, 
  FolderOpenIcon,
  FileIcon,
  ClipboardListIcon,
  ShieldAlertIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DepartmentList } from '@/modules/admin/users/components/DepartmentList';
import { DepartmentDialog } from '@/modules/admin/users/components/DepartmentDialog';
import { DepartmentUsersDialog } from './DepartmentUsersDialog';
import { DepartmentFoldersDialog } from './DepartmentFoldersDialog';
import { DepartmentRestrictionsDialog } from './DepartmentRestrictionsDialog';
import { DepartmentTasksDialog } from './DepartmentTasksDialog';

const DepartmentManagement: React.FC = () => {
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
  const [usersDialogOpen, setUsersDialogOpen] = useState(false);
  const [foldersDialogOpen, setFoldersDialogOpen] = useState(false);
  const [tasksDialogOpen, setTasksDialogOpen] = useState(false);
  const [restrictionsDialogOpen, setRestrictionsDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<any>(null);
  
  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setDepartmentDialogOpen(true);
  };
  
  const handleEditDepartment = (department: any) => {
    setEditingDepartment(department);
    setDepartmentDialogOpen(true);
  };

  const handleManageUsers = (department: any) => {
    setEditingDepartment(department);
    setUsersDialogOpen(true);
  };

  const handleManageFolders = (department: any) => {
    setEditingDepartment(department);
    setFoldersDialogOpen(true);
  };

  const handleManageTasks = (department: any) => {
    setEditingDepartment(department);
    setTasksDialogOpen(true);
  };

  const handleManageRestrictions = (department: any) => {
    setEditingDepartment(department);
    setRestrictionsDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Gestão de Departamentos</h1>
          <p className="text-muted-foreground">Gerencie departamentos e suas associações no sistema</p>
        </div>
        
        <Button onClick={handleAddDepartment}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Departamento
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Departamentos da Organização</CardTitle>
          <CardDescription>
            Gerencie departamentos e suas conexões com usuários, documentos, tarefas e restrições
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DepartmentList 
            onEdit={handleEditDepartment}
            onManageUsers={handleManageUsers}
            onManageFolders={handleManageFolders}
            onManageTasks={handleManageTasks}
            onManageRestrictions={handleManageRestrictions}
          />
        </CardContent>
      </Card>
      
      <DepartmentDialog 
        open={departmentDialogOpen}
        onOpenChange={setDepartmentDialogOpen}
        department={editingDepartment}
      />
      
      <DepartmentUsersDialog
        open={usersDialogOpen}
        onOpenChange={setUsersDialogOpen}
        department={editingDepartment}
      />

      <DepartmentFoldersDialog
        open={foldersDialogOpen}
        onOpenChange={setFoldersDialogOpen}
        department={editingDepartment}
      />

      <DepartmentTasksDialog
        open={tasksDialogOpen}
        onOpenChange={setTasksDialogOpen}
        department={editingDepartment}
      />

      <DepartmentRestrictionsDialog
        open={restrictionsDialogOpen}
        onOpenChange={setRestrictionsDialogOpen}
        department={editingDepartment}
      />
    </div>
  );
};

export default DepartmentManagement;
