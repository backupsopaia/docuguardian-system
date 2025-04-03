
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CalendarIcon, Search, Tag, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DocumentCategory, Client, DocumentSearchFilters, DocumentStatus } from '../types/documents';
import { format } from 'date-fns';

interface DocumentFiltersProps {
  categories: DocumentCategory[];
  clients: Client[];
  onFilterChange: (filters: DocumentSearchFilters) => void;
  className?: string;
}

const statusOptions: { value: DocumentStatus; label: string; }[] = [
  { value: 'draft', label: 'Rascunho' },
  { value: 'pending', label: 'Pendente' },
  { value: 'approved', label: 'Aprovado' },
  { value: 'rejected', label: 'Rejeitado' },
  { value: 'archived', label: 'Arquivado' }
];

const DocumentFilters: React.FC<DocumentFiltersProps> = ({
  categories,
  clients,
  onFilterChange,
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<DocumentStatus | ''>('');
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  
  // Efeito para notificar mudanças nos filtros
  useEffect(() => {
    const filters: DocumentSearchFilters = {};
    
    if (searchQuery) filters.query = searchQuery;
    if (selectedCategory) filters.categoryIds = [selectedCategory];
    if (selectedClient) filters.clientIds = [selectedClient];
    if (selectedStatus) filters.status = [selectedStatus];
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;
    if (tags.length > 0) filters.tags = tags;
    
    onFilterChange(filters);
  }, [searchQuery, selectedCategory, selectedClient, selectedStatus, dateFrom, dateTo, tags, onFilterChange]);

  // Manipuladores para adicionar/remover tags
  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim().toLowerCase())) {
      setTags([...tags, currentTag.trim().toLowerCase()]);
      setCurrentTag('');
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Limpar todos os filtros
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedClient('');
    setSelectedStatus('');
    setDateFrom(null);
    setDateTo(null);
    setTags([]);
    onFilterChange({});
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        {/* Busca */}
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar documentos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-4"
          />
        </div>
        
        {/* Botão de limpar */}
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="sm:ml-auto"
        >
          <X className="h-4 w-4 mr-2" />
          Limpar filtros
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {/* Categoria */}
        <div className="w-full sm:w-auto">
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Cliente */}
        <div className="w-full sm:w-auto">
          <Select
            value={selectedClient}
            onValueChange={setSelectedClient}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os clientes</SelectItem>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Status */}
        <div className="w-full sm:w-auto">
          <Select
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value as DocumentStatus | '')}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os status</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Data de início */}
        <div className="w-full sm:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-[180px] justify-start text-left font-normal",
                  !dateFrom && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Data inicial"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={setDateFrom}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Data de fim */}
        <div className="w-full sm:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-[180px] justify-start text-left font-normal",
                  !dateTo && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, "dd/MM/yyyy") : "Data final"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={setDateTo}
                initialFocus
                disabled={(date) => dateFrom ? date < dateFrom : false}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-grow flex items-center">
          <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
          <Input
            placeholder="Adicionar tag..."
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={handleTagKeyDown}
            className="flex-grow"
          />
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleAddTag}
            className="ml-2"
          >
            Adicionar
          </Button>
        </div>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="px-2 py-1">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentFilters;
