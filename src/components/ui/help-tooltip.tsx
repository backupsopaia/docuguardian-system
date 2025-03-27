
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useHelp } from '@/context/HelpContext';

interface HelpTooltipProps {
  helpId: string;
  children?: React.ReactNode;
  text?: string;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

export function HelpTooltip({ helpId, children, text, side = "right", className }: HelpTooltipProps) {
  const { showContextHelp } = useHelp();
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    showContextHelp(helpId);
  };
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild onClick={handleClick}>
          <span className={`inline-flex cursor-help ${className}`}>
            {children || <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-blue-500" />}
          </span>
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs">
          <p className="text-sm">{text || "Clique para mais informações"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
