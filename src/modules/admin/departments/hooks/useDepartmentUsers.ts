
import { useState, useCallback, useMemo } from 'react';

export const useDepartmentUsers = (allUsers: any[], initialDepartmentUsers: any[] = []) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentUsers, setDepartmentUsers] = useState<any[]>(initialDepartmentUsers);
  
  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return allUsers;
    
    return allUsers.filter(user => 
      (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, allUsers]);
  
  // Check if a user is assigned to the department
  const isUserInDepartment = useCallback((userId: string) => {
    return departmentUsers.some(u => u.id === userId);
  }, [departmentUsers]);
  
  // Toggle user assignment to department
  const toggleUserAssignment = useCallback((user: any) => {
    setDepartmentUsers(prev => {
      if (isUserInDepartment(user.id)) {
        return prev.filter(u => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  }, [isUserInDepartment]);
  
  // Reset department users
  const resetDepartmentUsers = useCallback((users: any[]) => {
    setDepartmentUsers(users);
    setSearchQuery('');
  }, []);
  
  return {
    searchQuery,
    setSearchQuery,
    departmentUsers,
    filteredUsers,
    isUserInDepartment,
    toggleUserAssignment,
    resetDepartmentUsers,
  };
};
