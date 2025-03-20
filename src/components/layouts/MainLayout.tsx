import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { 
  BellIcon, 
  FileText, 
  FolderOpen, 
  Search, 
  Settings, 
  LogOut, 
  Users, 
  ShieldCheck, 
  Home, 
  CloudIcon, 
  HistoryIcon, 
  PieChartIcon,
  MenuIcon,
  XIcon,
  SunIcon,
  MoonIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Logo from '@/components/Logo';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

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

export const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [location.pathname, isMobile]);
  
  if (!user) return null;
  
  const isAdmin = user.role === 'admin';
  const currentPath = location.pathname;
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleTheme = () => {
    localStorage.setItem("dms-theme-manual", "true");
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <div className="min-h-screen flex bg-background">
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleSidebar}
        />
      )}
      
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transition-transform duration-300 ease-in-out md:sticky md:top-0 h-full",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "flex-shrink-0"
        )}
      >
        <div className="flex flex-col h-full overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <Logo />
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar}
                className="text-sidebar-foreground md:hidden"
              >
                <XIcon className="h-5 w-5" />
              </Button>
            )}
          </div>
          
          <Separator className="border-sidebar-border" />
          
          <div className="flex-1 py-2 overflow-y-auto">
            <div className="px-3 py-2">
              <h3 className="text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider px-2">
                {isAdmin ? 'Administration' : 'Main Menu'}
              </h3>
              <div className="mt-2 space-y-1">
                {isAdmin ? (
                  <>
                    <SidebarItem 
                      icon={Home} 
                      label="Dashboard" 
                      to="/admin/dashboard" 
                      active={currentPath === '/admin/dashboard'}
                      onClick={() => isMobile && setSidebarOpen(false)}
                    />
                    <SidebarItem 
                      icon={FileText} 
                      label="Documents" 
                      to="/admin/documents" 
                      active={currentPath.startsWith('/admin/documents')}
                      onClick={() => isMobile && setSidebarOpen(false)}
                      badge={24}
                    />
                    <SidebarItem 
                      icon={Users} 
                      label="Users & Roles" 
                      to="/admin/users" 
                      active={currentPath.startsWith('/admin/users')}
                      onClick={() => isMobile && setSidebarOpen(false)}
                    />
                    <SidebarItem 
                      icon={ShieldCheck} 
                      label="Security" 
                      to="/admin/security" 
                      active={currentPath.startsWith('/admin/security')}
                      onClick={() => isMobile && setSidebarOpen(false)}
                    />
                    <SidebarItem 
                      icon={FolderOpen} 
                      label="Departments" 
                      to="/admin/departments" 
                      active={currentPath.startsWith('/admin/departments')}
                      onClick={() => isMobile && setSidebarOpen(false)}
                    />
                    <SidebarItem 
                      icon={HistoryIcon} 
                      label="Audit Logs" 
                      to="/admin/audit" 
                      active={currentPath.startsWith('/admin/audit')}
                      onClick={() => isMobile && setSidebarOpen(false)}
                    />
                    <SidebarItem 
                      icon={CloudIcon} 
                      label="Storage" 
                      to="/admin/storage" 
                      active={currentPath.startsWith('/admin/storage')}
                      onClick={() => isMobile && setSidebarOpen(false)}
                    />
                    <SidebarItem 
                      icon={PieChartIcon} 
                      label="Reports" 
                      to="/admin/reports" 
                      active={currentPath.startsWith('/admin/reports')}
                      onClick={() => isMobile && setSidebarOpen(false)}
                    />
                  </>
                ) : (
                  <>
                    <SidebarItem 
                      icon={Home} 
                      label="Dashboard" 
                      to="/dashboard" 
                      active={currentPath === '/dashboard'}
                      onClick={() => isMobile && setSidebarOpen(false)}
                    />
                    <SidebarItem 
                      icon={FileText} 
                      label="My Documents" 
                      to="/documents" 
                      active={currentPath.startsWith('/documents')}
                      onClick={() => isMobile && setSidebarOpen(false)}
                      badge={5}
                    />
                    <SidebarItem 
                      icon={FolderOpen} 
                      label="Shared With Me" 
                      to="/shared" 
                      active={currentPath.startsWith('/shared')}
                      onClick={() => isMobile && setSidebarOpen(false)}
                    />
                    <SidebarItem 
                      icon={HistoryIcon} 
                      label="Recent Activity" 
                      to="/recent" 
                      active={currentPath.startsWith('/recent')}
                      onClick={() => isMobile && setSidebarOpen(false)}
                    />
                    <SidebarItem 
                      icon={CloudIcon} 
                      label="Cloud Storage" 
                      to="/storage" 
                      active={currentPath.startsWith('/storage')}
                      onClick={() => isMobile && setSidebarOpen(false)}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center space-x-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="w-full text-sidebar-foreground bg-sidebar-accent hover:bg-sidebar-primary"
              >
                {theme === 'light' ? (
                  <MoonIcon className="h-4 w-4 mr-2" />
                ) : (
                  <SunIcon className="h-4 w-4 mr-2" />
                )}
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8 border border-sidebar-border">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                  <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-sidebar-foreground truncate max-w-[100px] sm:max-w-[120px]">
                    {user.name}
                  </p>
                  <p className="text-xs text-sidebar-foreground/70 truncate max-w-[100px] sm:max-w-[120px]">
                    {user.role === 'admin' ? 'Administrator' : user.department}
                  </p>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={logout} 
                    className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sign out</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </aside>
      
      <div className="flex-1 flex flex-col min-h-screen w-full overflow-hidden">
        <header className={cn(
          "h-16 z-30 border-b transition-all duration-200 flex items-center justify-between px-4",
          "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          isScrolled && "sticky top-0 shadow-sm"
        )}>
          <div className="flex items-center space-x-4">
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar}
                className="md:hidden"
              >
                <MenuIcon className="h-5 w-5" />
              </Button>
            )}
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="search"
                placeholder="Search documents..."
                className="pl-10 py-2 pr-4 block w-full rounded-md border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <BellIcon className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-4 sm:p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
