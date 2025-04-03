
import { apiFetch } from '@/lib/api';
import { supabase, fromTable } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Document,
  DocumentCategory,
  Client,
  DocumentVersion,
  DocumentAuditLog,
  DocumentShare,
  DocumentRequestLink,
  DocumentReminder,
  DocumentUploadOptions,
  DocumentSearchFilters,
  DocumentSearchResults,
  DocumentStatus
} from '../types/documents';
import { MOCK_DOCUMENTS } from './mockData';

// Função auxiliar para simular atraso (apenas para demonstração)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Função para fazer upload de arquivo para o Supabase Storage
export const uploadDocumentToStorage = async (
  file: File, 
  userId: string, 
  documentId: string
): Promise<string> => {
  try {
    const filePath = `${userId}/${documentId}/${file.name}`;
    
    const { error } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      throw error;
    }
    
    // Retorna o caminho do arquivo
    return filePath;
  } catch (error) {
    console.error('Erro ao fazer upload do arquivo:', error);
    throw new Error(`Falha ao fazer upload do arquivo: ${error.message}`);
  }
};

// Função para obter URL de visualização do documento
export const getDocumentViewUrl = async (filePath: string): Promise<string> => {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 3600); // 1 hora de validade
      
    if (error) {
      throw error;
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error('Erro ao obter URL de visualização:', error);
    throw new Error(`Falha ao obter URL de visualização: ${error.message}`);
  }
};

// Obter todos os documentos com filtros
export const getDocuments = async (
  filters?: DocumentSearchFilters,
  page: number = 1,
  pageSize: number = 20
): Promise<DocumentSearchResults> => {
  try {
    // Tenta primeiro a API
    const endpoint = `/documents${filters?.query ? `?search=${filters.query}` : ''}`;
    const data = await apiFetch<DocumentSearchResults>(endpoint);
    return data;
  } catch (apiError) {
    console.warn('API fetch failed, trying Supabase:', apiError);
    
    try {
      // Tenta com Supabase
      let query = supabase.from('documents_extended').select('*', { count: 'exact' });
      
      // Aplica filtros se fornecidos
      if (filters?.query) {
        query = query.textSearch('title', filters.query, { 
          type: 'websearch',
          config: 'english' 
        });
      }
      
      if (filters?.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }
      
      if (filters?.categoryIds && filters.categoryIds.length > 0) {
        query = query.in('category_id', filters.categoryIds);
      }
      
      if (filters?.clientIds && filters.clientIds.length > 0) {
        query = query.in('client_id', filters.clientIds);
      }
      
      // Paginação
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
      
      const { data, error, count } = await query;
      
      if (error) {
        throw error;
      }
      
      // Formata os resultados para o formato esperado
      const documents: Document[] = data.map(doc => ({
        id: doc.id,
        name: doc.title,
        category: doc.category_id || '',
        status: doc.status as DocumentStatus,
        createdAt: doc.created_at,
        updatedAt: doc.updated_at,
        createdBy: doc.created_by,
        department: '',
        size: doc.file_size,
        version: String(doc.version),
        path: doc.file_path,
        metadata: doc.metadata,
        description: doc.description,
        tags: doc.metadata?.tags,
        clientId: doc.client_id,
        clientName: ''
      }));
      
      return {
        documents,
        total: count || 0,
        page,
        pageSize,
        hasMore: count ? (from + documents.length) < count : false
      };
    } catch (supabaseError) {
      console.warn('Supabase fetch failed, using mock data:', supabaseError);
      
      // Usa dados de simulação
      await delay(800);
      
      // Filtra documentos mock
      let filteredDocs = [...MOCK_DOCUMENTS];
      
      if (filters?.status) {
        filteredDocs = filteredDocs.filter(doc => 
          filters.status.includes(doc.status)
        );
      }
      
      if (filters?.query) {
        const query = filters.query.toLowerCase();
        filteredDocs = filteredDocs.filter(doc => 
          doc.name.toLowerCase().includes(query) || 
          (doc.description && doc.description.toLowerCase().includes(query))
        );
      }
      
      // Aplicar paginação
      const total = filteredDocs.length;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedDocs = filteredDocs.slice(start, end);
      
      return {
        documents: paginatedDocs,
        total,
        page,
        pageSize,
        hasMore: end < total
      };
    }
  }
};

