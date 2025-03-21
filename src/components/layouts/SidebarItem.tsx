
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  active?: boolean;
  onClick?: () => void;
  badge?: string | number;
  tooltip?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  to, 
  active = false, 
  onClick,
  badge,
  tooltip
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(to);
    if (onClick) onClick();
  };
  
  const buttonContent = (
    <button
      className={`dms-sidebar-item ${active ? 'dms-sidebar-item-active' : ''}`}
      onClick={handleClick}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
      {badge && (
        <Badge variant="outline" className="ml-auto bg-sidebar-primary text-sidebar-primary-foreground text-xs">
          {badge}
        </Badge>
      )}
    </button>
  );
  
  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {buttonContent}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return buttonContent;
};

export default SidebarItem;
