
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarSubmenuItemProps {
  label: string;
  to: string;
  active?: boolean;
  onClick?: () => void;
}

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  active?: boolean;
  onClick?: () => void;
  badge?: string | number;
  tooltip?: string;
  submenu?: SidebarSubmenuItemProps[];
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  to, 
  active = false, 
  onClick,
  badge,
  tooltip,
  submenu
}) => {
  const navigate = useNavigate();
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  
  const handleClick = () => {
    if (submenu && submenu.length > 0) {
      setIsSubmenuOpen(!isSubmenuOpen);
    } else {
      navigate(to);
      if (onClick) onClick();
    }
  };
  
  const handleSubmenuItemClick = (submenuTo: string) => {
    navigate(submenuTo);
    if (onClick) onClick();
  };
  
  const buttonContent = (
    <button
      className={`dms-sidebar-item ${active ? 'dms-sidebar-item-active' : ''} ${submenu ? 'justify-between' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-center">
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </div>
      {badge && (
        <Badge variant="outline" className="ml-auto bg-sidebar-primary text-sidebar-primary-foreground text-xs">
          {badge}
        </Badge>
      )}
      {submenu && submenu.length > 0 && (
        <div className="ml-auto pl-2">
          {isSubmenuOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
      )}
    </button>
  );
  
  return (
    <div className="flex flex-col">
      {tooltip ? (
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
      ) : (
        buttonContent
      )}
      
      {submenu && isSubmenuOpen && (
        <div className="pl-8 mt-1 space-y-1">
          {submenu.map((item, index) => (
            <button
              key={index}
              className={`text-sm py-2 px-2 w-full text-left rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${item.active ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : 'text-sidebar-foreground'}`}
              onClick={() => handleSubmenuItemClick(item.to)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
