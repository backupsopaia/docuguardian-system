
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/modules/auth';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from './Sidebar';
import Header from './Header';

export const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Get initial collapsed state from localStorage
  useEffect(() => {
    const storedState = localStorage.getItem('sidebar-collapsed');
    if (storedState !== null) {
      setSidebarOpen(storedState !== 'true');
    }
  }, []);
  
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
    }
  }, [location.pathname, isMobile]);
  
  if (!user) return null;
  
  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    // Save collapsed state to localStorage
    localStorage.setItem('sidebar-collapsed', newState ? 'false' : 'true');
  };
  
  return (
    <div className="min-h-screen flex bg-background overflow-hidden">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        isMobile={isMobile} 
        toggleSidebar={toggleSidebar} 
      />
      
      <div className={`flex-1 flex flex-col min-h-screen w-full overflow-hidden transition-all duration-300 ${sidebarOpen ? 'md:ml-0' : 'md:ml-0'}`}>
        <Header 
          isScrolled={isScrolled} 
          isMobile={isMobile} 
          toggleSidebar={toggleSidebar} 
          sidebarOpen={sidebarOpen}
        />
        
        <main className="flex-1 overflow-auto p-4 sm:p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
