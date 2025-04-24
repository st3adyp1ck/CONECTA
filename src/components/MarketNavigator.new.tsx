import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Search } from "lucide-react";

const MarketNavigator = () => {
  return (
    <div className="flex flex-col h-full bg-background rounded-lg overflow-hidden shadow-soft border border-primary/10">
      <div className="p-4 border-b bg-gradient-to-r from-background via-background/95 to-background">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-tight">Mercados Locales</h1>
            <p className="text-muted-foreground">
              Descubre los mercados tradicionales y artesanales de San Cristóbal
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar mercados o vendedores..."
            className="pl-9 bg-background/80 backdrop-blur-sm border-border/50 focus-visible:ring-primary/30 focus-visible:border-primary/30 rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
          <div className="md:col-span-3 flex items-center justify-center">
            <div className="text-center p-6 max-w-md">
              <h3 className="text-2xl font-serif font-bold mb-3">Mercados de San Cristóbal</h3>
              <p className="mb-6 leading-relaxed">
                Descubre los coloridos mercados tradicionales y artesanales de San Cristóbal de las Casas, donde puedes encontrar desde textiles indígenas y ámbar hasta productos orgánicos y café de especialidad.
              </p>
              <Badge className="mx-auto">Próximamente</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketNavigator;
