
import React from 'react';

interface DocumentEmptyStateProps {
  isLoading: boolean;
}

export const DocumentEmptyState: React.FC<DocumentEmptyStateProps> = ({ isLoading }) => {
  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
        <p className="mt-2 text-sm text-muted-foreground">Carregando documentos...</p>
      </div>
    );
  }

  return (
    <div className="py-10 text-center border rounded-md">
      <p className="text-muted-foreground">Nenhum documento encontrado.</p>
    </div>
  );
};
