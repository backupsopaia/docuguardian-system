
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  Download, 
  Eye, 
  Share2, 
  Edit, 
  CheckSquare, 
  X, 
  Archive, 
  RotateCcw, 
  Trash2,
  MoreVertical
} from 'lucide-react';
import { HelpTooltip } from '@/components/ui/help-tooltip';

interface DocumentTableActionsProps {
  documentId: string;
  type: 'all' | 'pending' | 'approved' | 'archived';
  documentStatus: string;
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

export const DocumentTableActions: React.FC<DocumentTableActionsProps> = ({
  documentId,
  type,
  documentStatus,
  onApprove,
  onReject,
  onArchive,
  onRestore,
  onDelete,
  onView,
  onEdit,
  onShare,
  onDownload
}) => {
  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onView && onView(documentId)}
        title="Visualizar"
      >
        <Eye className="h-4 w-4" />
      </Button>

      {type === 'pending' && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onApprove && onApprove(documentId)}
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
            title="Aprovar"
          >
            <CheckSquare className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onReject && onReject(documentId)}
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
          onClick={() => onArchive && onArchive(documentId)}
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
            onClick={() => onRestore && onRestore(documentId)}
            title="Restaurar"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete && onDelete(documentId)}
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
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onDownload && onDownload(documentId)}>
            <Download className="mr-2 h-4 w-4" />
            <span>Download</span>
          </DropdownMenuItem>
          {documentStatus !== 'archived' && (
            <>
              <DropdownMenuItem onClick={() => onEdit && onEdit(documentId)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Editar</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShare && onShare(documentId)}>
                <Share2 className="mr-2 h-4 w-4" />
                <span>Compartilhar</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
