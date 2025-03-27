
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, Calendar, Filter, FileDown } from 'lucide-react';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';

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
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  
  const ITEMS_PER_PAGE = 8;
  
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
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
  
  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  // Export logs to CSV
  const exportToCSV = () => {
    // In a real application, this would call an API endpoint
    // For now, we'll create a CSV from the filtered logs
    
    const csvHeader = ['ID', 'Timestamp', 'Usuário', 'Ação', 'Recurso', 'Detalhes', 'Endereço IP', 'Status'];
    const csvRows = filteredLogs.map(log => [
      log.id,
      log.timestamp,
      log.user,
      getActionLabel(log.action),
      log.resource,
      log.details,
      log.ipAddress,
      log.status
    ]);
    
    const csvContent = [
      csvHeader.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Exportação concluída",
      description: "Os logs de auditoria foram exportados com sucesso para CSV.",
    });
  };
  
  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink 
            isActive={1 === currentPage}
            onClick={() => handlePageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      // Show ellipsis if needed
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            isActive={totalPages === currentPage}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };
  
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
            
            <Button onClick={exportToCSV}>
              <FileDown className="h-4 w-4 mr-2" />
              Exportar CSV
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
              {currentItems.length > 0 ? (
                currentItems.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">{formatDate(log.timestamp)}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{getActionLabel(log.action)}</TableCell>
                    <TableCell>{log.resource}</TableCell>
                    <TableCell className="max-w-md truncate">{log.details}</TableCell>
                    <TableCell className="font-mono text-xs">{log.ipAddress}</TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    Nenhum log encontrado com os filtros aplicados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {filteredLogs.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Exibindo {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredLogs.length)} de {filteredLogs.length} logs
              </p>
              
              <Pagination>
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                    </PaginationItem>
                  )}
                  
                  {renderPaginationItems()}
                  
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuditLogs;
