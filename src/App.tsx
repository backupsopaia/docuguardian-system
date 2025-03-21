
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
      {/* Add other user routes */}
      <Route path="documents" element={<div>My Documents Page</div>} />
      <Route path="shared" element={<div>Shared With Me Page</div>} />
      <Route path="recent" element={<div>Recent Activity Page</div>} />
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
      {/* Add other admin routes */}
      <Route path="documents" element={<div>Admin Documents Page</div>} />
      <Route path="users" element={<div>Users & Roles Page</div>} />
      <Route path="security" element={<div>Security Settings Page</div>} />
      <Route path="departments" element={<div>Departments Page</div>} />
      <Route path="audit" element={<div>Audit Logs Page</div>} />
      <Route path="storage" element={<StoragePage />} />
      <Route path="reports" element={<div>Reports Page</div>} />
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
