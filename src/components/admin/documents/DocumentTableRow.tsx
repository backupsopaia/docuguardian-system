
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { DocumentStatusBadge } from './DocumentStatusBadge';
import { DocumentTableActions } from './DocumentTableActions';
import { Document } from './DocumentsTable';

interface DocumentTableRowProps {
  document: Document;
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

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '-';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

export const DocumentTableRow: React.FC<DocumentTableRowProps> = ({
  document,
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
}) => {
  return (
    <TableRow className="hover:bg-muted/30">
      <TableCell className="font-medium">{document.name}</TableCell>
      <TableCell>{document.category}</TableCell>
      <TableCell>{document.department}</TableCell>
      <TableCell>
        <DocumentStatusBadge status={document.status} />
      </TableCell>
      <TableCell>{formatDate(document.updatedAt || document.createdAt)}</TableCell>
      <TableCell>{formatFileSize(document.size)}</TableCell>
      <TableCell className="text-right">
        <DocumentTableActions
          documentId={document.id}
          type={type}
          documentStatus={document.status}
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
      </TableCell>
    </TableRow>
  );
};
