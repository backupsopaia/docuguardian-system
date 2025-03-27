
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody
} from '@/components/ui/table';
import { DocumentTableRow } from './DocumentTableRow';
import { DocumentEmptyState } from './DocumentEmptyState';

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
  if (isLoading || documents.length === 0) {
    return <DocumentEmptyState isLoading={isLoading} />;
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
            <DocumentTableRow
              key={document.id}
              document={document}
              type={type}
              onApprove={onApprove}
              onReject={onReject}
              onArchive={onArchive}
              onRestore={onRestore}
              onDelete={onDelete}
              onView={onView}
              onEdit={onEdit}
              onShare={onShare}
              onDownload={onDownload}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentsTable;
