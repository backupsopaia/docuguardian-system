
import React, { useState, useEffect } from 'react';
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
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(active && submenu ? true : false);
  
  // Reset submenu open state when active state changes
  useEffect(() => {
    if (submenu) {
      setIsSubmenuOpen(active);
    }
  }, [active, submenu]);
  
  const handleClick = () => {
    if (submenu && submenu.length > 0) {
      setIsSubmenuOpen(!isSubmenuOpen);
    } else if (to && to !== '#') {
      navigate(to);
      if (onClick) onClick();
    }
  };
  
  const handleSubmenuItemClick = (submenuTo: string) => {
    if (submenuTo && submenuTo !== '#') {
      navigate(submenuTo);
      if (onClick) onClick();
    }
  };
  
  const buttonContent = (
    <button
      className={`flex items-center w-full py-2 px-3 text-sm rounded-md transition-colors ${
        active ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
      } ${submenu ? 'justify-between' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="truncate">{label}</span>
      </div>
      {badge && (
        <Badge variant="default" className="ml-auto bg-sidebar-primary text-sidebar-primary-foreground text-xs">
          {badge}
        </Badge>
      )}
      {submenu && submenu.length > 0 && (
        <div className="ml-auto pl-1">
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
        <div className="pl-7 mt-1 space-y-1 pb-1">
          {submenu.map((item, index) => (
            <button
              key={index}
              className={`text-sm py-1.5 px-3 w-full text-left rounded-md transition-colors flex items-center ${
                item.active 
                  ? 'bg-sidebar-accent/80 text-sidebar-accent-foreground font-medium' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/30 hover:text-sidebar-accent-foreground'
              }`}
              onClick={() => handleSubmenuItemClick(item.to)}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-current opacity-70 mr-2 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
