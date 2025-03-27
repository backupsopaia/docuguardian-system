
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Search, FileText, Filter } from 'lucide-react';
import { getDocuments } from '@/modules/admin/documents/api/documentsService';
import { assignDocumentToDepartment } from '../api/departmentsService';
import { Department } from '@/modules/admin/users/data/departments';
import { Document } from '@/components/admin/documents/DocumentsTable';
import { Skeleton } from '@/components/ui/skeleton';

interface DepartmentDocumentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
}

export const DepartmentDocumentsDialog: React.FC<DepartmentDocumentsDialogProps> = ({ 
  open, 
  onOpenChange, 
  department 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [departmentDocuments, setDepartmentDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (open && department) {
      loadDocuments();
    }
  }, [open, department]);
  
  const loadDocuments = async () => {
    if (!department) return;
    
    try {
      setIsLoading(true);
      const allDocs = await getDocuments();
      setDocuments(allDocs);
      
      // Filter documents that belong to this department
      const deptDocs = allDocs.filter(doc => doc.department === department.name);
      setDepartmentDocuments(deptDocs);
    } catch (error) {
      toast.error('Erro ao carregar documentos');
    } finally {
      setIsLoading(false);
    }
  };
  
  const isDocumentInDepartment = (document: Document) => {
    return departmentDocuments.some(d => d.id === document.id);
  };
  
  const toggleDocumentAssignment = (document: Document) => {
    if (isDocumentInDepartment(document)) {
      setDepartmentDocuments(departmentDocuments.filter(d => d.id !== document.id));
    } else {
      setDepartmentDocuments([...departmentDocuments, document]);
    }
  };
  
  const handleSave = async () => {
    if (!department) return;
    
    try {
      setIsSaving(true);
      
      // In a real application, this would make API calls to update document assignments
      // For now, we'll just simulate the API calls
      const assignmentPromises = departmentDocuments.map(doc => 
        assignDocumentToDepartment(doc.id, department.id)
      );
      
      await Promise.all(assignmentPromises);
      
      toast.success(`Documentos do departamento ${department.name} atualizados com sucesso`);
      onOpenChange(false);
    } catch (error) {
      toast.error('Erro ao salvar atribuições de documentos');
    } finally {
      setIsSaving(false);
    }
  };
  
  const filteredDocuments = documents.filter(doc => 
    (doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
    // Don't filter by current department to allow reassigning
    true
  );
  
  if (!department) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Documentos do Departamento: {department.name}</DialogTitle>
          <DialogDescription>
            Gerencie os documentos associados a este departamento
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-2 flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar documentos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{departmentDocuments.length}</span> documentos associados a este departamento
          </div>
          
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="w-full h-12" />
              ))}
            </div>
          ) : (
            <div className="rounded-md border overflow-y-auto flex-1">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado por</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {searchQuery
                          ? 'Nenhum documento encontrado com os critérios de busca'
                          : 'Nenhum documento disponível'
                        }
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDocuments.map(doc => (
                      <TableRow key={doc.id} className="cursor-pointer hover:bg-muted/50" onClick={() => toggleDocumentAssignment(doc)}>
                        <TableCell>
                          <Checkbox 
                            checked={isDocumentInDepartment(doc)} 
                            onCheckedChange={() => toggleDocumentAssignment(doc)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </TableCell>
                        <TableCell className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{doc.name}</span>
                        </TableCell>
                        <TableCell>{doc.category}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            doc.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            doc.status === 'pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                            'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                          }>
                            {doc.status === 'approved' ? 'Aprovado' : 
                             doc.status === 'pending' ? 'Pendente' : 
                             doc.status === 'archived' ? 'Arquivado' : 
                             doc.status === 'rejected' ? 'Rejeitado' : doc.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{doc.createdBy}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        
        <DialogFooter className="pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
