
import { apiFetch } from '@/lib/api';
import { Document } from './types';
import { MOCK_DOCUMENTS } from './mockData';
import { delay } from './utils';

// Approve a document
export const approveDocument = async (id: string) => {
  try {
    return await apiFetch<Document>(`/documents/${id}/approve`, { method: 'POST' });
  } catch (error) {
    console.log('API approve failed, using mock data:', error);
    await delay(600);
    const docIndex = MOCK_DOCUMENTS.findIndex(doc => doc.id === id);
    
    if (docIndex >= 0) {
      MOCK_DOCUMENTS[docIndex] = {
        ...MOCK_DOCUMENTS[docIndex],
        status: 'approved',
        updatedAt: new Date().toISOString()
      };
      return MOCK_DOCUMENTS[docIndex];
    }
    
    throw new Error('Document not found');
  }
};

// Reject a document
export const rejectDocument = async (id: string) => {
  try {
    return await apiFetch<Document>(`/documents/${id}/reject`, { method: 'POST' });
  } catch (error) {
    console.log('API reject failed, using mock data:', error);
    await delay(600);
    const docIndex = MOCK_DOCUMENTS.findIndex(doc => doc.id === id);
    
    if (docIndex >= 0) {
      MOCK_DOCUMENTS[docIndex] = {
        ...MOCK_DOCUMENTS[docIndex],
        status: 'rejected',
        updatedAt: new Date().toISOString()
      };
      return MOCK_DOCUMENTS[docIndex];
    }
    
    throw new Error('Document not found');
  }
};

// Archive a document
export const archiveDocument = async (id: string) => {
  try {
    return await apiFetch<Document>(`/documents/${id}/archive`, { method: 'POST' });
  } catch (error) {
    console.log('API archive failed, using mock data:', error);
    await delay(600);
    const docIndex = MOCK_DOCUMENTS.findIndex(doc => doc.id === id);
    
    if (docIndex >= 0) {
      MOCK_DOCUMENTS[docIndex] = {
        ...MOCK_DOCUMENTS[docIndex],
        status: 'archived',
        updatedAt: new Date().toISOString()
      };
      return MOCK_DOCUMENTS[docIndex];
    }
    
    throw new Error('Document not found');
  }
};

// Restore a document from archive
export const restoreDocument = async (id: string) => {
  try {
    return await apiFetch<Document>(`/documents/${id}/restore`, { method: 'POST' });
  } catch (error) {
    console.log('API restore failed, using mock data:', error);
    await delay(600);
    const docIndex = MOCK_DOCUMENTS.findIndex(doc => doc.id === id);
    
    if (docIndex >= 0) {
      MOCK_DOCUMENTS[docIndex] = {
        ...MOCK_DOCUMENTS[docIndex],
        status: 'approved', // Restored documents go back to approved status
        updatedAt: new Date().toISOString()
      };
      return MOCK_DOCUMENTS[docIndex];
    }
    
    throw new Error('Document not found');
  }
};
