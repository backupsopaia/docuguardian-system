
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDown, Download, FileText, PieChart, BarChart, Table } from 'lucide-react';
import { Table as UITable, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getDocumentReports, exportReport, ExportRequest, ReportParams } from '@/modules/admin/documents/api/reportsService';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

type ReportFilter = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  status: string;
  category: string;
  department: string;
  view: 'table' | 'bar' | 'pie';
};

type ReportData = {
  summary: {
    total: number;
    byStatus: { name: string; value: number; fill: string }[];
    byCategory: { name: string; value: number; fill: string }[];
    byDepartment: { name: string; value: number; fill: string }[];
  };
  details: {
    id: string;
    name: string;
    category: string;
    status: string;
    department: string;
    createdAt: string;
    createdBy: string;
  }[];
};

const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#22C55E', '#EAB308', '#6366F1'];

const chartConfig = {
  approved: { color: "#22C55E" },
  pending: { color: "#EAB308" },
  rejected: { color: "#EF4444" },
  archived: { color: "#6B7280" },
  "Políticas": { color: "#8B5CF6" },
  "Manuais": { color: "#D946EF" },
  "Relatórios": { color: "#F97316" },
  "Contratos": { color: "#0EA5E9" },
  "Guias": { color: "#22C55E" },
  "Planos": { color: "#EAB308" },
  "Procedimentos": { color: "#6366F1" },
  "Propostas": { color: "#6B7280" },
  "TI": { color: "#8B5CF6" },
  "RH": { color: "#D946EF" },
  "Financeiro": { color: "#F97316" },
  "Jurídico": { color: "#0EA5E9" },
  "Marketing": { color: "#22C55E" },
  "Operações": { color: "#EAB308" },
  "Compliance": { color: "#6366F1" },
  "Comercial": { color: "#6B7280" },
};

