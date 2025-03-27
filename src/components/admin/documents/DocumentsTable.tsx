
import React, { useState, useMemo } from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody
} from '@/components/ui/table';
import { DocumentTableRow } from './DocumentTableRow';
import { DocumentEmptyState } from './DocumentEmptyState';
import { SortableTableHeader, SortDirection, SortableColumn } from '@/components/ui/sortable-table-header';

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

const sortableColumns: SortableColumn[] = [
  { key: 'name', label: 'Nome do Documento' },
  { key: 'category', label: 'Categoria' },
  { key: 'department', label: 'Departamento' },
  { key: 'status', label: 'Status' },
  { key: 'updatedAt', label: 'Data' },
  { key: 'size', label: 'Tamanho' }
];

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
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      // Toggle direction or reset
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortKey(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      // New sort key
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedDocuments = useMemo(() => {
    if (!sortKey || !sortDirection) {
      return documents;
    }

    return [...documents].sort((a, b) => {
      // Handle date fields
      if (sortKey === 'updatedAt' || sortKey === 'createdAt') {
        const dateA = new Date(a[sortKey]);
        const dateB = new Date(b[sortKey]);
        return sortDirection === 'asc'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }
      
      // Handle size as a number
      if (sortKey === 'size') {
        const sizeA = a[sortKey] || 0;
        const sizeB = b[sortKey] || 0;
        return sortDirection === 'asc' ? sizeA - sizeB : sizeB - sizeA;
      }
      
      // Handle string fields
      const valueA = String(a[sortKey] || '').toLowerCase();
      const valueB = String(b[sortKey] || '').toLowerCase();
      
      if (sortDirection === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });
  }, [documents, sortKey, sortDirection]);

  if (isLoading || documents.length === 0) {
    return <DocumentEmptyState isLoading={isLoading} />;
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {sortableColumns.map((column) => (
              <SortableTableHeader
                key={column.key}
                column={column}
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            ))}
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDocuments.map((document) => (
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
