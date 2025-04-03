
// Funções utilitárias para o módulo de documentos
import { supabase } from '@/integrations/supabase/client';
import { DocumentUploadOptions } from './types';

// Simulate API delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
