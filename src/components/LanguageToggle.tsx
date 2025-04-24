import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authService } from '@/services/auth.service';
import { useAuth } from '@/contexts/AuthContext';

type Language = 'en' | 'es';

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className = '' }: LanguageToggleProps) {
  const { user } = useAuth();
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Get language from auth service
    const currentLanguage = authService.getUserLanguage() as Language;
    setLanguage(currentLanguage);
    document.documentElement.setAttribute('lang', currentLanguage);
  }, []);

  const changeLanguage = async (lang: Language) => {
    setLanguage(lang);

    // Update language in both localStorage and database if user is logged in
    if (user) {
      await authService.setUserLanguage(lang, user.id);
    } else {
      // Just update localStorage if not logged in
      await authService.setUserLanguage(lang);
    }

    // In a real app, this would trigger translations to be loaded
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={`rounded-full h-9 w-9 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-300 ${className}`}
        >
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => changeLanguage('en')}
          className={language === 'en' ? 'bg-primary/10 text-primary' : ''}
        >
          <span className="mr-2">🇺🇸</span> English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage('es')}
          className={language === 'es' ? 'bg-primary/10 text-primary' : ''}
        >
          <span className="mr-2">🇲🇽</span> Español
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