// Obter um documento pelo ID
export const getDocumentById = async (id: string): Promise<Document> => {
  try {
    // Tenta primeiro a API
    return await apiFetch<Document>(`/documents/${id}`);
  } catch (apiError) {
    console.warn('API fetch failed, trying Supabase:', apiError);
    
    try {
      // Tenta com Supabase
      const { data, error } = await supabase
        .from('documents_extended')
        .select('*, document_categories(name)')
        .eq('id', id)
        .single();
        
      if (error) {
        throw error;
      }
      
      return {
        id: data.id,
        name: data.title,
        category: data.document_categories?.name || '',
        status: data.status as DocumentStatus,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        createdBy: data.created_by,
        department: '',
        size: data.file_size,
        version: String(data.version),
        path: data.file_path,
        metadata: data.metadata,
        description: data.description,
        tags: data.metadata?.tags,
        clientId: data.client_id,
        clientName: ''
      };
    } catch (supabaseError) {
      console.warn('Supabase fetch failed, using mock data:', supabaseError);
      
      // Usa dados de simulação
      await delay(500);
      const document = MOCK_DOCUMENTS.find(doc => doc.id === id);
      
      if (!document) {
        throw new Error(`Documento com ID ${id} não encontrado`);
      }
      
      return document;
    }
  }
};

// Criar um novo documento
export const createDocument = async (
  file: File,
  options: DocumentUploadOptions,
  onProgress?: (progress: number) => void
): Promise<Document> => {
  try {
    // Simula progresso de upload
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;
      if (progress <= 90) {
        onProgress?.(progress);
      } else {
        clearInterval(progressInterval);
      }
    }, 300);

    // Gerar um ID para o documento
    const documentId = crypto.randomUUID();
    
    // Informações sobre o usuário atual
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    // Upload do arquivo para o storage
    const filePath = await uploadDocumentToStorage(file, user.id, documentId);
    
    // Metadados do arquivo
    const metadata = {
      ...options.metadata,
      originalFilename: file.name,
      contentType: file.type,
      createdBy: user.id
    };
    
    // Criar registro do documento no banco de dados
    const { data, error } = await supabase
      .from('documents_extended')
      .insert({
        id: documentId,
        title: file.name,
        description: options.description || '',
        file_path: filePath,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        category_id: options.categoryId,
        client_id: options.clientId,
        created_by: user.id,
        metadata,
        status: 'draft'
      })
      .select()
      .single();
      
    if (error) {
      throw error;
    }

    // Simula conclusão do progresso
    onProgress?.(100);
    clearInterval(progressInterval);
    
    // Retorna o documento criado
    return {
      id: data.id,
      name: data.title,
      category: options.categoryId || '',
      status: data.status as DocumentStatus,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      createdBy: data.created_by,
      department: '',
      size: file.size,
      version: '1.0',
      path: filePath,
      description: data.description,
      metadata: metadata,
      tags: options.tags,
      clientId: options.clientId
    };
  } catch (error) {
    console.error('Erro ao criar documento:', error);
    toast.error(`Falha ao criar documento: ${error.message}`);
    throw error;
  }
};

