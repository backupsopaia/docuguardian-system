
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import DocumentsTable from '@/components/admin/documents/DocumentsTable';
import { getDocuments, archiveDocument } from '@/modules/admin/documents/api';
import { Search, CheckCircle } from 'lucide-react';

const ApprovedDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  useEffect(() => {
    loadDocuments();
  }, []);
  
  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const docs = await getDocuments({ status: 'approved' });
      setDocuments(docs);
    } catch (error) {
      toast({
        title: "Erro ao carregar documentos",
        description: "Não foi possível carregar a lista de documentos aprovados.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleArchive = async (id: string) => {
    try {
      await archiveDocument(id);
      toast({
        title: "Documento arquivado",
        description: "O documento foi arquivado com sucesso.",
      });
      loadDocuments();
    } catch (error) {
      toast({
        title: "Erro ao arquivar",
        description: "Não foi possível arquivar o documento.",
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
  
  const handleEdit = (id: string) => {
    toast({
      title: "Editar documento",
      description: `Editando documento ID: ${id}`,
    });
  };
  
  const handleShare = (id: string) => {
    toast({
      title: "Compartilhar documento",
      description: `Compartilhando documento ID: ${id}`,
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
        <h1 className="text-3xl font-bold tracking-tight">Documentos Aprovados</h1>
        <p className="text-muted-foreground">
          Gerencie os documentos que foram aprovados.
        </p>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Documentos Aprovados</CardTitle>
              <CardDescription>
                Documentos que foram aprovados e estão ativos no sistema
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
            type="approved"
            isLoading={isLoading}
            onArchive={handleArchive}
            onView={handleView}
            onEdit={handleEdit}
            onShare={handleShare}
            onDownload={handleDownload}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovedDocuments;
