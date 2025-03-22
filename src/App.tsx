import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./modules/auth";
import { ThemeProvider } from "./context/ThemeContext";

// Pages
import Login from "./pages/Login";
import UserDashboard from "./pages/user/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import StoragePage from "./pages/user/Storage";
import NotFound from "./pages/NotFound";

// Admin components
import UserManagement from "./modules/admin/users/components/UserManagement";

// Layouts
import MainLayout from "./components/layouts/MainLayout";

// Protected route wrapper
const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Auth check to redirect authenticated users
const AuthCheck = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (isAuthenticated) {
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Placeholder component for new routes
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="container py-6">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p className="text-muted-foreground">Esta página está em desenvolvimento.</p>
  </div>
);

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route 
      path="/login" 
      element={
        <AuthCheck>
          <Login />
        </AuthCheck>
      } 
    />
    
    {/* User routes */}
    <Route 
      path="/" 
      element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route path="dashboard" element={<UserDashboard />} />
      
      {/* Document routes */}
      <Route path="documents" element={<div>Meus Documentos</div>} />
      <Route path="documents/pending" element={<PlaceholderPage title="Documentos Pendentes" />} />
      <Route path="documents/recent" element={<PlaceholderPage title="Documentos Recentes" />} />
      
      {/* Other user routes */}
      <Route path="shared" element={<div>Compartilhados Comigo</div>} />
      <Route path="recent" element={<div>Atividade Recente</div>} />
      <Route path="storage" element={<StoragePage />} />
    </Route>
    
    {/* Admin routes */}
    <Route 
      path="/admin" 
      element={
        <ProtectedRoute adminOnly>
          <MainLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      
      {/* Document management */}
      <Route path="documents" element={<PlaceholderPage title="Todos os Documentos" />} />
      <Route path="documents/pending" element={<PlaceholderPage title="Documentos Pendentes" />} />
      <Route path="documents/approved" element={<PlaceholderPage title="Documentos Aprovados" />} />
      <Route path="documents/archived" element={<PlaceholderPage title="Documentos Arquivados" />} />
      
      {/* BPM */}
      <Route path="bpm/workflows" element={<PlaceholderPage title="Fluxos de Trabalho" />} />
      <Route path="bpm/active" element={<PlaceholderPage title="Processos Ativos" />} />
      <Route path="bpm/modeling" element={<PlaceholderPage title="Modelagem de Processos" />} />
      
      {/* Risk Management */}
      <Route path="risks/matrix" element={<PlaceholderPage title="Matriz de Riscos" />} />
      <Route path="risks/controls" element={<PlaceholderPage title="Controles de Riscos" />} />
      <Route path="risks/incidents" element={<PlaceholderPage title="Incidentes" />} />
      
      {/* Performance Management */}
      <Route path="performance/kpis" element={<PlaceholderPage title="KPIs" />} />
      <Route path="performance/goals" element={<PlaceholderPage title="Metas" />} />
      <Route path="performance/dashboards" element={<PlaceholderPage title="Dashboards de Desempenho" />} />
      
      {/* Quality Management */}
      <Route path="quality/standards" element={<PlaceholderPage title="Normas de Qualidade" />} />
      <Route path="quality/audits" element={<PlaceholderPage title="Auditorias" />} />
      <Route path="quality/nonconformities" element={<PlaceholderPage title="Não Conformidades" />} />
      
      {/* Project Management */}
      <Route path="projects/list" element={<PlaceholderPage title="Projetos" />} />
      <Route path="projects/portfolios" element={<PlaceholderPage title="Portfólios" />} />
      <Route path="projects/resources" element={<PlaceholderPage title="Recursos" />} />
      
      {/* Asset Management */}
      <Route path="assets/inventory" element={<PlaceholderPage title="Inventário de Ativos" />} />
      <Route path="assets/maintenance" element={<PlaceholderPage title="Manutenção de Ativos" />} />
      <Route path="assets/lifecycle" element={<PlaceholderPage title="Ciclo de Vida de Ativos" />} />
      
      {/* User and other admin routes */}
      <Route path="users" element={<UserManagement />} />
      <Route path="security" element={<div>Configurações de Segurança</div>} />
      <Route path="departments" element={<div>Departamentos</div>} />
      <Route path="audit" element={<div>Logs de Auditoria</div>} />
      <Route path="storage" element={<StoragePage />} />
      <Route path="reports" element={<div>Relatórios</div>} />
    </Route>
    
    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <AppRoutes />
            <Toaster />
            <Sonner />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
