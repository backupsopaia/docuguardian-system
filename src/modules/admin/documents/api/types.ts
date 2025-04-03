
// Tipos para o módulo de documentos

export type DocumentStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';

export interface Document {
  id: string;
  name: string;
  category: string;
  status: DocumentStatus;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  department: string;
  size?: number;
  version: string;
  path?: string;
  metadata?: any;
  description?: string;
  tags?: string[];
  clientId?: string;
  clientName?: string;
}

export interface DocumentSearchFilters {
  status?: DocumentStatus[];
  query?: string;
  categoryIds?: string[];
  clientIds?: string[];
  startDate?: string;
  endDate?: string;
  department?: string;
}

export interface DocumentSearchResults {
  documents: Document[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface DocumentCategory {
  id: string;
  name: string;
  description?: string;
  documentCount?: number;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  documentCount?: number;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  createdAt: string;
  createdBy: string;
  creatorName?: string;
  size?: number;
  path?: string;
  changeNotes?: string;
}

export interface DocumentAuditLog {
  id: string;
  documentId: string;
  userId: string;
  userName?: string;
  action: 'create' | 'view' | 'edit' | 'delete' | 'download' | 'share' | 'approve' | 'reject' | 'archive' | 'restore';
  timestamp: string;
  details?: any;
  ipAddress?: string;
}

export interface DocumentShare {
  id: string;
  documentId: string;
  sharedBy: string;
  sharedWith?: string;
  externalEmail?: string;
  permission: 'view' | 'edit' | 'comment';
  expiresAt?: string;
  accessToken: string;
  isActive: boolean;
  createdAt: string;
}

export interface DocumentRequestLink {
  id: string;
  token: string;
  createdBy: string;
  clientId?: string;
  expiresAt?: string;
  isPasswordProtected: boolean;
  instructions?: string;
  categoryId?: string;
  createdAt: string;
  isActive: boolean;
}

export interface DocumentReminder {
  id: string;
  documentId: string;
  documentName?: string;
  userId: string;
  reminderDate: string;
  title: string;
  message?: string;
  isActive: boolean;
  createdAt: string;
}

export interface DocumentUploadOptions {
  categoryId?: string;
  clientId?: string;
  description?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface ExportRequest {
  format: 'pdf' | 'excel';
  data: any;
  filters?: {
    startDate?: string;
    endDate?: string;
    status?: string;
    category?: string;
    department?: string;
  };
}

export interface ReportParams {
  startDate?: string;
  endDate?: string;
  status?: string;
  category?: string;
  department?: string;
}
