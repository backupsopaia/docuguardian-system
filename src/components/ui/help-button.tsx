
import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { useHelp } from '@/context/HelpContext';

export function HelpButton() {
  const { helpMode, toggleHelpMode } = useHelp();
  
  return (
    <Button
      variant={helpMode ? "secondary" : "ghost"}
      size="icon"
      onClick={toggleHelpMode}
      className={`relative ${helpMode ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200' : ''}`}
      title={helpMode ? "Desativar modo de ajuda" : "Ativar modo de ajuda"}
    >
      <HelpCircle className="h-5 w-5" />
      {helpMode && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
        </span>
      )}
    </Button>
  );
}
