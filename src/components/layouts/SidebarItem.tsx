
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  active?: boolean;
  onClick?: () => void;
  badge?: string | number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  to, 
  active = false, 
  onClick,
  badge
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(to);
    if (onClick) onClick();
  };
  
  return (
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
};

export default SidebarItem;
