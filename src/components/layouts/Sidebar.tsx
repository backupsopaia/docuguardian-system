
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/modules/auth';
import { useTheme } from '@/context/ThemeContext';
import { 
  FileText, 
  FolderOpen, 
  Users, 
  ShieldCheck, 
  Home, 
  CloudIcon, 
  HistoryIcon, 
  PieChartIcon,
  XIcon,
  SunIcon,
  MoonIcon,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Logo from '@/components/Logo';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import SidebarItem from './SidebarItem';

interface SidebarProps {
  sidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, isMobile, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  
  if (!user) return null;
  
  const isAdmin = user.role === 'admin';
  const currentPath = location.pathname;
  
  const toggleTheme = () => {
    localStorage.setItem("dms-theme-manual", "true");
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <>
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
                      onClick={() => isMobile && toggleSidebar()}
                    />
                    <SidebarItem 
                      icon={FileText} 
                      label="Documents" 
                      to="/admin/documents" 
                      active={currentPath.startsWith('/admin/documents')}
                      onClick={() => isMobile && toggleSidebar()}
                      badge={24}
                    />
                    <SidebarItem 
                      icon={Users} 
                      label="Users & Roles" 
                      to="/admin/users" 
                      active={currentPath.startsWith('/admin/users')}
                      onClick={() => isMobile && toggleSidebar()}
                    />
                    <SidebarItem 
                      icon={ShieldCheck} 
                      label="Security" 
                      to="/admin/security" 
                      active={currentPath.startsWith('/admin/security')}
                      onClick={() => isMobile && toggleSidebar()}
                    />
                    <SidebarItem 
                      icon={FolderOpen} 
                      label="Departments" 
                      to="/admin/departments" 
                      active={currentPath.startsWith('/admin/departments')}
                      onClick={() => isMobile && toggleSidebar()}
                    />
                    <SidebarItem 
                      icon={HistoryIcon} 
                      label="Audit Logs" 
                      to="/admin/audit" 
                      active={currentPath.startsWith('/admin/audit')}
                      onClick={() => isMobile && toggleSidebar()}
                    />
                    <SidebarItem 
                      icon={CloudIcon} 
                      label="Storage" 
                      to="/admin/storage" 
                      active={currentPath.startsWith('/admin/storage')}
                      onClick={() => isMobile && toggleSidebar()}
                    />
                    <SidebarItem 
                      icon={PieChartIcon} 
                      label="Reports" 
                      to="/admin/reports" 
                      active={currentPath.startsWith('/admin/reports')}
                      onClick={() => isMobile && toggleSidebar()}
                    />
                  </>
                ) : (
                  <>
                    <SidebarItem 
                      icon={Home} 
                      label="Dashboard" 
                      to="/dashboard" 
                      active={currentPath === '/dashboard'}
                      onClick={() => isMobile && toggleSidebar()}
                    />
                    <SidebarItem 
                      icon={FileText} 
                      label="My Documents" 
                      to="/documents" 
                      active={currentPath.startsWith('/documents')}
                      onClick={() => isMobile && toggleSidebar()}
                      badge={5}
                    />
                    <SidebarItem 
                      icon={FolderOpen} 
                      label="Shared With Me" 
                      to="/shared" 
                      active={currentPath.startsWith('/shared')}
                      onClick={() => isMobile && toggleSidebar()}
                    />
                    <SidebarItem 
                      icon={HistoryIcon} 
                      label="Recent Activity" 
                      to="/recent" 
                      active={currentPath.startsWith('/recent')}
                      onClick={() => isMobile && toggleSidebar()}
                    />
                    <SidebarItem 
                      icon={CloudIcon} 
                      label="Cloud Storage" 
                      to="/storage" 
                      active={currentPath.startsWith('/storage')}
                      onClick={() => isMobile && toggleSidebar()}
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
    </>
  );
};

export default Sidebar;
