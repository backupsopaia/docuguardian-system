
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, Calendar, Filter } from 'lucide-react';

// Mock data for audit logs
const AUDIT_LOGS = [
  { 
    id: 'LOG123456',
    timestamp: '2023-09-01T14:30:25Z',
    user: 'admin@example.com',
    action: 'login',
    resource: 'system',
    details: 'Login successful',
    ipAddress: '192.168.1.1',
    status: 'success'
  },
  { 
    id: 'LOG123457',
    timestamp: '2023-09-01T15:22:10Z',
    user: 'john.doe@example.com',
    action: 'document_view',
    resource: 'DOC-2023-001',
    details: 'Viewed document: Política de Segurança da Informação',
    ipAddress: '192.168.1.45',
    status: 'success'
  },
  { 
    id: 'LOG123458',
    timestamp: '2023-09-01T16:15:42Z',
    user: 'jane.smith@example.com',
    action: 'document_upload',
    resource: 'DOC-2023-010',
    details: 'Uploaded new document: Proposta Comercial - Projeto X',
    ipAddress: '192.168.1.78',
    status: 'success'
  },
  { 
    id: 'LOG123459',
    timestamp: '2023-09-01T17:05:33Z',
    user: 'unknown',
    action: 'login_attempt',
    resource: 'system',
    details: 'Failed login attempt for user: admin@example.com',
    ipAddress: '45.67.89.123',
    status: 'failed'
  },
  { 
    id: 'LOG123460',
    timestamp: '2023-09-01T18:30:12Z',
    user: 'admin@example.com',
    action: 'user_update',
    resource: 'john.doe@example.com',
    details: 'Updated user permissions',
    ipAddress: '192.168.1.1',
    status: 'success'
  },
  { 
    id: 'LOG123461',
    timestamp: '2023-09-02T09:15:27Z',
    user: 'john.doe@example.com',
    action: 'document_download',
    resource: 'DOC-2023-005',
    details: 'Downloaded document: Guia de Identidade Visual',
    ipAddress: '192.168.1.45',
    status: 'success'
  },
  { 
    id: 'LOG123462',
    timestamp: '2023-09-02T10:22:18Z',
    user: 'jane.smith@example.com',
    action: 'document_update',
    resource: 'DOC-2023-003',
    details: 'Updated document: Relatório Financeiro Q2',
    ipAddress: '192.168.1.78',
    status: 'success'
  },
  { 
    id: 'LOG123463',
    timestamp: '2023-09-02T11:05:55Z',
    user: 'admin@example.com',
    action: 'permission_change',
    resource: 'system',
    details: 'Modified role permissions for: Marketing',
    ipAddress: '192.168.1.1',
    status: 'success'
  },
  { 
    id: 'LOG123464',
    timestamp: '2023-09-02T12:33:40Z',
    user: 'unknown',
    action: 'access_attempt',
    resource: 'DOC-2023-004',
    details: 'Unauthorized access attempt to restricted document',
    ipAddress: '78.90.123.45',
    status: 'denied'
  },
  { 
    id: 'LOG123465',
    timestamp: '2023-09-02T14:27:12Z',
    user: 'john.doe@example.com',
    action: 'document_share',
    resource: 'DOC-2023-006',
    details: 'Shared document with: marketing@example.com',
    ipAddress: '192.168.1.45',
    status: 'success'
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'success':
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Sucesso</Badge>;
    case 'failed':
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Falha</Badge>;
    case 'denied':
      return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">Negado</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getActionLabel = (action: string) => {
  switch (action) {
    case 'login':
      return 'Login';
    case 'login_attempt':
      return 'Tentativa de Login';
    case 'document_view':
      return 'Visualização de Documento';
    case 'document_upload':
      return 'Upload de Documento';
    case 'document_download':
      return 'Download de Documento';
    case 'document_update':
      return 'Atualização de Documento';
    case 'document_share':
      return 'Compartilhamento de Documento';
    case 'user_update':
      return 'Atualização de Usuário';
    case 'permission_change':
      return 'Alteração de Permissão';
    case 'access_attempt':
      return 'Tentativa de Acesso';
    default:
      return action;
  }
};

const AuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const filteredLogs = AUDIT_LOGS.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesAction = actionFilter ? log.action === actionFilter : true;
    const matchesStatus = statusFilter ? log.status === statusFilter : true;
    
    return matchesSearch && matchesAction && matchesStatus;
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Logs de Auditoria</CardTitle>
        <CardDescription>Registros detalhados de atividades de segurança no sistema</CardDescription>
        
        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por usuário, recurso ou IP..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas ações</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="login_attempt">Tentativa de Login</SelectItem>
                <SelectItem value="document_view">Visualização</SelectItem>
                <SelectItem value="document_upload">Upload</SelectItem>
                <SelectItem value="document_download">Download</SelectItem>
                <SelectItem value="document_update">Atualização</SelectItem>
                <SelectItem value="document_share">Compartilhamento</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos status</SelectItem>
                <SelectItem value="success">Sucesso</SelectItem>
                <SelectItem value="failed">Falha</SelectItem>
                <SelectItem value="denied">Negado</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Período
            </Button>
            
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Recurso</TableHead>
                <TableHead>Detalhes</TableHead>
                <TableHead>Endereço IP</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">{formatDate(log.timestamp)}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{getActionLabel(log.action)}</TableCell>
                  <TableCell>{log.resource}</TableCell>
                  <TableCell className="max-w-md truncate">{log.details}</TableCell>
                  <TableCell className="font-mono text-xs">{log.ipAddress}</TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditLogs;
