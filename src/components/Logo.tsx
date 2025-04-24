import React from 'react';
import { Brain, Network, MapPin } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', withText = true, className = '' }: LogoProps) {
  const sizeMap = {
    sm: {
      container: 'h-8 w-8',
      icon: 'h-4 w-4',
      text: 'text-lg'
    },
    md: {
      container: 'h-10 w-10',
      icon: 'h-5 w-5',
      text: 'text-xl'
    },
    lg: {
      container: 'h-12 w-12',
      icon: 'h-6 w-6',
      text: 'text-2xl'
    },
    xl: {
      container: 'h-16 w-16',
      icon: 'h-8 w-8',
      text: 'text-3xl'
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`relative flex items-center justify-center ${sizeMap[size].container}`}>
        {/* Digital brain with network connections */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Network className={`absolute opacity-40 animate-pulse-glow text-primary/60 ${sizeMap[size].icon} scale-150`} />
        </div>
        <Brain className={`relative z-10 text-primary animate-pulse-glow font-bold ${sizeMap[size].icon}`} />
        <MapPin className={`absolute bottom-0 right-0 text-secondary ${size === 'sm' ? 'h-2 w-2' :
          size === 'md' ? 'h-3 w-3' :
            size === 'lg' ? 'h-4 w-4' :
              'h-5 w-5'
          }`} />
      </div>
      {withText && (
        <div className="flex flex-col">
          <span className={`font-serif font-bold tracking-tight gradient-text ${sizeMap[size].text}`}>
            CONECTA
          </span>
          {size !== 'sm' && (
            <span className="text-xs text-muted-foreground">
              San Cristobal
            </span>
          )}
        </div>
      )}
    </div>
  );
}
