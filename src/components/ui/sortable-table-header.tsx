
import React from 'react';
import { TableHead } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortableColumn {
  key: string;
  label: string;
}

interface SortableTableHeaderProps extends React.HTMLAttributes<HTMLTableCellElement> {
  column: SortableColumn;
  sortKey: string | null;
  sortDirection: SortDirection;
  onSort: (key: string) => void;
}

export const SortableTableHeader: React.FC<SortableTableHeaderProps> = ({
  column,
  sortKey,
  sortDirection,
  onSort,
  className,
  ...props
}) => {
  const isActive = sortKey === column.key;
  
  const getSortIcon = () => {
    if (!isActive || sortDirection === null) {
      return <ArrowUpDown className="h-4 w-4 ml-1" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  return (
    <TableHead className={cn(className)} {...props}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 px-2 py-0 font-medium flex items-center",
          isActive && "text-primary"
        )}
        onClick={() => onSort(column.key)}
      >
        {column.label}
        {getSortIcon()}
      </Button>
    </TableHead>
  );
};
