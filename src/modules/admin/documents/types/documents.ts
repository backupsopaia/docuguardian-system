
export type DocumentStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';

export interface DocumentMetadata {
  version: string;
  keywords?: string[];
  author?: string;
  createdBy?: string;
  originalFilename?: string;
  contentType?: string;
  pageCount?: number;
  [key: string]: any;
}

export interface Document {
  id: string;
  name: string;
  category: string;
  clientId?: string;
  clientName?: string;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  department: string;
  size?: number;
  version?: string;
  path?: string;
  metadata?: DocumentMetadata;
  tags?: string[];
  description?: string;
  isShared?: boolean;
  sharedWith?: string[];
  isStarred?: boolean;
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
  address?: string;
  notes?: string;
  documentCount?: number;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  createdAt: string;
  createdBy: string;
  creatorName: string;
  size?: number;
  path: string;
  changeNotes?: string;
}

export interface DocumentAuditLog {
  id: string;
  documentId: string;
  userId: string;
  userName: string;
  action: 'create' | 'view' | 'edit' | 'delete' | 'share' | 'download' | 'approve' | 'reject' | 'archive' | 'restore';
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
  clientName?: string;
  expiresAt?: string;
  isPasswordProtected: boolean;
  instructions?: string;
  categoryId?: string;
  categoryName?: string;
  createdAt: string;
  isActive: boolean;
}

export interface DocumentReminder {
  id: string;
  documentId: string;
  documentName: string;
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
  metadata?: DocumentMetadata;
  tags?: string[];
  description?: string;
}

export interface DocumentSearchFilters {
  query?: string;
  categoryIds?: string[];
  clientIds?: string[];
  status?: DocumentStatus[];
  createdBy?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  tags?: string[];
  department?: string[];
}

export interface DocumentSearchResults {
  documents: Document[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
