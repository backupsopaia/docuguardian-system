
import { Department } from '@/modules/admin/users/data/departments';
import { apiFetch } from '@/lib/api';

// Get all departments
export const getDepartments = async (): Promise<Department[]> => {
  try {
    return await apiFetch<Department[]>('/departments');
  } catch (error) {
    console.log('API fetch failed, using mock data:', error);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, this would be an API call
    // For now, we'll import the mock data
    const { departments } = await import('@/modules/admin/users/data/departments');
    return departments;
  }
};

// Get department by ID
export const getDepartmentById = async (id: string): Promise<Department | undefined> => {
  try {
    return await apiFetch<Department>(`/departments/${id}`);
  } catch (error) {
    console.log('API fetch failed, using mock data:', error);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { departments } = await import('@/modules/admin/users/data/departments');
    return departments.find(dept => dept.id === id);
  }
};

// Create new department
export const createDepartment = async (departmentData: Omit<Department, 'id' | 'userCount'>): Promise<Department> => {
  try {
    return await apiFetch<Department>('/departments', {
      method: 'POST',
      body: JSON.stringify(departmentData)
    });
  } catch (error) {
    console.log('API create failed, using mock data:', error);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a random ID and create a new department
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
    return await apiFetch<Department>(`/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(departmentData)
    });
  } catch (error) {
    console.log('API update failed, using mock data:', error);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would update the backend
    console.log('Updating department:', id, departmentData);
    
    // Return mocked updated department
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
    await apiFetch(`/departments/${id}`, { method: 'DELETE' });
    return true;
  } catch (error) {
    console.log('API delete failed, using mock data:', error);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would delete from the backend
    console.log('Deleting department:', id);
    
    return true;
  }
};

// Assign document to department
export const assignDocumentToDepartment = async (documentId: string, departmentId: string): Promise<boolean> => {
  try {
    await apiFetch(`/departments/${departmentId}/documents/${documentId}`, { method: 'POST' });
    return true;
  } catch (error) {
    console.log('API assign failed, using mock data:', error);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would update the document's department
    console.log('Assigning document', documentId, 'to department', departmentId);
    
    return true;
  }
};

// Get documents by department
export const getDocumentsByDepartment = async (departmentId: string): Promise<any[]> => {
  try {
    return await apiFetch<any[]>(`/departments/${departmentId}/documents`);
  } catch (error) {
    console.log('API fetch failed, using mock data:', error);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would fetch documents from the backend
    const { getDocuments } = await import('@/modules/admin/documents/api/documentsService');
    const documents = await getDocuments();
    
    // Filter documents by department
    return documents.filter(doc => doc.department === departmentId);
  }
};
