
import { Department } from '@/modules/admin/users/data/departments';
import { apiFetch } from '@/lib/api';
import { supabase, fromTable } from '@/integrations/supabase/client';

// Get all departments
export const getDepartments = async (): Promise<Department[]> => {
  try {
    // Try to fetch departments from Supabase directly
    const { data, error } = await fromTable<Department>('departments')
      .select('*');
      
    if (error) throw error;
    
    // If we have data from Supabase, return it
    if (data && data.length > 0) {
      return data as Department[];
    }
    
    // Fallback to API
    const response = await apiFetch<Department[]>('/departments');
    return response;
  } catch (error) {
    console.log('Failed to fetch departments, using simulated data:', error);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, this would be an API call
    // For now, we import the mock data as fallback
    const { departments } = await import('@/modules/admin/users/data/departments');
    return departments;
  }
};

// Get department by ID
export const getDepartmentById = async (id: string): Promise<Department | undefined> => {
  try {
    // Try to fetch the department from Supabase directly
    const { data, error } = await fromTable<Department>('departments')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    // If we have data from Supabase, return it
    if (data) {
      return data as Department;
    }
    
    // Fallback to API
    const response = await apiFetch<Department>(`/departments/${id}`);
    return response;
  } catch (error) {
    console.log('Failed to fetch department, using simulated data:', error);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Fallback to mock data
    const { departments } = await import('@/modules/admin/users/data/departments');
    return departments.find(dept => dept.id === id);
  }
};

// Create new department
export const createDepartment = async (departmentData: Omit<Department, 'id' | 'userCount'>): Promise<Department> => {
  try {
    // Try to create a department in Supabase directly
    const { data, error } = await fromTable<Department>('departments')
      .insert({ 
        ...departmentData,
        user_count: 0
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // If we have data from Supabase, return it
    if (data) {
      return data as Department;
    }
    
    // Fallback to API
    const response = await apiFetch<Department>('/departments', {
      method: 'POST',
      body: JSON.stringify(departmentData)
    });
    return response;
  } catch (error) {
    console.log('Failed to create department, using simulated data:', error);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a random ID and create a simulated new department
    const newDepartment: Department = {
      id: Math.random().toString(36).substring(2, 9),
      ...departmentData,
      userCount: 0
    };
    
    // In a real app, this would save to the backend
    console.log('Creating department:', newDepartment);
    
    return newDepartment;
  }
};

// Update existing department
export const updateDepartment = async (id: string, departmentData: Partial<Department>): Promise<Department> => {
  try {
    // Try to update the department in Supabase directly
    const { data, error } = await fromTable<Department>('departments')
      .update(departmentData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    // If we have data from Supabase, return it
    if (data) {
      return data as Department;
    }
    
    // Fallback to API
    const response = await apiFetch<Department>(`/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(departmentData)
    });
    return response;
  } catch (error) {
    console.log('Failed to update department, using simulated data:', error);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would update the backend
    console.log('Updating department:', id, departmentData);
    
    // Return a simulated updated department
    return {
      id,
      name: departmentData.name || 'Updated Department',
      description: departmentData.description || 'Updated Description',
      userCount: departmentData.userCount || 0,
      isActive: departmentData.isActive !== undefined ? departmentData.isActive : true
    };
  }
};

// Delete department
export const deleteDepartment = async (id: string): Promise<boolean> => {
  try {
    // Try to delete the department from Supabase directly
    const { error } = await fromTable('departments')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    try {
      // Fallback to API
      await apiFetch(`/departments/${id}`, { method: 'DELETE' });
      return true;
    } catch (apiError) {
      console.log('Failed to delete department, using simulated data:', error);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would delete from the backend
      console.log('Deleting department:', id);
      
      return true;
    }
  }
};

// Assign document to department
export const assignDocumentToDepartment = async (documentId: string, departmentId: string): Promise<boolean> => {
  try {
    // Try to update the document in Supabase directly
    const { error } = await fromTable('documents')
      .update({ department_id: departmentId })
      .eq('id', documentId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    try {
      // Fallback to API
      await apiFetch(`/departments/${departmentId}/documents/${documentId}`, { method: 'POST' });
      return true;
    } catch (apiError) {
      console.log('Failed to assign document, using simulated data:', error);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would update the document's department
      console.log('Assigning document', documentId, 'to department', departmentId);
      
      return true;
    }
  }
};

// Get documents by department
export const getDocumentsByDepartment = async (departmentId: string): Promise<any[]> => {
  try {
    // Try to fetch documents from Supabase directly
    const { data, error } = await fromTable('documents')
      .select('*')
      .eq('department_id', departmentId);
      
    if (error) throw error;
    
    // If we have data from Supabase, return it
    if (data) {
      return data;
    }
    
    // Fallback to API
    const response = await apiFetch<any[]>(`/departments/${departmentId}/documents`);
    return response;
  } catch (error) {
    console.log('Failed to fetch documents, using simulated data:', error);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would fetch documents from the backend
    const { getDocuments } = await import('@/modules/admin/documents/api/documentsService');
    const documents = await getDocuments();
    
    // Filter documents by department
    return documents.filter(doc => doc.department === departmentId);
  }
};
