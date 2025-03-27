
import { Department } from '@/modules/admin/users/data/departments';
import { apiFetch } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';

// Get all departments
export const getDepartments = async (): Promise<Department[]> => {
  try {
    console.log('Fetching departments from Supabase...');
    // Try to fetch departments from Supabase directly
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name');
      
    if (error) {
      console.error('Supabase error fetching departments:', error);
      throw error;
    }
    
    // If we have data from Supabase, ensure it's an array and return it
    if (data && Array.isArray(data)) {
      console.log(`Successfully fetched ${data.length} departments from Supabase`);
      // Map database column names to frontend property names
      return data.map(dept => ({
        id: dept.id,
        name: dept.name,
        description: dept.description || '',
        isActive: dept.is_active || false,
        userCount: dept.user_count || 0,
        createdAt: dept.created_at,
        updatedAt: dept.updated_at
      }));
    }
    
    // Fallback to API
    try {
      console.log('Falling back to API for departments...');
      const response = await apiFetch<Department[]>('/departments');
      if (Array.isArray(response)) {
        console.log(`Successfully fetched ${response.length} departments from API`);
        return response;
      } else {
        console.error('Expected array but got:', response);
        throw new Error('Invalid response format');
      }
    } catch (apiError) {
      console.error('API fetch failed:', apiError);
      throw apiError;
    }
  } catch (error) {
    console.error('Failed to fetch departments, using simulated data:', error);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, this would be an API call
    // For now, we import the mock data as fallback
    const { departments } = await import('@/modules/admin/users/data/departments');
    console.log(`Returned ${departments.length} simulated departments`);
    return Array.isArray(departments) ? departments : [];
  }
};

// Get department by ID
export const getDepartmentById = async (id: string): Promise<Department | undefined> => {
  try {
    // Try to fetch the department from Supabase directly
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    // If we have data from Supabase, return it mapped to frontend format
    if (data) {
      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        isActive: data.is_active || false,
        userCount: data.user_count || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
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
export const createDepartment = async (departmentData: { 
  name: string; 
  description: string; 
  isActive: boolean; 
}): Promise<Department> => {
  try {
    console.log('Creating department in Supabase:', departmentData);
    // Try to create a department in Supabase directly
    const { data, error } = await supabase
      .from('departments')
      .insert({ 
        name: departmentData.name,
        description: departmentData.description,
        is_active: departmentData.isActive,
        user_count: 0
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating department in Supabase:', error);
      throw error;
    }
    
    // If we have data from Supabase, return it mapped to frontend format
    if (data) {
      console.log('Department created successfully in Supabase:', data);
      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        isActive: data.is_active || false,
        userCount: data.user_count || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    }
    
    // Fallback to API
    console.log('Falling back to API for department creation');
    const response = await apiFetch<Department>('/departments', {
      method: 'POST',
      body: JSON.stringify(departmentData)
    });
    return response;
  } catch (error) {
    console.error('Failed to create department, using simulated data:', error);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a random ID and create a simulated new department
    const newDepartment: Department = {
      id: Math.random().toString(36).substring(2, 9),
      name: departmentData.name,
      description: departmentData.description,
      isActive: departmentData.isActive,
      userCount: 0
    };
    
    // In a real app, this would save to the backend
    console.log('Creating simulated department:', newDepartment);
    
    return newDepartment;
  }
};

// Update existing department
export const updateDepartment = async (id: string, departmentData: Partial<{
  name: string;
  description: string;
  isActive: boolean;
}>): Promise<Department> => {
  try {
    console.log(`Updating department ${id} in Supabase:`, departmentData);
    // Try to update the department in Supabase directly
    const { data, error } = await supabase
      .from('departments')
      .update({
        name: departmentData.name,
        description: departmentData.description,
        is_active: departmentData.isActive
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating department in Supabase:', error);
      throw error;
    }
    
    // If we have data from Supabase, return it mapped to frontend format
    if (data) {
      console.log('Department updated successfully in Supabase:', data);
      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        isActive: data.is_active || false,
        userCount: data.user_count || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    }
    
    // Fallback to API
    console.log('Falling back to API for department update');
    const response = await apiFetch<Department>(`/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(departmentData)
    });
    return response;
  } catch (error) {
    console.error('Failed to update department, using simulated data:', error);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would update the backend
    console.log('Updating simulated department:', id, departmentData);
    
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
    const { error } = await supabase
      .from('departments')
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
    const { error } = await supabase
      .from('documents')
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
    const { data, error } = await supabase
      .from('documents')
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
