
import { Document, DocumentStatus } from '@/components/admin/documents/DocumentsTable';

// Mock data - in a real application this would be replaced with actual API calls
const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'DOC-2023-001',
    name: 'Política de Segurança da Informação',
    category: 'Políticas',
    status: 'approved',
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-20T14:45:00Z',
    createdBy: 'João Silva',
    department: 'TI',
    size: 2450000,
    version: '1.2',
  },
  {
    id: 'DOC-2023-002',
    name: 'Manual de Onboarding',
    category: 'Manuais',
    status: 'pending',
    createdAt: '2023-06-02T09:15:00Z',
    updatedAt: '2023-06-02T09:15:00Z',
    createdBy: 'Ana Pereira',
    department: 'RH',
    size: 1830000,
    version: '2.0',
  },
  {
    id: 'DOC-2023-003',
    name: 'Relatório Financeiro Q2',
    category: 'Relatórios',
    status: 'pending',
    createdAt: '2023-07-05T16:20:00Z',
    updatedAt: '2023-07-06T11:10:00Z',
    createdBy: 'Carlos Mendes',
    department: 'Financeiro',
    size: 3750000,
    version: '1.0',
  },
  {
    id: 'DOC-2023-004',
    name: 'Contrato de Prestação de Serviços',
    category: 'Contratos',
    status: 'archived',
    createdAt: '2023-04-18T13:40:00Z',
    updatedAt: '2023-08-10T09:30:00Z',
    createdBy: 'Fernanda Costa',
    department: 'Jurídico',
    size: 1250000,
    version: '1.3',
  },
  {
    id: 'DOC-2023-005',
    name: 'Guia de Identidade Visual',
    category: 'Guias',
    status: 'approved',
    createdAt: '2023-03-22T10:15:00Z',
    updatedAt: '2023-03-25T14:20:00Z',
    createdBy: 'Marcos Oliveira',
    department: 'Marketing',
    size: 8900000,
    version: '2.1',
  },
  {
    id: 'DOC-2023-006',
    name: 'Plano de Marketing 2023',
    category: 'Planos',
    status: 'approved',
    createdAt: '2023-01-10T11:30:00Z',
    updatedAt: '2023-01-15T16:45:00Z',
    createdBy: 'Luciana Santos',
    department: 'Marketing',
    size: 4200000,
    version: '1.0',
  },
  {
    id: 'DOC-2023-007',
    name: 'Procedimentos de Emergência',
    category: 'Procedimentos',
    status: 'pending',
    createdAt: '2023-08-01T09:50:00Z',
    updatedAt: '2023-08-01T09:50:00Z',
    createdBy: 'Ricardo Almeida',
    department: 'Operações',
    size: 2100000,
    version: '3.2',
  },
  {
    id: 'DOC-2023-008',
    name: 'Relatório de Auditoria Interna',
    category: 'Relatórios',
    status: 'rejected',
    createdAt: '2023-07-20T14:10:00Z',
    updatedAt: '2023-07-22T10:30:00Z',
    createdBy: 'Camila Vieira',
    department: 'Compliance',
    size: 5600000,
    version: '1.0',
  },
  {
    id: 'DOC-2023-009',
    name: 'Manual do Usuário - Sistema Interno',
    category: 'Manuais',
    status: 'archived',
    createdAt: '2022-11-15T10:00:00Z',
    updatedAt: '2023-02-20T15:30:00Z',
    createdBy: 'Eduardo Lima',
    department: 'TI',
    size: 7300000,
    version: '2.5',
  },
  {
    id: 'DOC-2023-010',
    name: 'Proposta Comercial - Projeto X',
    category: 'Propostas',
    status: 'approved',
    createdAt: '2023-06-10T09:20:00Z',
    updatedAt: '2023-06-12T14:00:00Z',
    createdBy: 'Patricia Sousa',
    department: 'Comercial',
    size: 3100000,
    version: '1.1',
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get documents with optional filters
export const getDocuments = async (filters?: { status?: DocumentStatus }) => {
  // Simulate API delay
  await delay(800);
  
  let filteredDocs = [...MOCK_DOCUMENTS];
  
  if (filters?.status) {
    filteredDocs = filteredDocs.filter(doc => doc.status === filters.status);
  }
  
  return filteredDocs;
};

// Get a single document by ID
export const getDocumentById = async (id: string) => {
  await delay(500);
  return MOCK_DOCUMENTS.find(doc => doc.id === id);
};

// Approve a document
export const approveDocument = async (id: string) => {
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
};

// Reject a document
export const rejectDocument = async (id: string) => {
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
};

// Archive a document
export const archiveDocument = async (id: string) => {
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
};

// Restore a document from archive
export const restoreDocument = async (id: string) => {
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
};

// Delete a document permanently
export const deleteDocument = async (id: string) => {
  await delay(800);
  const docIndex = MOCK_DOCUMENTS.findIndex(doc => doc.id === id);
  
  if (docIndex >= 0) {
    const deletedDoc = MOCK_DOCUMENTS[docIndex];
    MOCK_DOCUMENTS.splice(docIndex, 1);
    return deletedDoc;
  }
  
  throw new Error('Document not found');
};
