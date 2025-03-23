
import React from 'react';
import { Bell, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/modules/auth';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Sidebar from './Sidebar';

interface HeaderProps {
  isMobile: boolean;
  isScrolled: boolean;
  toggleSidebar: () => void;
  sidebarOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isMobile, isScrolled, toggleSidebar, sidebarOpen }) => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <header 
      className={cn(
        "sticky top-0 z-30 w-full bg-background transition-shadow duration-300",
        isScrolled ? "shadow-md" : "",
        "border-b border-border"
      )}
    >
      <div className="flex h-16 items-center px-4 justify-between">
        <div className="flex items-center space-x-4">
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[80%] max-w-[300px]">
                <Sidebar 
                  sidebarOpen={true} 
                  isMobile={true} 
                  toggleSidebar={() => {}} 
                />
              </SheetContent>
            </Sheet>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="md:flex hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>
          )}
          
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Pesquisar..."
              className="w-full rounded-md pl-8 md:w-[300px] lg:w-[400px] bg-background"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
          </Button>
          
          <Avatar className="h-8 w-8 md:hidden">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
            <AvatarFallback>
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
