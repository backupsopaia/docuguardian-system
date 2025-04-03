
import { apiFetch } from '@/lib/api';
import { supabase, fromTable } from '@/integrations/supabase/client';
import { delay } from './utils';
import { Document, DocumentStatus } from './types';
import { MOCK_DOCUMENTS } from './mockData';

// Obter documentos com filtros opcionais
export const getDocuments = async (filters?: { status?: DocumentStatus }) => {
  try {
    // Try to fetch from API first
    const endpoint = filters?.status 
      ? `/documents?status=${filters.status}` 
      : '/documents';
    
    return await apiFetch<Document[]>(endpoint);
  } catch (error) {
    console.log('API fetch failed, using mock data:', error);
    // Fall back to mock data
    await delay(800);
    
    let filteredDocs = [...MOCK_DOCUMENTS];
    
    if (filters?.status) {
      filteredDocs = filteredDocs.filter(doc => doc.status === filters.status);
    }
    
    return filteredDocs;
  }
};

// Get a single document by ID
export const getDocumentById = async (id: string) => {
  try {
    return await apiFetch<Document>(`/documents/${id}`);
  } catch (error) {
    console.log('API fetch failed, using mock data:', error);
    await delay(500);
    return MOCK_DOCUMENTS.find(doc => doc.id === id);
  }
};

// Delete a document permanently
export const deleteDocument = async (id: string) => {
  try {
    return await apiFetch<Document>(`/documents/${id}`, { method: 'DELETE' });
  } catch (error) {
    console.log('API delete failed, using mock data:', error);
    await delay(800);
    const docIndex = MOCK_DOCUMENTS.findIndex(doc => doc.id === id);
    
    if (docIndex >= 0) {
      const deletedDoc = MOCK_DOCUMENTS[docIndex];
      MOCK_DOCUMENTS.splice(docIndex, 1);
      return deletedDoc;
    }
    
    throw new Error('Document not found');
  }
};
