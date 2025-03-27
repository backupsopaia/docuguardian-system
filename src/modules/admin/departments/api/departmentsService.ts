
import { Department } from '@/modules/admin/users/data/departments';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/modules/auth';

// Get all departments
export const getDepartments = async (): Promise<Department[]> => {
  try {
    // Tenta buscar os departamentos da API real
    const response = await apiFetch<Department[]>('/departments');
    return response;
  } catch (error) {
    console.log('Falha na busca da API, usando dados simulados:', error);
    
    // Simula um atraso da API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Em uma aplicação real, isso seria uma chamada de API
    // Por enquanto, importamos os dados simulados como fallback
    const { departments } = await import('@/modules/admin/users/data/departments');
    return departments;
  }
};

// Get department by ID
export const getDepartmentById = async (id: string): Promise<Department | undefined> => {
  try {
    // Tenta buscar o departamento específico da API real
    const response = await apiFetch<Department>(`/departments/${id}`);
    return response;
  } catch (error) {
    console.log('Falha na busca da API, usando dados simulados:', error);
    
    // Simula um atraso da API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Fallback para dados simulados
    const { departments } = await import('@/modules/admin/users/data/departments');
    return departments.find(dept => dept.id === id);
  }
};

// Create new department
export const createDepartment = async (departmentData: Omit<Department, 'id' | 'userCount'>): Promise<Department> => {
  try {
    // Tenta criar um novo departamento através da API real
    const response = await apiFetch<Department>('/departments', {
      method: 'POST',
      body: JSON.stringify(departmentData)
    });
    return response;
  } catch (error) {
    console.log('Falha na criação via API, usando dados simulados:', error);
    
    // Simula um atraso da API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Gera um ID aleatório e cria um novo departamento simulado
    const newDepartment: Department = {
      id: Math.random().toString(36).substring(2, 9),
      ...departmentData,
      userCount: 0
    };
    
    // Em uma aplicação real, isso salvaria no backend
    console.log('Criando departamento:', newDepartment);
    
    return newDepartment;
  }
};

// Update existing department
export const updateDepartment = async (id: string, departmentData: Partial<Department>): Promise<Department> => {
  try {
    // Tenta atualizar o departamento através da API real
    const response = await apiFetch<Department>(`/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(departmentData)
    });
    return response;
  } catch (error) {
    console.log('Falha na atualização via API, usando dados simulados:', error);
    
    // Simula um atraso da API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Em uma aplicação real, isso atualizaria o backend
    console.log('Atualizando departamento:', id, departmentData);
    
    // Retorna um departamento atualizado simulado
    return {
      id,
      name: departmentData.name || 'Departamento Atualizado',
      description: departmentData.description || 'Descrição Atualizada',
      userCount: departmentData.userCount || 0,
      isActive: departmentData.isActive !== undefined ? departmentData.isActive : true
    };
  }
};

// Delete department
export const deleteDepartment = async (id: string): Promise<boolean> => {
  try {
    // Tenta excluir o departamento através da API real
    await apiFetch(`/departments/${id}`, { method: 'DELETE' });
    return true;
  } catch (error) {
    console.log('Falha na exclusão via API, usando dados simulados:', error);
    
    // Simula um atraso da API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Em uma aplicação real, isso excluiria do backend
    console.log('Excluindo departamento:', id);
    
    return true;
  }
};

// Assign document to department
export const assignDocumentToDepartment = async (documentId: string, departmentId: string): Promise<boolean> => {
  try {
    // Tenta atribuir um documento ao departamento através da API real
    await apiFetch(`/departments/${departmentId}/documents/${documentId}`, { method: 'POST' });
    return true;
  } catch (error) {
    console.log('Falha na atribuição via API, usando dados simulados:', error);
    
    // Simula um atraso da API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Em uma aplicação real, isso atualizaria o departamento do documento
    console.log('Atribuindo documento', documentId, 'ao departamento', departmentId);
    
    return true;
  }
};

// Get documents by department
export const getDocumentsByDepartment = async (departmentId: string): Promise<any[]> => {
  try {
    // Tenta buscar os documentos do departamento através da API real
    const response = await apiFetch<any[]>(`/departments/${departmentId}/documents`);
    return response;
  } catch (error) {
    console.log('Falha na busca via API, usando dados simulados:', error);
    
    // Simula um atraso da API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Em uma aplicação real, isso buscaria documentos do backend
    const { getDocuments } = await import('@/modules/admin/documents/api/documentsService');
    const documents = await getDocuments();
    
    // Filtra documentos por departamento
    return documents.filter(doc => doc.department === departmentId);
  }
};
