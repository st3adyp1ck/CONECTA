import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Info, MapPin, Coffee, Mountain } from "lucide-react";

export function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Card className="relative overflow-hidden border-primary/20 shadow-soft bg-gradient-to-r from-background via-background/95 to-background animate-fade-in">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary"></div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 h-7 w-7 rounded-full hover:bg-background/80"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-4 w-4" />
      </Button>
      <CardContent className="p-4 pt-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Info className="h-8 w-8 md:h-10 md:w-10 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg md:text-xl font-serif font-bold mb-1">Welcome to San Cristobal de las Casas</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Discover the magic of this colonial city nestled in the highlands of Chiapas. CONECTA helps you navigate the cobblestone streets, find authentic experiences, and connect with local culture.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center text-xs bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full border border-border/50">
                <MapPin className="h-3 w-3 mr-1 text-secondary" />
                <span>Elevation: 2,200m</span>
              </div>
              <div className="flex items-center text-xs bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full border border-border/50">
                <Coffee className="h-3 w-3 mr-1 text-secondary" />
                <span>Famous for: Coffee, Amber, Textiles</span>
              </div>
              <div className="flex items-center text-xs bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full border border-border/50">
                <Mountain className="h-3 w-3 mr-1 text-secondary" />
                <span>Indigenous cultures: Tzotzil, Tzeltal</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
