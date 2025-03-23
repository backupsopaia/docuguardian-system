
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
  LogOut,
  Workflow,
  Route,
  Octagon,
  Target,
  Award,
  Briefcase,
  Package2,
  Library,
  Share,
  Gauge,
  CheckCheck,
  KanbanSquare,
  Box,
  Building2,
  ChevronLeft,
  Menu,
  ChevronRight
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

interface SubmenuItem {
  label: string;
  to: string;
  active: boolean;
}

interface MenuItem {
  icon: React.ElementType;
  label: string;
  to: string;
  active: boolean;
  badge?: string | number;
  submenu?: SubmenuItem[];
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
  
  const adminMenuItems: MenuItem[] = [
    {
      icon: Home,
      label: "Dashboard",
      to: "/admin/dashboard",
      active: currentPath === '/admin/dashboard'
    },
    {
      icon: Library,
      label: "Gestão de Documentos",
      to: "#",
      active: currentPath.startsWith('/admin/documents'),
      submenu: [
        {
          label: "Todos os Documentos",
          to: "/admin/documents",
          active: currentPath === '/admin/documents'
        },
        {
          label: "Pendentes",
          to: "/admin/documents/pending",
          active: currentPath === '/admin/documents/pending'
        },
        {
          label: "Aprovados",
          to: "/admin/documents/approved",
          active: currentPath === '/admin/documents/approved'
        },
        {
          label: "Arquivados",
          to: "/admin/documents/archived",
          active: currentPath === '/admin/documents/archived'
        }
      ]
    },
    {
      icon: Workflow,
      label: "Gestão de Processos BPM",
      to: "#",
      active: currentPath.startsWith('/admin/bpm'),
      submenu: [
        {
          label: "Fluxos de Trabalho",
          to: "/admin/bpm/workflows",
          active: currentPath === '/admin/bpm/workflows'
        },
        {
          label: "Processos Ativos",
          to: "/admin/bpm/active",
          active: currentPath === '/admin/bpm/active'
        },
        {
          label: "Modelagem",
          to: "/admin/bpm/modeling",
          active: currentPath === '/admin/bpm/modeling'
        }
      ]
    },
    {
      icon: Octagon,
      label: "Gestão de Riscos (ERM)",
      to: "#",
      active: currentPath.startsWith('/admin/risks'),
      submenu: [
        {
          label: "Matriz de Riscos",
          to: "/admin/risks/matrix",
          active: currentPath === '/admin/risks/matrix'
        },
        {
          label: "Controles",
          to: "/admin/risks/controls",
          active: currentPath === '/admin/risks/controls'
        },
        {
          label: "Incidentes",
          to: "/admin/risks/incidents",
          active: currentPath === '/admin/risks/incidents'
        }
      ]
    },
    {
      icon: Gauge,
      label: "Desempenho Corporativo",
      to: "#",
      active: currentPath.startsWith('/admin/performance'),
      submenu: [
        {
          label: "KPIs",
          to: "/admin/performance/kpis",
          active: currentPath === '/admin/performance/kpis'
        },
        {
          label: "Metas",
          to: "/admin/performance/goals",
          active: currentPath === '/admin/performance/goals'
        },
        {
          label: "Dashboards",
          to: "/admin/performance/dashboards",
          active: currentPath === '/admin/performance/dashboards'
        }
      ]
    },
    {
      icon: CheckCheck,
      label: "Qualidade (EQM)",
      to: "#",
      active: currentPath.startsWith('/admin/quality'),
      submenu: [
        {
          label: "Normas",
          to: "/admin/quality/standards",
          active: currentPath === '/admin/quality/standards'
        },
        {
          label: "Auditorias",
          to: "/admin/quality/audits",
          active: currentPath === '/admin/quality/audits'
        },
        {
          label: "Não Conformidades",
          to: "/admin/quality/nonconformities",
          active: currentPath === '/admin/quality/nonconformities'
        }
      ]
    },
    {
      icon: Briefcase,
      label: "Projetos e Portfólios",
      to: "#",
      active: currentPath.startsWith('/admin/projects'),
      submenu: [
        {
          label: "Projetos",
          to: "/admin/projects/list",
          active: currentPath === '/admin/projects/list'
        },
        {
          label: "Portfólios",
          to: "/admin/projects/portfolios",
          active: currentPath === '/admin/projects/portfolios'
        },
        {
          label: "Recursos",
          to: "/admin/projects/resources",
          active: currentPath === '/admin/projects/resources'
        }
      ]
    },
    {
      icon: Box,
      label: "Ativos (EAM)",
      to: "#",
      active: currentPath.startsWith('/admin/assets'),
      submenu: [
        {
          label: "Inventário",
          to: "/admin/assets/inventory",
          active: currentPath === '/admin/assets/inventory'
        },
        {
          label: "Manutenção",
          to: "/admin/assets/maintenance",
          active: currentPath === '/admin/assets/maintenance'
        },
        {
          label: "Ciclo de Vida",
          to: "/admin/assets/lifecycle",
          active: currentPath === '/admin/assets/lifecycle'
        }
      ]
    },
    {
      icon: Users,
      label: "Usuários",
      to: "/admin/users",
      active: currentPath === '/admin/users',
      badge: 24
    },
    {
      icon: ShieldCheck,
      label: "Segurança",
      to: "/admin/security",
      active: currentPath === '/admin/security'
    },
    {
      icon: Building2,
      label: "Departamentos",
      to: "/admin/departments",
      active: currentPath === '/admin/departments'
    },
    {
      icon: HistoryIcon,
      label: "Logs de Auditoria",
      to: "/admin/audit",
      active: currentPath === '/admin/audit'
    },
    {
      icon: CloudIcon,
      label: "Armazenamento",
      to: "/admin/storage",
      active: currentPath === '/admin/storage'
    },
    {
      icon: PieChartIcon,
      label: "Relatórios",
      to: "/admin/reports",
      active: currentPath === '/admin/reports'
    }
  ];
  
