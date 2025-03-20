
import React from 'react';
import { Globe } from 'lucide-react';

interface LogoProps {
  variant?: 'default' | 'small';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ variant = 'default', className }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Globe 
          className={`${variant === 'small' ? 'w-6 h-6' : 'w-8 h-8'} text-white`} 
          strokeWidth={2} 
          fill="rgba(255,255,255,0.1)"
        />
      </div>
      <span className={`font-display font-bold ${variant === 'small' ? 'text-lg' : 'text-2xl'} text-white tracking-wide`}>
        DocuGuardian
      </span>
    </div>
  );
};

export default Logo;
