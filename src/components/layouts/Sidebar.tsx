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
  Box
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
      label: "Usuários e Departamentos",
      to: "/admin/users",
      active: currentPath.startsWith('/admin/users'),
      badge: 24
    },
    {
      icon: ShieldCheck,
      label: "Segurança",
      to: "/admin/security",
      active: currentPath.startsWith('/admin/security')
    },
    {
      icon: FolderOpen,
      label: "Departamentos",
      to: "/admin/departments",
      active: currentPath.startsWith('/admin/departments')
    },
    {
      icon: HistoryIcon,
      label: "Logs de Auditoria",
      to: "/admin/audit",
      active: currentPath.startsWith('/admin/audit')
    },
    {
      icon: CloudIcon,
      label: "Armazenamento",
      to: "/admin/storage",
      active: currentPath.startsWith('/admin/storage')
    },
    {
      icon: PieChartIcon,
      label: "Relatórios",
      to: "/admin/reports",
      active: currentPath.startsWith('/admin/reports')
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
                {isAdmin ? 'Administração' : 'Menu Principal'}
              </h3>
              <div className="mt-2 space-y-1">
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
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
