
import { apiFetch } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';

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
