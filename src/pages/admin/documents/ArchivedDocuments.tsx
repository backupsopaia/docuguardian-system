
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import DocumentsTable from '@/components/admin/documents/DocumentsTable';
import { getDocuments, restoreDocument, deleteDocument } from '@/modules/admin/documents/api/documentsService';
import { Search, Archive } from 'lucide-react';

const ArchivedDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    loadDocuments();
  }, []);
  
  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const docs = await getDocuments({ status: 'archived' });
      setDocuments(docs);
    } catch (error) {
      toast({
        title: "Erro ao carregar documentos",
        description: "Não foi possível carregar a lista de documentos arquivados.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRestore = async (id: string) => {
    try {
      await restoreDocument(id);
      toast({
        title: "Documento restaurado",
        description: "O documento foi restaurado com sucesso.",
      });
      loadDocuments();
    } catch (error) {
      toast({
        title: "Erro ao restaurar",
        description: "Não foi possível restaurar o documento.",
        variant: "destructive"
      });
    }
  };
  
  const confirmDelete = (id: string) => {
    const doc = documents.find(d => d.id === id);
    setDocumentToDelete(doc);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDelete = async () => {
    if (!documentToDelete) return;
    
    try {
      await deleteDocument(documentToDelete.id);
      toast({
        title: "Documento excluído",
        description: "O documento foi excluído permanentemente.",
      });
      loadDocuments();
      setIsDeleteDialogOpen(false);
      setDocumentToDelete(null);
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o documento.",
        variant: "destructive"
      });
    }
  };
  
  const handleView = (id: string) => {
    toast({
      title: "Visualizar documento",
      description: `Visualizando documento ID: ${id}`,
    });
  };
  
  const handleDownload = (id: string) => {
    toast({
      title: "Download iniciado",
      description: `Fazendo download do documento ID: ${id}`,
    });
  };
  
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.department.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documentos Arquivados</h1>
        <p className="text-muted-foreground">
          Gerencie documentos que foram arquivados e podem ser restaurados ou excluídos permanentemente.
        </p>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Arquivo</CardTitle>
              <CardDescription>
                Documentos arquivados que foram removidos do sistema ativo
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar documentos..."
                className="pl-8 w-full sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DocumentsTable
            documents={filteredDocuments}
            type="archived"
            isLoading={isLoading}
            onRestore={handleRestore}
            onDelete={confirmDelete}
            onView={handleView}
            onDownload={handleDownload}
          />
        </CardContent>
      </Card>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir documento permanentemente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O documento "{documentToDelete?.name}" 
              será excluído permanentemente do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDocumentToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ArchivedDocuments;
