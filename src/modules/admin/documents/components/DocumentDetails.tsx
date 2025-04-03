
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  FileText, 
  User, 
  Tag, 
  Folder, 
  Building, 
  Info, 
  History,
  Share,
  Download,
  Edit,
  Eye,
  Clock4
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Document, DocumentVersion, DocumentAuditLog } from '../types/documents';
import { getDocumentVersions, getDocumentAuditLog, getDocumentViewUrl } from '../api/documentsApiService';
import DocumentVersionHistory from './DocumentVersionHistory';
import DocumentAuditTrail from './DocumentAuditTrail';
import DocumentSharingOptions from './DocumentSharingOptions';

interface DocumentDetailsProps {
  document: Document;
  onEdit?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
}

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '-';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
    case 'approved':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'archived':
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'draft':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    default:
      return '';
  }
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'pending': return 'Pendente';
    case 'approved': return 'Aprovado';
    case 'archived': return 'Arquivado';
    case 'rejected': return 'Rejeitado';
    case 'draft': return 'Rascunho';
    default: return status;
  }
};

const DocumentDetails: React.FC<DocumentDetailsProps> = ({
  document,
  onEdit,
  onShare,
  onDownload
}) => {
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [auditLogs, setAuditLogs] = useState<DocumentAuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (document?.id && activeTab === 'versions') {
      loadVersions();
    }
    
    if (document?.id && activeTab === 'activity') {
      loadAuditLogs();
    }
    
    if (document?.path && activeTab === 'preview') {
      loadPreviewUrl();
    }
  }, [document?.id, activeTab]);

  const loadVersions = async () => {
    try {
      setLoading(true);
      const data = await getDocumentVersions(document.id);
      setVersions(data);
    } catch (error) {
      console.error('Error loading versions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      const data = await getDocumentAuditLog(document.id);
      setAuditLogs(data);
    } catch (error) {
      console.error('Error loading audit logs:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadPreviewUrl = async () => {
    if (!document.path) return;
    
    try {
      const url = await getDocumentViewUrl(document.path);
      setPreviewUrl(url);
    } catch (error) {
      console.error('Error generating preview URL:', error);
    }
  };

  if (!document) return null;

  const createdAtDate = new Date(document.createdAt);
  const updatedAtDate = new Date(document.updatedAt);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <CardTitle className="text-xl">{document.name}</CardTitle>
            <CardDescription>
              <Badge className={getStatusColor(document.status)}>
                {getStatusLabel(document.status)}
              </Badge>
              <span className="ml-2 text-sm">
                Atualizado {formatDistanceToNow(updatedAtDate, { locale: ptBR, addSuffix: true })}
              </span>
            </CardDescription>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
            {onShare && (
              <Button variant="outline" size="sm" onClick={onShare}>
                <Share className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
            )}
            {onDownload && (
              <Button variant="outline" size="sm" onClick={onDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="preview">Visualizar</TabsTrigger>
            <TabsTrigger value="versions">Versões</TabsTrigger>
            <TabsTrigger value="activity">Atividade</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Informações do Documento</h3>
                <dl className="space-y-3">
                  <div className="flex items-start">
                    <dt className="w-40 flex items-center text-muted-foreground">
                      <FileText className="h-4 w-4 mr-2" />
                      Nome:
                    </dt>
                    <dd className="font-medium">{document.name}</dd>
                  </div>
                  
                  <div className="flex items-start">
                    <dt className="w-40 flex items-center text-muted-foreground">
                      <Folder className="h-4 w-4 mr-2" />
                      Categoria:
                    </dt>
                    <dd className="font-medium">{document.category || '-'}</dd>
                  </div>
                  
                  <div className="flex items-start">
                    <dt className="w-40 flex items-center text-muted-foreground">
                      <Building className="h-4 w-4 mr-2" />
                      Cliente:
                    </dt>
                    <dd className="font-medium">{document.clientName || '-'}</dd>
                  </div>
                  
                  <div className="flex items-start">
                    <dt className="w-40 flex items-center text-muted-foreground">
                      <Info className="h-4 w-4 mr-2" />
                      Tamanho:
                    </dt>
                    <dd className="font-medium">{formatFileSize(document.size)}</dd>
                  </div>
                  
                  <div className="flex items-start">
                    <dt className="w-40 flex items-center text-muted-foreground">
                      <History className="h-4 w-4 mr-2" />
                      Versão:
                    </dt>
                    <dd className="font-medium">{document.version || '1.0'}</dd>
                  </div>
                  
                  <div className="flex items-start">
                    <dt className="w-40 flex items-center text-muted-foreground">
                      <User className="h-4 w-4 mr-2" />
                      Criado por:
                    </dt>
                    <dd className="font-medium">{document.createdBy}</dd>
                  </div>
                  
                  <div className="flex items-start">
                    <dt className="w-40 flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      Data de criação:
                    </dt>
                    <dd className="font-medium">
                      {createdAtDate.toLocaleDateString('pt-BR')} às {createdAtDate.toLocaleTimeString('pt-BR')}
                    </dd>
                  </div>
                  
                  <div className="flex items-start">
                    <dt className="w-40 flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      Última atualização:
                    </dt>
                    <dd className="font-medium">
                      {updatedAtDate.toLocaleDateString('pt-BR')} às {updatedAtDate.toLocaleTimeString('pt-BR')}
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-4">Descrição</h3>
                  <p className="text-muted-foreground">
                    {document.description || 'Nenhuma descrição fornecida.'}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Tags</h3>
                  {document.tags && document.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {document.tags.map(tag => (
                        <Badge key={tag} variant="secondary">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Nenhuma tag adicionada.</p>
                  )}
                </div>
                
                {document.isShared && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-medium mb-4">Compartilhado com</h3>
                      <div className="space-y-2">
                        {document.sharedWith?.map(user => (
                          <div key={user} className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{user}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            <div className="py-4">
              {document.path ? (
                previewUrl ? (
                  <div className="w-full h-[600px] border rounded">
                    <iframe 
                      src={previewUrl} 
                      className="w-full h-full" 
                      title={`Preview: ${document.name}`}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[400px] border rounded bg-muted/20">
                    <div className="text-center">
                      <Eye className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Carregando visualização...</p>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex items-center justify-center h-[400px] border rounded bg-muted/20">
                  <div className="text-center">
                    <Eye className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Visualização não disponível</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="versions">
            <div className="py-4">
              <DocumentVersionHistory 
                documentId={document.id} 
                versions={versions} 
                loading={loading} 
              />
            </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <div className="py-4">
              <DocumentAuditTrail 
                documentId={document.id} 
                auditLogs={auditLogs} 
                loading={loading} 
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentDetails;
