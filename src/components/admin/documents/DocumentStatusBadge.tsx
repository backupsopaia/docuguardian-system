
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DocumentStatus } from './DocumentsTable';

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
}

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

const getStatusText = (status: DocumentStatus): string => {
  switch (status) {
    case 'pending':
      return 'Pendente';
    case 'approved':
      return 'Aprovado';
    case 'archived':
      return 'Arquivado';
    case 'rejected':
      return 'Rejeitado';
    default:
      return '';
  }
};

export const DocumentStatusBadge: React.FC<DocumentStatusBadgeProps> = ({ status }) => {
  return (
    <Badge className={cn(getStatusColor(status))}>
      {getStatusText(status)}
    </Badge>
  );
};
