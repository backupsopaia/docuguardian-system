
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/modules/auth';
import {
  Home,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  FolderOpen,
  PieChart,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Logo from '@/components/Logo';

const MobileNavigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  if (!user) return null;
  
  const isAdmin = user.role === 'admin';
  const currentPath = location.pathname;
  
  const MenuItems = () => {
    if (isAdmin) {
      return (
        <div className="grid grid-cols-4 gap-4 p-4">
          <NavigationButton 
            icon={Home} 
            label="Home" 
            onClick={() => navigate('/admin/dashboard')}
            active={currentPath === '/admin/dashboard'}
          />
          <NavigationButton 
            icon={FileText} 
            label="Documentos" 
            onClick={() => navigate('/admin/documents')}
            active={currentPath.startsWith('/admin/documents')}
          />
          <NavigationButton 
            icon={Users} 
            label="Usuários" 
            onClick={() => navigate('/admin/users')}
            active={currentPath === '/admin/users'}
            badge={24}
          />
          <NavigationButton 
            icon={PieChart} 
            label="Relatórios" 
            onClick={() => navigate('/admin/reports')}
            active={currentPath === '/admin/reports'}
          />
          <NavigationButton 
            icon={Bell} 
            label="Notificações" 
            onClick={() => navigate('/admin/notifications')}
            active={currentPath === '/admin/notifications'}
            badge={3}
          />
          <NavigationButton 
            icon={FolderOpen} 
            label="Departamentos" 
            onClick={() => navigate('/admin/departments')}
            active={currentPath === '/admin/departments'}
          />
          <NavigationButton 
            icon={Settings} 
            label="Configurações" 
            onClick={() => navigate('/admin/settings')}
            active={currentPath === '/admin/settings'}
          />
          <NavigationButton 
            icon={LogOut} 
            label="Sair" 
            onClick={logout}
          />
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-4 gap-4 p-4">
        <NavigationButton 
          icon={Home} 
          label="Home" 
          onClick={() => navigate('/dashboard')}
          active={currentPath === '/dashboard'}
        />
        <NavigationButton 
          icon={FileText} 
          label="Documentos" 
          onClick={() => navigate('/documents')}
          active={currentPath.startsWith('/documents')}
        />
        <NavigationButton 
          icon={FolderOpen} 
          label="Compartilhados" 
          onClick={() => navigate('/shared')}
          active={currentPath.startsWith('/shared')}
        />
        <NavigationButton 
          icon={Bell} 
          label="Notificações" 
          onClick={() => navigate('/notifications')}
          active={currentPath === '/notifications'}
          badge={3}
        />
        <NavigationButton 
          icon={PieChart} 
          label="Relatórios" 
          onClick={() => navigate('/reports')}
          active={currentPath === '/reports'}
        />
        <NavigationButton 
          icon={Settings} 
          label="Configurações" 
          onClick={() => navigate('/settings')}
          active={currentPath === '/settings'}
        />
        <NavigationButton 
          icon={LogOut} 
          label="Sair" 
          onClick={logout}
        />
      </div>
    );
  };
  
  // Botões principais de navegação na barra inferior
  const mainNavigationItems = isAdmin 
    ? [
        { icon: Home, label: "Home", to: "/admin/dashboard", active: currentPath === '/admin/dashboard' },
        { icon: FileText, label: "Docs", to: "/admin/documents", active: currentPath.startsWith('/admin/documents') },
        { icon: Users, label: "Usuários", to: "/admin/users", active: currentPath === '/admin/users', badge: 24 },
        { icon: Settings, label: "Mais", isMenu: true }
      ]
    : [
        { icon: Home, label: "Home", to: "/dashboard", active: currentPath === '/dashboard' },
        { icon: FileText, label: "Docs", to: "/documents", active: currentPath.startsWith('/documents') },
        { icon: FolderOpen, label: "Comp.", to: "/shared", active: currentPath.startsWith('/shared') },
        { icon: Menu, label: "Mais", isMenu: true }
      ];
      
  return (
    <>
      {/* Menu de navegação móvel inferior */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40 flex justify-around items-center py-2 px-2">
        {mainNavigationItems.map((item, index) => (
          item.isMenu ? (
            <Sheet key={index}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center py-2 px-1 rounded-lg h-auto w-full max-w-[80px]"
                >
                  <item.icon className="h-5 w-5 mb-1" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[70vh] rounded-t-xl px-0 py-0">
                <div className="flex justify-between items-center p-4 border-b">
                  <div className="flex items-center">
                    <Logo />
                    <div className="ml-2">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.role === 'admin' ? 'Administrador' : user.department}
                      </p>
                    </div>
                  </div>
                  <Avatar className="h-9 w-9 border">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="overflow-y-auto max-h-[calc(70vh-80px)]">
                  <MenuItems />
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center py-2 px-1 rounded-lg h-auto w-full max-w-[80px] relative ${
                item.active ? 'bg-primary/10 text-primary' : ''
              }`}
              onClick={() => navigate(item.to)}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.label}</span>
              {item.badge && (
                <Badge 
                  variant="default" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
                >
                  {item.badge}
                </Badge>
              )}
            </Button>
          )
        ))}
      </div>
      {/* Espaçamento para compensar a barra de navegação */}
      <div className="h-16" />
    </>
  );
};

// Componente para os botões da grade de navegação
interface NavigationButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  active?: boolean;
  badge?: number;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({ 
  icon: Icon, 
  label, 
  onClick, 
  active = false,
  badge
}) => {
  return (
    <Button
      variant="ghost"
      className={`flex flex-col items-center justify-center h-24 w-full rounded-lg relative ${
        active ? 'bg-primary/10 text-primary' : ''
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <Icon className="h-7 w-7 mb-2" />
        {badge && (
          <Badge 
            variant="default" 
            className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
          >
            {badge}
          </Badge>
        )}
      </div>
      <span className="text-xs text-center">{label}</span>
    </Button>
  );
};

export default MobileNavigation;
