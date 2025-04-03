
import React, { useState } from 'react';
import { Document } from '../types/documents';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DocumentDetails from './DocumentDetails';
import DocumentSharingOptions from './DocumentSharingOptions';
import { getDocumentViewUrl } from '../api/documentsApiService';
import { toast } from 'sonner';

interface DocumentDialogProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (document: Document) => void;
}

const DocumentDialog: React.FC<DocumentDialogProps> = ({
  document,
  isOpen,
  onClose,
  onEdit
}) => {
  const [activeTab, setActiveTab] = useState('details');
  
  if (!document) return null;
  
  const handleShare = () => {
    setActiveTab('share');
  };
  
  const handleEdit = () => {
    if (onEdit) {
      onEdit(document);
    }
  };
  
  const handleDownload = async () => {
    if (!document.path) {
      toast.error('Caminho do arquivo não disponível para download.');
      return;
    }
    
    try {
      const url = await getDocumentViewUrl(document.path);
      
      // Criar um elemento de link para download
      const a = document.createElement('a');
      a.href = url;
      a.download = document.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success('Download iniciado!');
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Falha ao fazer download do documento.');
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalhes do Documento</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="w-full justify-start border-b rounded-none px-0">
            <TabsTrigger value="details" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Detalhes
            </TabsTrigger>
            <TabsTrigger value="share" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Compartilhar
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-auto pt-4">
            <TabsContent value="details" className="mt-0 h-full">
              <DocumentDetails 
                document={document} 
                onEdit={handleEdit}
                onShare={handleShare}
                onDownload={handleDownload}
              />
            </TabsContent>
            
            <TabsContent value="share" className="mt-0 h-full">
              <DocumentSharingOptions 
                documentId={document.id}
                documentName={document.name}
              />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentDialog;