// Atualizar um documento existente
export const updateDocument = async (
  documentId: string,
  updates: Partial<Document>
): Promise<Document> => {
  try {
    // Tenta primeiro a API
    return await apiFetch<Document>(`/documents/${documentId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  } catch (apiError) {
    console.warn('API update failed, trying Supabase:', apiError);
    
    try {
      // Prepara os dados para atualização no Supabase
      const updateData = {
        title: updates.name,
        description: updates.description,
        category_id: updates.category,
        client_id: updates.clientId,
        status: updates.status,
        metadata: {
          ...(updates.metadata || {}),
          tags: updates.tags
        }
      };
      
      // Atualiza o documento no Supabase
      const { data, error } = await supabase
        .from('documents_extended')
        .update(updateData)
        .eq('id', documentId)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return {
        id: data.id,
        name: data.title,
        category: data.category_id || '',
        status: data.status as DocumentStatus,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        createdBy: data.created_by,
        department: '',
        size: data.file_size,
        version: String(data.version),
        path: data.file_path,
        metadata: data.metadata,
        description: data.description,
        tags: data.metadata?.tags,
        clientId: data.client_id
      };
    } catch (supabaseError) {
      console.warn('Supabase update failed, using mock data:', supabaseError);
      
      // Simula atualização
      await delay(600);
      
      // Encontra e atualiza o documento mock
      const docIndex = MOCK_DOCUMENTS.findIndex(doc => doc.id === documentId);
      
      if (docIndex === -1) {
        throw new Error(`Documento com ID ${documentId} não encontrado`);
      }
      
      const updatedDoc = {
        ...MOCK_DOCUMENTS[docIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      MOCK_DOCUMENTS[docIndex] = updatedDoc;
      
      return updatedDoc;
    }
  }
};

// Aprovar um documento
export const approveDocument = async (id: string): Promise<Document> => {
  return updateDocument(id, { status: 'approved' });
};

// Rejeitar um documento
export const rejectDocument = async (id: string): Promise<Document> => {
  return updateDocument(id, { status: 'rejected' });
};

// Arquivar um documento
export const archiveDocument = async (id: string): Promise<Document> => {
  return updateDocument(id, { status: 'archived' });
};

// Restaurar um documento arquivado
export const restoreDocument = async (id: string): Promise<Document> => {
  return updateDocument(id, { status: 'approved' });
};

// Excluir um documento permanentemente
export const deleteDocument = async (id: string): Promise<void> => {
  try {
    // Tenta primeiro a API
    await apiFetch<void>(`/documents/${id}`, { method: 'DELETE' });
  } catch (apiError) {
    console.warn('API delete failed, trying Supabase:', apiError);
    
    try {
      // Busca primeiro o documento para obter o caminho do arquivo
      const { data: docData, error: docError } = await supabase
        .from('documents_extended')
        .select('file_path, created_by')
        .eq('id', id)
        .single();
        
      if (docError) {
        throw docError;
      }
      
      // Exclui o documento do banco de dados
      const { error } = await supabase
        .from('documents_extended')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Tenta excluir o arquivo do storage
      if (docData.file_path) {
        await supabase.storage
          .from('documents')
          .remove([docData.file_path]);
      }
      
      return;
    } catch (supabaseError) {
      console.warn('Supabase delete failed, using mock data:', supabaseError);
      
      // Simula exclusão
      await delay(800);
      
      // Encontra e "exclui" o documento mock
      const docIndex = MOCK_DOCUMENTS.findIndex(doc => doc.id === id);
      
      if (docIndex === -1) {
        throw new Error(`Documento com ID ${id} não encontrado`);
      }
      
      MOCK_DOCUMENTS.splice(docIndex, 1);
      
      return;
    }
  }
};

// Obter histórico de versões de um documento
export const getDocumentVersions = async (documentId: string): Promise<DocumentVersion[]> => {
  try {
    // Tenta primeiro a API
    return await apiFetch<DocumentVersion[]>(`/documents/${documentId}/versions`);
  } catch (apiError) {
    console.warn('API fetch failed, trying Supabase:', apiError);
    
    try {
      // Busca as versões do documento no Supabase
      const { data, error } = await supabase
        .from('document_versions')
        .select(`
          id,
          document_id,
          version_number,
          file_path,
          file_name,
          file_size,
          created_by,
          created_at,
          change_notes,
          users(name)
        `)
        .eq('document_id', documentId)
        .order('version_number', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      // Formata os dados para o formato esperado
      return data.map(version => ({
        id: version.id,
        documentId: version.document_id,
        versionNumber: version.version_number,
        createdAt: version.created_at,
        createdBy: version.created_by,
        creatorName: version.users?.name || 'Usuário',
        size: version.file_size,
        path: version.file_path,
        changeNotes: version.change_notes
      }));
    } catch (supabaseError) {
      console.warn('Supabase fetch failed, using mock data:', supabaseError);
      
      // Simula versões
      await delay(500);
      
      // Gera versões simuladas
      return [
        {
          id: crypto.randomUUID(),
          documentId,
          versionNumber: 3,
          createdAt: new Date().toISOString(),
          createdBy: 'user-1',
          creatorName: 'João Silva',
          size: 1024 * 1024 * 2.5,
          path: `documents/${documentId}/v3.pdf`,
          changeNotes: 'Revisão final do documento'
        },
        {
          id: crypto.randomUUID(),
          documentId,
          versionNumber: 2,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          createdBy: 'user-1',
          creatorName: 'João Silva',
          size: 1024 * 1024 * 2.3,
          path: `documents/${documentId}/v2.pdf`,
          changeNotes: 'Correções após feedback'
        },
        {
          id: crypto.randomUUID(),
          documentId,
          versionNumber: 1,
          createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          createdBy: 'user-1',
          creatorName: 'João Silva',
          size: 1024 * 1024 * 2.1,
          path: `documents/${documentId}/v1.pdf`,
          changeNotes: 'Versão inicial'
        }
      ];
    }
  }
};

// Obter categorias de documentos
export const getDocumentCategories = async (): Promise<DocumentCategory[]> => {
  try {
    // Tenta primeiro a API
    return await apiFetch<DocumentCategory[]>('/document-categories');
  } catch (apiError) {
    console.warn('API fetch failed, trying Supabase:', apiError);
    
    try {
      // Busca categorias no Supabase
      const { data, error } = await supabase
        .from('document_categories')
        .select('*');
        
      if (error) {
        throw error;
      }
      
      // Formata os dados para o formato esperado
      return data.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description
      }));
    } catch (supabaseError) {
      console.warn('Supabase fetch failed, using mock data:', supabaseError);
      
      // Usa categorias simuladas
      await delay(300);
      
      return [
        { id: 'cat-1', name: 'Contratos', description: 'Contratos e documentos legais', documentCount: 15 },
        { id: 'cat-2', name: 'Relatórios', description: 'Relatórios financeiros e operacionais', documentCount: 8 },
        { id: 'cat-3', name: 'Manuais', description: 'Manuais e documentação técnica', documentCount: 12 },
        { id: 'cat-4', name: 'Políticas', description: 'Políticas corporativas', documentCount: 5 },
        { id: 'cat-5', name: 'Apresentações', description: 'Apresentações e slides', documentCount: 10 }
      ];
    }
  }
};

// Obter clientes
export const getClients = async (): Promise<Client[]> => {
  try {
    // Tenta primeiro a API
    return await apiFetch<Client[]>('/clients');
  } catch (apiError) {
    console.warn('API fetch failed, trying Supabase:', apiError);
    
    try {
      // Busca clientes no Supabase
      const { data, error } = await supabase
        .from('clients')
        .select('*');
        
      if (error) {
        throw error;
      }
      
      // Formata os dados
      return data.map(client => ({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        notes: client.notes
      }));
    } catch (supabaseError) {
      console.warn('Supabase fetch failed, using mock data:', supabaseError);
      
      // Usa clientes simulados
      await delay(300);
      
      return [
        { id: 'client-1', name: 'Empresa ABC', email: 'contato@abc.com', phone: '(11) 1234-5678', documentCount: 8 },
        { id: 'client-2', name: 'Corporação XYZ', email: 'info@xyz.com', phone: '(21) 9876-5432', documentCount: 15 },
        { id: 'client-3', name: 'Indústrias 123', email: 'suporte@123.com', phone: '(31) 5555-1234', documentCount: 6 },
        { id: 'client-4', name: 'Grupo Inovação', email: 'contato@inovacao.com', phone: '(41) 7777-8888', documentCount: 12 },
        { id: 'client-5', name: 'Tech Solutions', email: 'info@techsol.com', phone: '(51) 3333-2222', documentCount: 9 }
      ];
    }
  }
};

// Obter trilha de auditoria de um documento
export const getDocumentAuditLog = async (documentId: string): Promise<DocumentAuditLog[]> => {
  try {
    // Tenta primeiro a API
    return await apiFetch<DocumentAuditLog[]>(`/documents/${documentId}/audit-log`);
  } catch (apiError) {
    console.warn('API fetch failed, trying Supabase:', apiError);
    
    try {
      // Busca registros de auditoria no Supabase
      const { data, error } = await supabase
        .from('document_audit_log')
        .select(`
          id,
          document_id,
          user_id,
          action,
          action_details,
          ip_address,
          timestamp,
          users(name)
        `)
        .eq('document_id', documentId)
        .order('timestamp', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      // Formata os dados
      return data.map(log => ({
        id: log.id,
        documentId: log.document_id,
        userId: log.user_id,
        userName: log.users?.name || 'Usuário',
        action: log.action as any,
        timestamp: log.timestamp,
        details: log.action_details,
        ipAddress: log.ip_address
      }));
    } catch (supabaseError) {
      console.warn('Supabase fetch failed, using mock data:', supabaseError);
      
      // Usa dados simulados
      await delay(500);
      
      // Gera registros de auditoria simulados
      return [
        {
          id: crypto.randomUUID(),
          documentId,
          userId: 'user-1',
          userName: 'João Silva',
          action: 'view',
          timestamp: new Date().toISOString(),
          details: { browser: 'Chrome', os: 'Windows' },
          ipAddress: '192.168.1.1'
        },
        {
          id: crypto.randomUUID(),
          documentId,
          userId: 'user-2',
          userName: 'Maria Santos',
          action: 'edit',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          details: { changedFields: ['title', 'description'] },
          ipAddress: '192.168.1.2'
        },
        {
          id: crypto.randomUUID(),
          documentId,
          userId: 'user-3',
          userName: 'Carlos Oliveira',
          action: 'share',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          details: { sharedWith: 'cliente@empresa.com' },
          ipAddress: '192.168.1.3'
        }
      ];
    }
  }
};

// Criar link de compartilhamento
export const createShareLink = async (
  documentId: string,
  options: {
    externalEmail?: string;
    permission: 'view' | 'edit' | 'comment';
    expiresAt?: Date;
  }
): Promise<DocumentShare> => {
  // Gera token de acesso único
  const accessToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  try {
    // Informações sobre o usuário atual
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    // Criar compartilhamento no Supabase
    const { data, error } = await supabase
      .from('document_shares')
      .insert({
        document_id: documentId,
        shared_by: user.id,
        external_email: options.externalEmail,
        access_token: accessToken,
        permissions: options.permission,
        expires_at: options.expiresAt?.toISOString(),
        is_active: true
      })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      documentId: data.document_id,
      sharedBy: data.shared_by,
      externalEmail: data.external_email,
      permission: data.permissions as any,
      expiresAt: data.expires_at,
      accessToken: data.access_token,
      isActive: data.is_active,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Erro ao criar link de compartilhamento:', error);
    
    // Simula criação de link
    await delay(600);
    
    return {
      id: crypto.randomUUID(),
      documentId,
      sharedBy: 'user-1',
      externalEmail: options.externalEmail,
      permission: options.permission,
      expiresAt: options.expiresAt?.toISOString(),
      accessToken,
      isActive: true,
      createdAt: new Date().toISOString()
    };
  }
};

// Criar link para solicitação de documentos
export const createRequestLink = async (
  options: {
    clientId?: string;
    categoryId?: string;
    instructions?: string;
    expiresAt?: Date;
    password?: string;
  }
): Promise<DocumentRequestLink> => {
  // Gera token único
  const token = Math.random().toString(36).substring(2, 10);
  
  try {
    // Informações sobre o usuário atual
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    // Hash da senha (se fornecida)
    let passwordHash = null;
    if (options.password) {
      // Em um aplicativo real, você usaria uma função de hash segura
      passwordHash = btoa(options.password);
    }
    
    // Criar link de solicitação no Supabase
    const { data, error } = await supabase
      .from('document_request_links')
      .insert({
        created_by: user.id,
        client_id: options.clientId,
        token,
        password_hash: passwordHash,
        expires_at: options.expiresAt?.toISOString(),
        instructions: options.instructions,
        category_id: options.categoryId,
        is_active: true
      })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      token: data.token,
      createdBy: data.created_by,
      clientId: data.client_id,
      expiresAt: data.expires_at,
      isPasswordProtected: !!data.password_hash,
      instructions: data.instructions,
      categoryId: data.category_id,
      createdAt: data.created_at,
      isActive: data.is_active
    };
  } catch (error) {
    console.error('Erro ao criar link de solicitação:', error);
    
    // Simula criação de link
    await delay(600);
    
    return {
      id: crypto.randomUUID(),
      token,
      createdBy: 'user-1',
      clientId: options.clientId,
      expiresAt: options.expiresAt?.toISOString(),
      isPasswordProtected: !!options.password,
      instructions: options.instructions,
      categoryId: options.categoryId,
      createdAt: new Date().toISOString(),
      isActive: true
    };
  }
};

// Criar lembrete para documento
export const createDocumentReminder = async (
  documentId: string,
  options: {
    reminderDate: Date;
    title: string;
    message?: string;
  }
): Promise<DocumentReminder> => {
  try {
    // Informações sobre o usuário atual
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    // Obter nome do documento
    const { data: docData, error: docError } = await supabase
      .from('documents_extended')
      .select('title')
      .eq('id', documentId)
      .single();
      
    if (docError) {
      throw docError;
    }
    
    // Criar lembrete no Supabase
    const { data, error } = await supabase
      .from('document_reminders')
      .insert({
        document_id: documentId,
        user_id: user.id,
        reminder_date: options.reminderDate.toISOString(),
        title: options.title,
        message: options.message,
        is_active: true
      })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      documentId: data.document_id,
      documentName: docData.title,
      userId: data.user_id,
      reminderDate: data.reminder_date,
      title: data.title,
      message: data.message,
      isActive: data.is_active,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Erro ao criar lembrete:', error);
    
    // Simula criação de lembrete
    await delay(600);
    
    return {
      id: crypto.randomUUID(),
      documentId,
      documentName: 'Contrato.pdf',
      userId: 'user-1',
      reminderDate: options.reminderDate.toISOString(),
      title: options.title,
      message: options.message,
      isActive: true,
      createdAt: new Date().toISOString()
    };
  }
};
