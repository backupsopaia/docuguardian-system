
import React from 'react';
import { AddEntityButton } from './AddEntityButton';

interface UserManagementHeaderProps {
  activeTab: string;
  onAddUser: () => void;
  onAddDepartment: () => void;
}

export const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({
  activeTab,
  onAddUser,
  onAddDepartment
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Gestão de Usuários e Departamentos</h1>
        <p className="text-muted-foreground">Gerenciar usuários, departamentos e permissões</p>
      </div>
      
      {activeTab === 'users' ? (
        <AddEntityButton onClick={onAddUser} entityType="user" />
      ) : (
        <AddEntityButton onClick={onAddDepartment} entityType="department" />
      )}
    </div>
  );
};
