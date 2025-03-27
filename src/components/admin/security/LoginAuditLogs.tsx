
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Calendar, Filter, FileDown, UserCog, AlertTriangle, History, LogIn, LogOut } from 'lucide-react';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';

// Mock data for login logs
const LOGIN_LOGS = [
  { 
    id: 'LOG001',
    timestamp: '2023-09-15T08:30:25Z',
    user: 'admin@example.com',
    action: 'login',
    deviceType: 'Desktop',
    browser: 'Chrome',
    os: 'Windows 10',
    ipAddress: '192.168.1.1',
    location: 'São Paulo, Brazil',
    status: 'success'
  },
  { 
    id: 'LOG002',
    timestamp: '2023-09-15T09:22:10Z',
    user: 'john.doe@example.com',
    action: 'login',
    deviceType: 'Mobile',
    browser: 'Safari',
    os: 'iOS 16',
    ipAddress: '192.168.1.45',
    location: 'Rio de Janeiro, Brazil',
    status: 'success'
  },
  { 
    id: 'LOG003',
    timestamp: '2023-09-15T10:15:42Z',
    user: 'jane.smith@example.com',
    action: 'login',
    deviceType: 'Tablet',
    browser: 'Firefox',
    os: 'Android 12',
    ipAddress: '192.168.1.78',
    location: 'Belo Horizonte, Brazil',
    status: 'success'
  },
  { 
    id: 'LOG004',
    timestamp: '2023-09-15T11:05:33Z',
    user: 'admin@example.com',
    action: 'logout',
    deviceType: 'Desktop',
    browser: 'Chrome',
    os: 'Windows 10',
    ipAddress: '192.168.1.1',
    location: 'São Paulo, Brazil',
    status: 'success'
  },
  { 
    id: 'LOG005',
    timestamp: '2023-09-15T12:30:12Z',
    user: 'unknown',
    action: 'login_attempt',
    deviceType: 'Desktop',
    browser: 'Edge',
    os: 'Windows 11',
    ipAddress: '45.67.89.123',
    location: 'Curitiba, Brazil',
    status: 'failed'
  },
  { 
    id: 'LOG006',
    timestamp: '2023-09-16T09:15:27Z',
    user: 'john.doe@example.com',
    action: 'logout',
    deviceType: 'Mobile',
    browser: 'Safari',
    os: 'iOS 16',
    ipAddress: '192.168.1.45',
    location: 'Rio de Janeiro, Brazil',
    status: 'success'
  },
  { 
    id: 'LOG007',
    timestamp: '2023-09-16T10:22:18Z',
    user: 'unknown',
    action: 'login_attempt',
    deviceType: 'Mobile',
    browser: 'Chrome',
    os: 'Android 13',
    ipAddress: '78.90.123.45',
    location: 'Salvador, Brazil',
    status: 'failed'
  },
  { 
    id: 'LOG008',
    timestamp: '2023-09-16T11:05:55Z',
    user: 'jane.smith@example.com',
    action: 'login',
    deviceType: 'Tablet',
    browser: 'Firefox',
    os: 'Android 12',
    ipAddress: '192.168.1.78',
    location: 'Belo Horizonte, Brazil',
    status: 'success'
  },
  { 
    id: 'LOG009',
    timestamp: '2023-09-16T12:33:40Z',
    user: 'jane.smith@example.com',
    action: 'logout',
    deviceType: 'Tablet',
    browser: 'Firefox',
    os: 'Android 12',
    ipAddress: '192.168.1.78',
    location: 'Belo Horizonte, Brazil',
    status: 'success'
  },
  { 
    id: 'LOG010',
    timestamp: '2023-09-16T14:27:12Z',
    user: 'admin@example.com',
    action: 'login',
    deviceType: 'Desktop',
    browser: 'Chrome',
    os: 'macOS Monterey',
    ipAddress: '192.168.1.100',
    location: 'São Paulo, Brazil',
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
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getActionIcon = (action: string) => {
  switch (action) {
    case 'login':
      return <LogIn className="h-4 w-4 text-green-600" />;
    case 'logout':
      return <LogOut className="h-4 w-4 text-blue-600" />;
    case 'login_attempt':
      return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    default:
      return <History className="h-4 w-4" />;
  }
};

const getActionLabel = (action: string) => {
  switch (action) {
    case 'login':
      return 'Login';
    case 'logout':
      return 'Logout';
    case 'login_attempt':
      return 'Tentativa de Login';
    default:
      return action;
  }
};

const LoginAuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  
  const ITEMS_PER_PAGE = 8;
  
  const filteredLogs = LOGIN_LOGS.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.location.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesAction = actionFilter ? log.action === actionFilter : true;
    const matchesStatus = statusFilter ? log.status === statusFilter : true;
    const matchesDevice = deviceFilter ? log.deviceType === deviceFilter : true;
    
    return matchesSearch && matchesAction && matchesStatus && matchesDevice;
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
    const csvHeader = ['ID', 'Timestamp', 'Usuário', 'Ação', 'Dispositivo', 'Navegador', 'Sistema Operacional', 'Endereço IP', 'Localização', 'Status'];
    const csvRows = filteredLogs.map(log => [
      log.id,
      log.timestamp,
      log.user,
      getActionLabel(log.action),
      log.deviceType,
      log.browser,
      log.os,
      log.ipAddress,
      log.location,
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
    link.setAttribute('download', `login-logs-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Exportação concluída",
      description: "Os logs de login foram exportados com sucesso para CSV.",
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

  // For future integration with a real API
  // useEffect(() => {
  //   const fetchLoginLogs = async () => {
  //     try {
  //       // const response = await fetch('/api/login-logs');
  //       // const data = await response.json();
  //       // setLoginLogs(data);
  //     } catch (error) {
  //       console.error('Error fetching login logs:', error);
  //     }
  //   };
  //
  //   fetchLoginLogs();
  // }, []);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog className="h-5 w-5 text-primary" />
          Logs de Autenticação
        </CardTitle>
        <CardDescription>Histórico de atividades de login e logout no sistema</CardDescription>
        
        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por usuário, IP ou localização..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas ações</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
                <SelectItem value="login_attempt">Tentativa</SelectItem>
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
              </SelectContent>
            </Select>
            
            <Select value={deviceFilter} onValueChange={setDeviceFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Dispositivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos dispositivos</SelectItem>
                <SelectItem value="Desktop">Desktop</SelectItem>
                <SelectItem value="Mobile">Mobile</SelectItem>
                <SelectItem value="Tablet">Tablet</SelectItem>
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
                <TableHead className="w-[160px]">Timestamp</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Dispositivo</TableHead>
                <TableHead>Localização</TableHead>
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
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getActionIcon(log.action)}
                        {getActionLabel(log.action)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <div>{log.deviceType}</div>
                        <div className="text-muted-foreground">{log.browser} / {log.os}</div>
                      </div>
                    </TableCell>
                    <TableCell>{log.location}</TableCell>
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

export default LoginAuditLogs;
