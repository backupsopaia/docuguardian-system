
import React, { useState } from 'react';
import { 
  Plus, 
  FileEdit, 
  Trash2, 
  UserCog, 
  ShieldCheck, 
  Users, 
  Clock, 
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersList } from './UsersList';
import { DepartmentList } from './DepartmentList';
import { UserDialog } from './UserDialog';
import { DepartmentDialog } from './DepartmentDialog';
import { AccessRestrictionsDialog } from './AccessRestrictionsDialog';

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
  const [restrictionsDialogOpen, setRestrictionsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const handleAddUser = () => {
    setEditingItem(null);
    setUserDialogOpen(true);
  };
  
  const handleEditUser = (user: any) => {
    setEditingItem(user);
    setUserDialogOpen(true);
  };
  
  const handleAddDepartment = () => {
    setEditingItem(null);
    setDepartmentDialogOpen(true);
  };
  
  const handleEditDepartment = (department: any) => {
    setEditingItem(department);
    setDepartmentDialogOpen(true);
  };
  
  const handleOpenRestrictions = (user: any) => {
    setEditingItem(user);
    setRestrictionsDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Gestão de Usuários e Departamentos</h1>
          <p className="text-muted-foreground">Gerenciar usuários, departamentos e permissões</p>
        </div>
        
        {activeTab === 'users' ? (
          <Button onClick={handleAddUser}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Usuário
          </Button>
        ) : (
          <Button onClick={handleAddDepartment}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Departamento
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="departments">
            <Building2 className="mr-2 h-4 w-4" />
            Departamentos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Usuários do Sistema</CardTitle>
              <CardDescription>
                Gerencie os usuários, defina permissões e configure restrições de acesso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UsersList 
                onEdit={handleEditUser} 
                onPermissions={handleOpenRestrictions} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="departments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Departamentos da Organização</CardTitle>
              <CardDescription>
                Gerencie departamentos e associe usuários a cada departamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DepartmentList onEdit={handleEditDepartment} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <UserDialog 
        open={userDialogOpen} 
        onOpenChange={setUserDialogOpen}
        user={editingItem}
      />
      
      <DepartmentDialog
        open={departmentDialogOpen}
        onOpenChange={setDepartmentDialogOpen}
        department={editingItem}
      />
      
      <AccessRestrictionsDialog
        open={restrictionsDialogOpen}
        onOpenChange={setRestrictionsDialogOpen}
        user={editingItem}
      />
    </div>
  );
};

export default UserManagement;
