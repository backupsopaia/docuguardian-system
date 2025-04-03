
import React, { useState, useEffect } from 'react';
import DocumentsTable, { Document } from '@/components/admin/documents/DocumentsTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Plus, Upload, Filter } from 'lucide-react';
import { 
  getDocuments, 
  getDocumentCategories, 
  getClients,
  approveDocument,
  rejectDocument,
  archiveDocument,
  restoreDocument,
  deleteDocument,
} from '@/modules/admin/documents/api/documentsApiService';
import { useAuth } from '@/modules/auth';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import DocumentUploadForm from '@/modules/admin/documents/components/DocumentUploadForm';
import DocumentFilters from '@/modules/admin/documents/components/DocumentFilters';
import { DocumentCategory, Client, DocumentSearchFilters } from '@/modules/admin/documents/types/documents';
import { toast } from 'sonner';

const AllDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<'all' | 'active' | 'archived'>('all');
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [filters, setFilters] = useState<DocumentSearchFilters>({});
  
  const { isAuthenticated } = useAuth();
  
  // Carregar documentos
  const loadDocuments = async () => {
    try {
      setLoading(true);
      
      // Filtros baseados na tab atual
      const statusFilters = currentTab === 'all' 
        ? undefined 
        : currentTab === 'active' 
          ? { status: ['draft', 'pending', 'approved'] }
          : { status: ['archived'] };
      
      // Combinar filtros de status com outros filtros
      const combinedFilters = {
        ...filters,
        ...statusFilters
      };
      
      const result = await getDocuments(combinedFilters);
      setDocuments(result.documents);
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
      toast.error('Falha ao carregar documentos. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  // Carregar categorias e clientes
  const loadCategoriesAndClients = async () => {
    try {
      const [categoriesData, clientsData] = await Promise.all([
        getDocumentCategories(),
        getClients()
      ]);
      
      setCategories(categoriesData);
      setClients(clientsData);
    } catch (error) {
      console.error('Erro ao carregar dados complementares:', error);
    }
  };
  
  // Efeito para carregar dados iniciais
  useEffect(() => {
    if (isAuthenticated) {
      loadCategoriesAndClients();
      loadDocuments();
    }
  }, [isAuthenticated, currentTab, filters]);
  
  // Handler para aprovação de documento
  const handleApproveDocument = async (id: string) => {
    try {
      await approveDocument(id);
      toast.success('Documento aprovado com sucesso!');
      loadDocuments();
    } catch (error) {
      console.error('Erro ao aprovar documento:', error);
      toast.error('Falha ao aprovar documento.');
    }
  };
  
  // Handler para rejeição de documento
  const handleRejectDocument = async (id: string) => {
    try {
      await rejectDocument(id);
      toast.success('Documento rejeitado.');
      loadDocuments();
    } catch (error) {
      console.error('Erro ao rejeitar documento:', error);
      toast.error('Falha ao rejeitar documento.');
    }
  };
  
  // Handler para arquivamento de documento
  const handleArchiveDocument = async (id: string) => {
    try {
      await archiveDocument(id);
      toast.success('Documento arquivado com sucesso!');
      loadDocuments();
    } catch (error) {
      console.error('Erro ao arquivar documento:', error);
      toast.error('Falha ao arquivar documento.');
    }
  };
  
  // Handler para restauração de documento
  const handleRestoreDocument = async (id: string) => {
    try {
      await restoreDocument(id);
      toast.success('Documento restaurado com sucesso!');
      loadDocuments();
    } catch (error) {
      console.error('Erro ao restaurar documento:', error);
      toast.error('Falha ao restaurar documento.');
    }
  };
  
  // Handler para exclusão de documento
  const handleDeleteDocument = async (id: string) => {
    try {
      await deleteDocument(id);
      toast.success('Documento excluído permanentemente.');
      loadDocuments();
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      toast.error('Falha ao excluir documento.');
    }
  };
  
  // Handler para visualização de documento
  const handleViewDocument = (id: string) => {
    // Implementar abertura de documento em visualizador
    toast.info(`Visualizando documento ${id}`);
  };
  
  // Handler para edição de documento
  const handleEditDocument = (id: string) => {
    // Implementar edição de documento
    toast.info(`Editando documento ${id}`);
  };
  
  // Handler para compartilhamento de documento
  const handleShareDocument = (id: string) => {
    // Implementar compartilhamento de documento
    toast.info(`Compartilhando documento ${id}`);
  };
  
  // Handler para download de documento
  const handleDownloadDocument = (id: string) => {
    // Implementar download de documento
    toast.info(`Baixando documento ${id}`);
  };
  
  // Handler para mudança de filtros
  const handleFilterChange = (newFilters: DocumentSearchFilters) => {
    setFilters(newFilters);
  };
  
  // Handler para conclusão de upload
  const handleUploadComplete = () => {
    setUploaderOpen(false);
    loadDocuments();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold">Documentos</h1>
          <p className="text-muted-foreground">Gerencie todos os documentos da organização</p>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Button 
            onClick={() => setFiltersVisible(!filtersVisible)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Filter className="h-4 w-4 mr-2" />
            {filtersVisible ? "Ocultar filtros" : "Mostrar filtros"}
          </Button>
          <Button 
            onClick={() => setUploaderOpen(true)}
            className="w-full sm:w-auto"
          >
            <Upload className="h-4 w-4 mr-2" />
            Novo documento
          </Button>
        </div>
      </div>
      
      {filtersVisible && (
        <Card>
          <CardContent className="pt-6">
            <DocumentFilters
              categories={categories}
              clients={clients}
              onFilterChange={handleFilterChange}
            />
          </CardContent>
        </Card>
      )}
      
      <Tabs 
        defaultValue="all" 
        value={currentTab}
        onValueChange={(value) => setCurrentTab(value as 'all' | 'active' | 'archived')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="archived">Arquivados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <DocumentsTable
                  documents={documents}
                  type="all"
                  isLoading={loading}
                  onApprove={handleApproveDocument}
                  onReject={handleRejectDocument}
                  onArchive={handleArchiveDocument}
                  onRestore={handleRestoreDocument}
                  onDelete={handleDeleteDocument}
                  onView={handleViewDocument}
                  onEdit={handleEditDocument}
                  onShare={handleShareDocument}
                  onDownload={handleDownloadDocument}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="active" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <DocumentsTable
                  documents={documents}
                  type="all"
                  isLoading={loading}
                  onApprove={handleApproveDocument}
                  onReject={handleRejectDocument}
                  onArchive={handleArchiveDocument}
                  onView={handleViewDocument}
                  onEdit={handleEditDocument}
                  onShare={handleShareDocument}
                  onDownload={handleDownloadDocument}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="archived" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <DocumentsTable
                  documents={documents}
                  type="archived"
                  isLoading={loading}
                  onRestore={handleRestoreDocument}
                  onDelete={handleDeleteDocument}
                  onView={handleViewDocument}
                  onDownload={handleDownloadDocument}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={uploaderOpen} onOpenChange={setUploaderOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DocumentUploadForm 
            categories={categories}
            clients={clients}
            onUploadComplete={handleUploadComplete}
            onCancel={() => setUploaderOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllDocuments;
