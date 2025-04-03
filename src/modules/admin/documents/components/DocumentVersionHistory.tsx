
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  FileText, 
  Clock, 
  User, 
  Download, 
  Eye, 
  ArrowDown, 
  Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { DocumentVersion } from '../types/documents';
import { getDocumentViewUrl } from '../api/documentsApiService';
import { toast } from 'sonner';

interface DocumentVersionHistoryProps {
  documentId: string;
  versions: DocumentVersion[];
  loading: boolean;
}

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '-';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

const DocumentVersionHistory: React.FC<DocumentVersionHistoryProps> = ({
  documentId,
  versions,
  loading
}) => {
  const handleViewVersion = async (version: DocumentVersion) => {
    try {
      const url = await getDocumentViewUrl(version.path);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error generating view URL:', error);
      toast.error('Falha ao abrir o documento para visualização.');
    }
  };

  const handleDownloadVersion = async (version: DocumentVersion) => {
    try {
      const url = await getDocumentViewUrl(version.path);
      
      // Criar um elemento de link para download
      const a = document.createElement('a');
      a.href = url;
      a.download = version.path.split('/').pop() || `documento-v${version.versionNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success('Download iniciado!');
    } catch (error) {
      console.error('Error downloading version:', error);
      toast.error('Falha ao fazer download do documento.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Histórico de Versões</h3>
      
      {versions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Nenhuma versão adicional encontrada para este documento.</p>
        </div>
      ) : (
        <ScrollArea className="h-[400px] rounded border p-4">
          {versions.map((version, index) => {
            const createdAtDate = new Date(version.createdAt);
            
            return (
              <div key={version.id} className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      <span className="text-sm font-medium">v{version.versionNumber}</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Versão {version.versionNumber}</h4>
                      <div className="text-sm text-muted-foreground flex items-center mt-1">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>
                          {formatDistanceToNow(createdAtDate, { locale: ptBR, addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleViewVersion(version)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Visualizar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleDownloadVersion(version)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
                
                <div className="ml-11 mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  <div className="flex items-center text-sm">
                    <User className="h-3.5 w-3.5 text-muted-foreground mr-2" />
                    <span className="text-muted-foreground mr-1">Por:</span>
                    <span>{version.creatorName}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground mr-2" />
                    <span className="text-muted-foreground mr-1">Tamanho:</span>
                    <span>{formatFileSize(version.size)}</span>
                  </div>
                </div>
                
                {version.changeNotes && (
                  <div className="ml-11 mt-2 text-sm">
                    <span className="text-muted-foreground mr-1">Notas:</span>
                    <span>{version.changeNotes}</span>
                  </div>
                )}
                
                {index < versions.length - 1 && (
                  <div className="ml-4 my-4 flex items-center">
                    <div className="border-l h-6 ml-0.5"></div>
                  </div>
                )}
              </div>
            );
          })}
        </ScrollArea>
      )}
    </div>
  );
};

export default DocumentVersionHistory;