const ReportsPage = () => {
  const [filter, setFilter] = useState<ReportFilter>({
    startDate: undefined,
    endDate: undefined,
    status: 'all',
    category: 'all',
    department: 'all',
    view: 'table'
  });
  
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const generateReport = async () => {
    try {
      setIsLoading(true);
      // Format dates for API call if they exist
      const params: ReportParams = {
        startDate: filter.startDate ? format(filter.startDate, 'yyyy-MM-dd') : undefined,
        endDate: filter.endDate ? format(filter.endDate, 'yyyy-MM-dd') : undefined,
        status: filter.status !== 'all' ? filter.status : undefined,
        category: filter.category !== 'all' ? filter.category : undefined,
        department: filter.department !== 'all' ? filter.department : undefined
      };
      
      const data = await getDocumentReports(params);
      setReportData(data);
      
      toast({
        title: "Relatório gerado com sucesso",
        description: `Total de ${data.details.length} documentos encontrados`,
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar relatório",
        description: "Não foi possível gerar o relatório. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExport = async (formatType: 'pdf' | 'excel') => {
    if (!reportData) return;
    
    try {
      setIsLoading(true);
      
      const exportRequest: ExportRequest = {
        format: formatType,
        data: reportData,
        filters: {
          startDate: filter.startDate ? format(filter.startDate, 'yyyy-MM-dd') : undefined,
          endDate: filter.endDate ? format(filter.endDate, 'yyyy-MM-dd') : undefined,
          status: filter.status,
          category: filter.category,
          department: filter.department
        }
      };
      
      const result = await exportReport(exportRequest);
      
      toast({
        title: "Exportação iniciada",
        description: `O relatório está sendo exportado para ${formatType.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: `Não foi possível exportar para ${formatType.toUpperCase()}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatórios de Documentos</h1>
        <p className="text-muted-foreground">
          Gere relatórios personalizados sobre os documentos do sistema.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Filtros do Relatório</CardTitle>
          <CardDescription>
            Defina os parâmetros para gerar seu relatório personalizado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Período Inicial</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filter.startDate ? format(filter.startDate, 'dd/MM/yyyy') : 'Selecione uma data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filter.startDate}
                    onSelect={(date) => setFilter({ ...filter, startDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Período Final</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filter.endDate ? format(filter.endDate, 'dd/MM/yyyy') : 'Selecione uma data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filter.endDate}
                    onSelect={(date) => setFilter({ ...filter, endDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filter.status}
                onValueChange={(value) => setFilter({ ...filter, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="approved">Aprovados</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="rejected">Rejeitados</SelectItem>
                  <SelectItem value="archived">Arquivados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Select
                value={filter.category}
                onValueChange={(value) => setFilter({ ...filter, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Políticas">Políticas</SelectItem>
                  <SelectItem value="Manuais">Manuais</SelectItem>
                  <SelectItem value="Relatórios">Relatórios</SelectItem>
                  <SelectItem value="Contratos">Contratos</SelectItem>
                  <SelectItem value="Guias">Guias</SelectItem>
                  <SelectItem value="Planos">Planos</SelectItem>
                  <SelectItem value="Procedimentos">Procedimentos</SelectItem>
                  <SelectItem value="Propostas">Propostas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Departamento</label>
              <Select
                value={filter.department}
                onValueChange={(value) => setFilter({ ...filter, department: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="TI">TI</SelectItem>
                  <SelectItem value="RH">RH</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                  <SelectItem value="Jurídico">Jurídico</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Operações">Operações</SelectItem>
                  <SelectItem value="Compliance">Compliance</SelectItem>
                  <SelectItem value="Comercial">Comercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Visualização</label>
              <Select
                value={filter.view}
                onValueChange={(value) => setFilter({ ...filter, view: value as 'table' | 'bar' | 'pie' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de visualização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="table">Tabela</SelectItem>
                  <SelectItem value="bar">Gráfico de Barras</SelectItem>
                  <SelectItem value="pie">Gráfico de Pizza</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-end gap-3">
            <Button
              onClick={generateReport}
              disabled={isLoading}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Gerar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {reportData && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Resultados</CardTitle>
              <CardDescription>
                Total de {reportData.details.length} documentos encontrados
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => handleExport('pdf')}>
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleExport('excel')}>
                <Download className="mr-2 h-4 w-4" />
                Excel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="result" className="space-y-4">
              <TabsList>
                <TabsTrigger value="result">
                  {filter.view === 'table' ? (
                    <Table className="h-4 w-4 mr-2" />
                  ) : filter.view === 'bar' ? (
                    <BarChart className="h-4 w-4 mr-2" />
                  ) : (
                    <PieChart className="h-4 w-4 mr-2" />
                  )}
                  Resultados
                </TabsTrigger>
                <TabsTrigger value="summary">
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Resumo
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="result">
                {filter.view === 'table' ? (
                  <div className="rounded-md border">
                    <UITable>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Categoria</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Departamento</TableHead>
                          <TableHead>Data de Criação</TableHead>
                          <TableHead>Criado Por</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reportData.details.map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell className="font-medium">{doc.name}</TableCell>
                            <TableCell>{doc.category}</TableCell>
                            <TableCell>{doc.status}</TableCell>
                            <TableCell>{doc.department}</TableCell>
                            <TableCell>{format(new Date(doc.createdAt), 'dd/MM/yyyy')}</TableCell>
                            <TableCell>{doc.createdBy}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </UITable>
                  </div>
                ) : filter.view === 'bar' ? (
                  <div className="h-[400px] w-full py-4">
                    <ChartContainer 
                      className="h-full" 
                      config={chartConfig}
                    >
                      <RechartsBarChart data={reportData.summary.byCategory}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                      </RechartsBarChart>
                    </ChartContainer>
                  </div>
                ) : (
                  <div className="h-[400px] w-full py-4">
                    <ChartContainer 
                      className="h-full"
                      config={chartConfig}
                    >
                      <RechartsPieChart>
                        <Pie
                          data={reportData.summary.byStatus}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {reportData.summary.byStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltipContent />} />
                      </RechartsPieChart>
                    </ChartContainer>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="summary">
                <div className="grid gap-6 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Por Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <ChartContainer 
                          className="h-full"
                          config={chartConfig}
                        >
                          <RechartsPieChart>
                            <Pie
                              data={reportData.summary.byStatus}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {reportData.summary.byStatus.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip content={<ChartTooltipContent />} />
                          </RechartsPieChart>
                        </ChartContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Por Categoria</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <ChartContainer 
                          className="h-full"
                          config={chartConfig}
                        >
                          <RechartsPieChart>
                            <Pie
                              data={reportData.summary.byCategory}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {reportData.summary.byCategory.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip content={<ChartTooltipContent />} />
                          </RechartsPieChart>
                        </ChartContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Por Departamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <ChartContainer 
                          className="h-full"
                          config={chartConfig}
                        >
                          <RechartsPieChart>
                            <Pie
                              data={reportData.summary.byDepartment}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {reportData.summary.byDepartment.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip content={<ChartTooltipContent />} />
                          </RechartsPieChart>
                        </ChartContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportsPage;
