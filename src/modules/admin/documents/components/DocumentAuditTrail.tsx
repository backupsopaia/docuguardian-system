
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Clock, 
  User, 
  Activity,
  Edit,
  Eye,
  Share,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
  Archive,
  RotateCcw,
  FileUp,
  Loader2
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DocumentAuditLog } from '../types/documents';

interface DocumentAuditTrailProps {
  documentId: string;
  auditLogs: DocumentAuditLog[];
  loading: boolean;
}

const getActionIcon = (action: string) => {
  switch (action) {
    case 'create': return <FileUp className="h-4 w-4" />;
    case 'edit': return <Edit className="h-4 w-4" />;
    case 'view': return <Eye className="h-4 w-4" />;
    case 'share': return <Share className="h-4 w-4" />;
    case 'download': return <Download className="h-4 w-4" />;
    case 'delete': return <Trash2 className="h-4 w-4" />;
    case 'approve': return <CheckCircle className="h-4 w-4" />;
    case 'reject': return <XCircle className="h-4 w-4" />;
    case 'archive': return <Archive className="h-4 w-4" />;
    case 'restore': return <RotateCcw className="h-4 w-4" />;
    default: return <Activity className="h-4 w-4" />;
  }
};

const getActionText = (action: string): string => {
  switch (action) {
    case 'create': return 'criou';
    case 'edit': return 'editou';
    case 'view': return 'visualizou';
    case 'share': return 'compartilhou';
    case 'download': return 'baixou';
    case 'delete': return 'excluiu';
    case 'approve': return 'aprovou';
    case 'reject': return 'rejeitou';
    case 'archive': return 'arquivou';
    case 'restore': return 'restaurou';
    default: return action;
  }
};

const getActionColor = (action: string): string => {
  switch (action) {
    case 'create': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
    case 'edit': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
    case 'view': return 'text-gray-500 bg-gray-50 dark:bg-gray-800/30';
    case 'share': return 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20';
    case 'download': return 'text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20';
    case 'delete': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
    case 'approve': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
    case 'reject': return 'text-rose-500 bg-rose-50 dark:bg-rose-900/20';
    case 'archive': return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20';
    case 'restore': return 'text-violet-500 bg-violet-50 dark:bg-violet-900/20';
    default: return 'text-gray-500 bg-gray-50 dark:bg-gray-800/30';
  }
};

const DocumentAuditTrail: React.FC<DocumentAuditTrailProps> = ({
  documentId,
  auditLogs,
  loading
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Trilha de Auditoria</h3>
      
      {auditLogs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Activity className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Nenhuma atividade registrada para este documento.</p>
        </div>
      ) : (
        <ScrollArea className="h-[400px] rounded border p-4">
          <div className="relative pl-6 border-l">
            {auditLogs.map((log, index) => {
              const timestamp = new Date(log.timestamp);
              const actionColorClass = getActionColor(log.action);
              
              return (
                <div key={log.id} className="mb-6 relative">
                  {/* Dot on the timeline */}
                  <div className="absolute w-4 h-4 rounded-full -left-[22px] top-1 flex items-center justify-center border border-background">
                    <div className={`w-4 h-4 rounded-full ${actionColorClass} flex items-center justify-center`}>
                      {getActionIcon(log.action)}
                    </div>
                  </div>
                  
                  {/* Action details */}
                  <div className="mb-1">
                    <div className="flex items-center text-sm font-medium">
                      <span>{log.userName}</span>
                      <span className="mx-1 text-muted-foreground">{getActionText(log.action)}</span>
                      <span>este documento</span>
                    </div>
                    
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        {formatDistanceToNow(timestamp, { locale: ptBR, addSuffix: true })}
                      </span>
                      <span className="mx-1">•</span>
                      <span>
                        {timestamp.toLocaleDateString('pt-BR')} às {timestamp.toLocaleTimeString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  
                  {/* Additional details if available */}
                  {log.details && typeof log.details === 'object' && Object.keys(log.details).length > 0 && (
                    <div className="mt-2 text-xs bg-muted/30 p-2 rounded">
                      {Object.entries(log.details).map(([key, value]) => (
                        key !== 'documentId' && (
                          <div key={key} className="flex items-start mb-1 last:mb-0">
                            <span className="font-medium mr-1">{key}:</span>
                            <span className="text-muted-foreground">
                              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </span>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default DocumentAuditTrail;
