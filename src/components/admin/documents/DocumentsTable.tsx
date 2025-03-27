
import React, { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Eye, 
  Share2, 
  Edit, 
  CheckSquare, 
  X, 
  Archive, 
  RotateCcw, 
  Trash2 
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export type DocumentStatus = 'pending' | 'approved' | 'archived' | 'rejected';

export interface Document {
  id: string;
  name: string;
  category: string;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  department: string;
  size?: number;
  version?: string;
}

interface DocumentsTableProps {
  documents: Document[];
  type: 'all' | 'pending' | 'approved' | 'archived';
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onArchive?: (id: string) => void;
  onRestore?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onShare?: (id: string) => void;
  onDownload?: (id: string) => void;
  isLoading?: boolean;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const getStatusColor = (status: DocumentStatus) => {
  switch (status) {
    case 'pending':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
    case 'approved':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'archived':
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return '';
  }
};

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '-';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

const DocumentsTable: React.FC<DocumentsTableProps> = ({ 
  documents, 
  type,
  onApprove,
  onReject,
  onArchive,
  onRestore,
  onDelete,
  onView,
  onEdit,
  onShare,
  onDownload,
  isLoading = false
}) => {
  const [expandedDocument, setExpandedDocument] = useState<string | null>(null);

  const toggleExpandDocument = (id: string) => {
    setExpandedDocument(expandedDocument === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
        <p className="mt-2 text-sm text-muted-foreground">Carregando documentos...</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="py-10 text-center border rounded-md">
        <p className="text-muted-foreground">Nenhum documento encontrado.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome do Documento</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Tamanho</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <React.Fragment key={document.id}>
              <TableRow className="hover:bg-muted/30">
                <TableCell className="font-medium">{document.name}</TableCell>
                <TableCell>{document.category}</TableCell>
                <TableCell>{document.department}</TableCell>
                <TableCell>
                  <Badge className={cn(getStatusColor(document.status))}>
                    {document.status === 'pending' && 'Pendente'}
                    {document.status === 'approved' && 'Aprovado'}
                    {document.status === 'archived' && 'Arquivado'}
                    {document.status === 'rejected' && 'Rejeitado'}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(document.updatedAt || document.createdAt)}</TableCell>
                <TableCell>{formatFileSize(document.size)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView && onView(document.id)}
                      title="Visualizar"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {type === 'pending' && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onApprove && onApprove(document.id)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          title="Aprovar"
                        >
                          <CheckSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onReject && onReject(document.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Rejeitar"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}

                    {type === 'approved' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onArchive && onArchive(document.id)}
                        title="Arquivar"
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    )}

                    {type === 'archived' && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRestore && onRestore(document.id)}
                          title="Restaurar"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete && onDelete(document.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <span className="sr-only">Mais ações</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onDownload && onDownload(document.id)}>
                          <Download className="mr-2 h-4 w-4" />
                          <span>Download</span>
                        </DropdownMenuItem>
                        {document.status !== 'archived' && (
                          <>
                            <DropdownMenuItem onClick={() => onEdit && onEdit(document.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Editar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onShare && onShare(document.id)}>
                              <Share2 className="mr-2 h-4 w-4" />
                              <span>Compartilhar</span>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentsTable;