  const userMenuItems: MenuItem[] = [
    {
      icon: Home,
      label: "Dashboard",
      to: "/dashboard",
      active: currentPath === '/dashboard'
    },
    {
      icon: Library,
      label: "Documentos",
      to: "#",
      active: currentPath.startsWith('/documents'),
      submenu: [
        {
          label: "Meus Documentos",
          to: "/documents",
          active: currentPath === '/documents'
        },
        {
          label: "Pendentes",
          to: "/documents/pending",
          active: currentPath === '/documents/pending'
        },
        {
          label: "Recentes",
          to: "/documents/recent",
          active: currentPath === '/documents/recent'
        }
      ]
    },
    {
      icon: FolderOpen,
      label: "Compartilhados Comigo",
      to: "/shared",
      active: currentPath.startsWith('/shared')
    },
    {
      icon: HistoryIcon,
      label: "Atividade Recente",
      to: "/recent",
      active: currentPath.startsWith('/recent')
    },
    {
      icon: CloudIcon,
      label: "Armazenamento em Nuvem",
      to: "/storage",
      active: currentPath.startsWith('/storage')
    }
  ];
  
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
          "fixed inset-y-0 left-0 z-50 bg-sidebar shadow-md transition-all duration-300 ease-in-out md:sticky md:top-0 h-full",
          sidebarOpen ? "w-64" : "w-[70px]",
          "flex-shrink-0 border-r border-sidebar-border"
        )}
      >
        <div className="flex flex-col h-full overflow-hidden">
          <div className={`px-4 py-3 flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
            {sidebarOpen ? (
              <Logo />
            ) : (
              <div className="w-8 h-8 flex items-center justify-center">
                <Logo />
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="text-sidebar-foreground hidden md:flex"
            >
              {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </Button>
            
            {isMobile && sidebarOpen && (
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
          
          <div className="flex-1 py-2 overflow-y-auto scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent">
            {sidebarOpen ? (
              <div className="px-3 py-2">
                <h3 className="text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider px-2 mb-3">
                  {isAdmin ? 'Administração' : 'Menu Principal'}
                </h3>
                <div className="space-y-1">
                  {isAdmin ? (
                    <>
                      {adminMenuItems.map((item, index) => (
                        <SidebarItem 
                          key={index}
                          icon={item.icon} 
                          label={item.label} 
                          to={item.to} 
                          active={item.active}
                          onClick={() => isMobile && toggleSidebar()}
                          badge={item.badge}
                          submenu={item.submenu}
                        />
                      ))}
                    </>
                  ) : (
                    <>
                      {userMenuItems.map((item, index) => (
                        <SidebarItem 
                          key={index}
                          icon={item.icon} 
                          label={item.label} 
                          to={item.to} 
                          active={item.active}
                          onClick={() => isMobile && toggleSidebar()}
                          badge={item.badge}
                          submenu={item.submenu}
                        />
                      ))}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="px-2 py-4">
                <div className="space-y-3 flex flex-col items-center">
                  {isAdmin ? (
                    <>
                      {adminMenuItems.map((item, index) => (
                        <Tooltip key={index}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={item.active ? "default" : "ghost"}
                              size="icon"
                              className={cn(
                                "h-10 w-10 rounded-md",
                                item.active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                              )}
                              onClick={() => {
                                if (!item.submenu) {
                                  location.pathname !== item.to && navigate(item.to);
                                  isMobile && toggleSidebar();
                                }
                              }}
                            >
                              <item.icon className="h-5 w-5" />
                              {item.badge && (
                                <span className="absolute top-0 right-0 h-4 w-4 text-[10px] flex items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                                  {item.badge}
                                </span>
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>{item.label}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </>
                  ) : (
                    <>
                      {userMenuItems.map((item, index) => (
                        <Tooltip key={index}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={item.active ? "default" : "ghost"}
                              size="icon"
                              className={cn(
                                "h-10 w-10 rounded-md",
                                item.active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                              )}
                              onClick={() => {
                                if (!item.submenu) {
                                  location.pathname !== item.to && navigate(item.to);
                                  isMobile && toggleSidebar();
                                }
                              }}
                            >
                              <item.icon className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>{item.label}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className={`p-4 border-t border-sidebar-border bg-sidebar-accent/10 ${sidebarOpen ? '' : 'flex justify-center'}`}>
            {sidebarOpen ? (
              <>
                <div className="flex items-center space-x-2 mb-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleTheme}
                    className="w-full text-sidebar-foreground hover:bg-sidebar-accent"
                  >
                    {theme === 'light' ? (
                      <MoonIcon className="h-4 w-4 mr-2" />
                    ) : (
                      <SunIcon className="h-4 w-4 mr-2" />
                    )}
                    {theme === 'light' ? 'Modo escuro' : 'Modo claro'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-9 w-9 border border-sidebar-border">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                      <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-sidebar-foreground">
                        {user.name}
                      </p>
                      <p className="text-xs text-sidebar-foreground/70">
                        {user.role === 'admin' ? 'Administrador' : user.department}
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
                      <p>Sair</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={toggleTheme}
                      className="text-sidebar-foreground hover:bg-sidebar-accent h-10 w-10"
                    >
                      {theme === 'light' ? (
                        <MoonIcon className="h-5 w-5" />
                      ) : (
                        <SunIcon className="h-5 w-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{theme === 'light' ? 'Modo escuro' : 'Modo claro'}</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="h-9 w-9 border border-sidebar-border cursor-pointer">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                      <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{user.name}</p>
                    <p className="text-xs opacity-75">{user.role === 'admin' ? 'Administrador' : user.department}</p>
                  </TooltipContent>
                </Tooltip>
                
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
                  <TooltipContent side="right">
                    <p>Sair</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
