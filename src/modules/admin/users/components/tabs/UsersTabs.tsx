
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Building2 } from 'lucide-react';
import { UsersTabContent } from './UsersTabContent';
import { DepartmentsTabContent } from './DepartmentsTabContent';

interface UsersTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleAddUser: () => void;
  handleEditUser: (user: any) => void;
  handleAddDepartment: () => void;
  handleEditDepartment: (department: any) => void;
  handleOpenRestrictions: (user: any) => void;
  departments: any[];
  isLoading: boolean;
  refreshTrigger: number;
  handleDepartmentUpdated: () => void;
}

export const UsersTabs: React.FC<UsersTabsProps> = ({
  activeTab,
  setActiveTab,
  handleAddUser,
  handleEditUser,
  handleAddDepartment,
  handleEditDepartment,
  handleOpenRestrictions,
  departments,
  isLoading,
  refreshTrigger,
  handleDepartmentUpdated
}) => {
  return (
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
        <UsersTabContent 
          onAddUser={handleAddUser}
          onEditUser={handleEditUser}
          onOpenRestrictions={handleOpenRestrictions}
          refreshTrigger={refreshTrigger}
        />
      </TabsContent>
      
      <TabsContent value="departments" className="mt-6">
        <DepartmentsTabContent 
          departments={departments}
          isLoading={isLoading}
          onAddDepartment={handleAddDepartment}
          onEditDepartment={handleEditDepartment}
          onDepartmentUpdated={handleDepartmentUpdated}
        />
      </TabsContent>
    </Tabs>
  );
};
