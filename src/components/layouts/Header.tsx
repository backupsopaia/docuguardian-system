
import React from 'react';
import { 
  BellIcon, 
  Search, 
  Settings, 
  MenuIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isScrolled: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ isScrolled, isMobile, toggleSidebar }) => {
  return (
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
  );
};

export default Header;
