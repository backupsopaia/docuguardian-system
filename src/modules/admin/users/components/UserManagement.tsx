
import React, { useState, useEffect } from 'react';
import { UserManagementHeader } from './UserManagementHeader';
import { UsersTabs } from './tabs/UsersTabs';
import { UserDialog } from './user-dialog';
import { DepartmentDialog } from './department';
import { AccessRestrictionsDialog } from './AccessRestrictionsDialog';
import { getDepartments } from '@/modules/admin/departments/api/departmentsService';
import { Department } from '../data/departments';
import { User } from '../api/types';

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
  const [restrictionsDialogOpen, setRestrictionsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<User | Department | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  useEffect(() => {
    if (activeTab === 'departments') {
      loadDepartments();
    }
  }, [activeTab]);

  const loadDepartments = async () => {
    try {
      setIsLoading(true);
      const depts = await getDepartments();
      setDepartments(depts);
    } catch (error) {
      console.error('Error loading departments:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddUser = () => {
    setEditingItem(null);
    setUserDialogOpen(true);
  };
  
  const handleEditUser = (user: User) => {
    setEditingItem(user);
    setUserDialogOpen(true);
  };
  
  const handleAddDepartment = () => {
    setEditingItem(null);
    setDepartmentDialogOpen(true);
  };
  
  const handleEditDepartment = (department: Department) => {
    setEditingItem(department);
    setDepartmentDialogOpen(true);
  };
  
  const handleOpenRestrictions = (user: User) => {
    setEditingItem(user);
    setRestrictionsDialogOpen(true);
  };

  const handleDepartmentUpdated = () => {
    loadDepartments();
  };

  const handleUserUpdated = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <UserManagementHeader 
        activeTab={activeTab}
        onAddUser={handleAddUser}
        onAddDepartment={handleAddDepartment}
      />
      
      <UsersTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleAddUser={handleAddUser}
        handleEditUser={handleEditUser}
        handleAddDepartment={handleAddDepartment}
        handleEditDepartment={handleEditDepartment}
        handleOpenRestrictions={handleOpenRestrictions}
        departments={departments}
        isLoading={isLoading}
        refreshTrigger={refreshTrigger}
        handleDepartmentUpdated={handleDepartmentUpdated}
      />
      
      <UserDialog 
        open={userDialogOpen} 
        onOpenChange={setUserDialogOpen}
        user={editingItem as User}
        onUserUpdated={handleUserUpdated}
      />
      
      <DepartmentDialog
        open={departmentDialogOpen}
        onOpenChange={setDepartmentDialogOpen}
        department={editingItem as Department}
        onSuccess={handleDepartmentUpdated}
      />
      
      <AccessRestrictionsDialog
        open={restrictionsDialogOpen}
        onOpenChange={setRestrictionsDialogOpen}
        user={editingItem as User}
      />
    </div>
  );
};

export default UserManagement;
