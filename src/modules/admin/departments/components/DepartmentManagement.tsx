
import React, { useState, useEffect } from 'react';
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
import { DepartmentDocumentsDialog } from './DepartmentDocumentsDialog';
import { useToast } from '@/components/ui/use-toast';
import { getDepartments } from '../api/departmentsService';
import { Department } from '@/modules/admin/users/data/departments';

const DepartmentManagement: React.FC = () => {
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
  const [usersDialogOpen, setUsersDialogOpen] = useState(false);
  const [foldersDialogOpen, setFoldersDialogOpen] = useState(false);
  const [tasksDialogOpen, setTasksDialogOpen] = useState(false);
  const [restrictionsDialogOpen, setRestrictionsDialogOpen] = useState(false);
  const [documentsDialogOpen, setDocumentsDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    loadDepartments();
  }, []);
  
  const loadDepartments = async () => {
    try {
      setIsLoading(true);
      const depts = await getDepartments();
      setDepartments(depts);
    } catch (error) {
      toast({
        title: "Erro ao carregar departamentos",
        description: "Não foi possível carregar a lista de departamentos.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setDepartmentDialogOpen(true);
  };
  
  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    setDepartmentDialogOpen(true);
  };

  const handleManageUsers = (department: Department) => {
    setEditingDepartment(department);
    setUsersDialogOpen(true);
  };

  const handleManageFolders = (department: Department) => {
    setEditingDepartment(department);
    setFoldersDialogOpen(true);
  };

  const handleManageTasks = (department: Department) => {
    setEditingDepartment(department);
    setTasksDialogOpen(true);
  };

  const handleManageRestrictions = (department: Department) => {
    setEditingDepartment(department);
    setRestrictionsDialogOpen(true);
  };
  
  const handleManageDocuments = (department: Department) => {
    setEditingDepartment(department);
    setDocumentsDialogOpen(true);
  };
  
  const handleDepartmentUpdated = () => {
    loadDepartments();
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
            departments={departments}
            isLoading={isLoading}
            onEdit={handleEditDepartment}
            onManageUsers={handleManageUsers}
            onManageFolders={handleManageFolders}
            onManageTasks={handleManageTasks}
            onManageRestrictions={handleManageRestrictions}
            onManageDocuments={handleManageDocuments}
            onDepartmentUpdated={handleDepartmentUpdated}
          />
        </CardContent>
      </Card>
      
      <DepartmentDialog 
        open={departmentDialogOpen}
        onOpenChange={setDepartmentDialogOpen}
        department={editingDepartment}
        onSuccess={handleDepartmentUpdated}
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
      
      <DepartmentDocumentsDialog
        open={documentsDialogOpen}
        onOpenChange={setDocumentsDialogOpen}
        department={editingDepartment}
      />
    </div>
  );
};

export default DepartmentManagement;
