
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import DocumentsTable from '@/components/admin/documents/DocumentsTable';
import { getDocuments, approveDocument, rejectDocument } from '@/modules/admin/documents/api';
import { Search, AlertTriangle } from 'lucide-react';

const PendingDocuments = () => {
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
      const docs = await getDocuments({ status: 'pending' });
      setDocuments(docs);
    } catch (error) {
      toast({
        title: "Erro ao carregar documentos",
        description: "Não foi possível carregar a lista de documentos pendentes.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApprove = async (id: string) => {
    try {
      await approveDocument(id);
      toast({
        title: "Documento aprovado",
        description: "O documento foi aprovado com sucesso.",
      });
      loadDocuments();
    } catch (error) {
      toast({
        title: "Erro ao aprovar",
        description: "Não foi possível aprovar o documento.",
        variant: "destructive"
      });
    }
  };
  
  const handleReject = async (id: string) => {
    try {
      await rejectDocument(id);
      toast({
        title: "Documento rejeitado",
        description: "O documento foi rejeitado.",
      });
      loadDocuments();
    } catch (error) {
      toast({
        title: "Erro ao rejeitar",
        description: "Não foi possível rejeitar o documento.",
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
        <h1 className="text-3xl font-bold tracking-tight">Documentos Pendentes</h1>
        <p className="text-muted-foreground">
          Aprove ou rejeite documentos que estão aguardando revisão.
        </p>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Documentos Pendentes</CardTitle>
              <CardDescription>
                Documentos que necessitam de aprovação ou rejeição
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
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
              {documents.length > 0 && (
                <Button variant="outline">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  {documents.length} Pendente{documents.length > 1 ? 's' : ''}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DocumentsTable
            documents={filteredDocuments}
            type="pending"
            isLoading={isLoading}
            onApprove={handleApprove}
            onReject={handleReject}
            onView={handleView}
            onDownload={handleDownload}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingDocuments;
