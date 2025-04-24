import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Search,
  MapPin,
  ShoppingBag,
  Utensils,
  Clock,
  Calendar,
  Share2,
} from "lucide-react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Market, Vendor } from "@/types/database.types";
import { marketService, vendorService } from "@/services/market.service";
import { supabase } from "@/lib/supabase";

// Define the center for San Cristobal de las Casas, Chiapas
const SAN_CRISTOBAL_CENTER = {
  lat: 16.7370,
  lng: -92.6376
};

// Responsive map container style
const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '400px',
};

const MarketNavigatorSimplified = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState("markets");

  // State for markets and vendors
  const [markets, setMarkets] = useState<Market[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [vendorSearchQuery, setVendorSearchQuery] = useState("");
  const [currentVendorIndex, setCurrentVendorIndex] = useState(0);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Load the Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // Get language from localStorage or default to English
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'en';
    }
    return 'en';
  });

  // Translations
  const translations = {
    en: {
      title: "Local Markets",
      subtitle: "Discover the traditional and artisanal markets of San Cristobal",
      searchPlaceholder: "Search city gems...",
      marketsTab: "Markets",
      vendorsTab: "City Gems",
      featuredVendor: "Featured Gem",
      noMarketsFound: "No markets found",
      noVendorsFound: "No city gems found",
      tryAgain: "Try another search or check back later.",
      loading: "Loading...",
      indigenousFilter: "Indigenous",
      sustainableFilter: "Sustainable",
      nextVendor: "Next",
      prevVendor: "Previous",
      rateButton: "Rate",
      shareButton: "Share",
      allCategory: "All",
      naturalOrganicCategory: "Natural & Organic",
      apparelCategory: "Apparel & Accessories",
      diningCategory: "Dining & Cafés",
      healthCategory: "Health & Wellness",
      digitalNomadCategory: "Digital Nomad Spaces",
      culturalCategory: "Cultural Experiences",
      sustainableCategory: "Sustainable Living",
      artisanCategory: "Artisan Crafts",
    },
    es: {
      title: "Mercados Locales",
      subtitle: "Descubre los mercados tradicionales y artesanales de San Cristóbal",
      searchPlaceholder: "Buscar joyas de la ciudad...",
      marketsTab: "Mercados",
      vendorsTab: "Joyas de la Ciudad",
      featuredVendor: "Joya Destacada",
      noMarketsFound: "No se encontraron mercados",
      noVendorsFound: "No se encontraron joyas de la ciudad",
      tryAgain: "Intenta con otra búsqueda o vuelve más tarde.",
      loading: "Cargando...",
      indigenousFilter: "Indígena",
      sustainableFilter: "Sostenible",
      nextVendor: "Siguiente",
      prevVendor: "Anterior",
      rateButton: "Calificar",
      shareButton: "Compartir",
      allCategory: "Todos",
      naturalOrganicCategory: "Natural y Orgánico",
      apparelCategory: "Ropa y Accesorios",
      diningCategory: "Restaurantes y Cafés",
      healthCategory: "Salud y Bienestar",
      digitalNomadCategory: "Espacios para Nómadas Digitales",
      culturalCategory: "Experiencias Culturales",
      sustainableCategory: "Vida Sostenible",
      artisanCategory: "Artesanías",
    }
  };

  // Get translations for current language
  const t = translations[language as keyof typeof translations] || translations.en;

  // Fetch markets data
  useEffect(() => {
    const fetchMarkets = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching markets from Supabase...");

        // Direct Supabase query
        const { data, error } = await supabase
          .from('markets')
          .select('*')
          .eq('active', true)
          .order('name');

        if (error) {
          console.error("Error fetching markets:", error);
        } else if (data) {
          console.log(`Successfully fetched ${data.length} markets`);

          // Log the first market's details for debugging
          if (data.length > 0) {
            const firstMarket = data[0];
            console.log("First market details:", {
              id: firstMarket.id,
              name: firstMarket.name,
              coordinates: firstMarket.coordinates,
              coordinatesType: typeof firstMarket.coordinates,
              parsedCoordinates: parseCoordinates(firstMarket.coordinates)
            });
          }

          setMarkets(data);
        } else {
          console.warn("No market data returned");
        }
      } catch (error) {
        console.error("Error fetching markets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarkets();
  }, []);

  // Fetch all vendors
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        console.log("Fetching all vendors...");

        // Direct Supabase query
        const { data, error } = await supabase
          .from('vendors')
          .select('*')
          .eq('active', true)
          .order('name');

        if (error) {
          console.error("Error fetching vendors:", error);
        } else if (data) {
          console.log(`Successfully fetched ${data.length} vendors`);

          // Log the first vendor's details for debugging
          if (data.length > 0) {
            const firstVendor = data[0];
            console.log("First vendor details:", {
              id: firstVendor.id,
              name: firstVendor.name,
              coordinates: firstVendor.coordinates,
              coordinatesType: typeof firstVendor.coordinates,
              parsedCoordinates: parseCoordinates(firstVendor.coordinates)
            });
          }

          setVendors(data);
          // Don't auto-select a vendor initially
          // Let the user choose from the list
        } else {
          console.warn("No vendors returned");
        }
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchVendors();
  }, []);

  // Parse coordinates from string format "(lat,lng)" to array [lat, lng]
  const parseCoordinates = (coords: any): [number, number] | null => {
    if (!coords) return null;

    // If already an array, return it
    if (Array.isArray(coords)) {
      return coords as [number, number];
    }

    // If it's a string in format "(lat,lng)", parse it
    if (typeof coords === 'string') {
      try {
        // Remove parentheses and split by comma
        const coordsStr = coords.replace(/[()]/g, '');
        const [lat, lng] = coordsStr.split(',').map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          return [lat, lng];
        }
      } catch (error) {
        console.error('Error parsing coordinates:', error);
      }
    }

    return null;
  };

  // Handle market selection
  const handleMarketSelect = (market: Market) => {
    setSelectedMarket(market);

    // If the map is loaded, center it on the selected market
    if (mapRef && market.coordinates) {
      const coords = parseCoordinates(market.coordinates);
      if (coords) {
        mapRef.panTo({ lat: coords[0], lng: coords[1] });
        mapRef.setZoom(16);
      }
    }
  };

  // Handle vendor selection
  const handleVendorSelect = (vendor: Vendor) => {
    setSelectedVendor(vendor);

    // If the map is loaded, center it on the selected vendor
    if (mapRef && vendor.coordinates) {
      const coords = parseCoordinates(vendor.coordinates);
      if (coords) {
        mapRef.panTo({ lat: coords[0], lng: coords[1] });
        mapRef.setZoom(18);
      }
    }
  };

  // Callback function when the map loads
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMapRef(map);
  }, []);

  // These functions are no longer needed with the list view
  // Keeping them as empty functions to avoid breaking any existing code
  const nextVendor = () => { };
  const prevVendor = () => { };

  // Define vendor categories
  const vendorCategories = [
    { id: "natural-organic", name: t.naturalOrganicCategory },
    { id: "apparel", name: t.apparelCategory },
    { id: "dining", name: t.diningCategory },
    { id: "health", name: t.healthCategory },
    { id: "digital-nomad", name: t.digitalNomadCategory },
    { id: "cultural", name: t.culturalCategory },
    { id: "sustainable", name: t.sustainableCategory },
    { id: "artisan", name: t.artisanCategory },
  ];

  // Filter vendors based on search query and selected category
  const filteredVendors = vendors.filter(vendor => {
    // Search query filter
    const matchesSearch =
      vendor.name.toLowerCase().includes(vendorSearchQuery.toLowerCase()) ||
      vendor.description.toLowerCase().includes(vendorSearchQuery.toLowerCase()) ||
      (vendor.tags && vendor.tags.some(tag => tag.toLowerCase().includes(vendorSearchQuery.toLowerCase())));

    // Category filter
    const matchesCategory = !selectedCategory ||
      (vendor.tags && vendor.tags.some(tag => tag.toLowerCase() === selectedCategory?.toLowerCase())) ||
      (vendor.category && vendor.category.toLowerCase() === selectedCategory?.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  // Clear selected vendor when filters change and no vendors match
  useEffect(() => {
    if (filteredVendors.length === 0) {
      setSelectedVendor(null);
    } else if (selectedVendor && !filteredVendors.some(v => v.id === selectedVendor.id)) {
      // If the currently selected vendor is no longer in the filtered list, clear selection
      setSelectedVendor(null);
    }
  }, [filteredVendors, selectedVendor]);

  // Render stars for ratings
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < Math.floor(rating)
                ? "text-primary fill-primary"
                : "text-muted/30"
            }
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-lg overflow-hidden shadow-soft border border-primary/10">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-background via-background/95 to-background">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-tight">{t.title}</h1>
            <p className="text-muted-foreground">
              {t.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Featured Vendor: Sabio's Sours */}
      <div className="p-4 mb-4 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 rounded-lg border border-primary/20 shadow-glow overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-1/3 aspect-video md:aspect-square rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1607257882338-70f7dd2ae344?w=800&q=80"
              alt="Sabio's Sours"
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-3 left-3">
              <Badge variant="featured">
                {t.featuredVendor}
              </Badge>
            </div>
          </div>

          <div className="w-full md:w-2/3 space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-purple-500/20 text-purple-500">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-serif font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">
                Sabio's Sours
              </h2>
            </div>

            <p className="text-base leading-relaxed">
              Discover the most incredible fermented products in San Cristóbal! Sabio's Sours offers authentic Russian kraut,
              vibrant purple Russian kraut, and a variety of real pickled products made with traditional techniques.
              A local artisan bringing unique flavors to the markets of Chiapas.
            </p>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/30">
                Fermented
              </Badge>
              <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/30">
                Artisanal
              </Badge>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">
                {t.sustainableFilter}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Tabs */}
        <Tabs defaultValue="markets" onValueChange={setActiveTab}>
          <TabsList className="w-full bg-background/80 backdrop-blur-sm p-1">
            <TabsTrigger value="markets" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ShoppingBag className="h-4 w-4 mr-2" />
              {t.marketsTab}
            </TabsTrigger>
            <TabsTrigger
              value="vendors"
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Utensils className="h-4 w-4 mr-2" />
              {t.vendorsTab}
            </TabsTrigger>
          </TabsList>

          {/* Markets Tab Content */}
          <TabsContent value="markets" className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
              {/* Markets List */}
              <div className="md:col-span-1 border border-primary/10 rounded-lg overflow-hidden shadow-soft bg-gradient-to-b from-background to-background/95 backdrop-blur-sm">
                <ScrollArea className="h-[calc(100vh-280px)]">
                  <div className="p-4 space-y-3">
                    {isLoading ? (
                      <div className="text-center py-12">
                        <div className="p-4 rounded-full bg-muted/50 w-16 h-16 mx-auto flex items-center justify-center mb-4">
                          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                        </div>
                        <p className="text-muted-foreground">{t.loading}</p>
                      </div>
                    ) : markets.length > 0 ? (
                      markets.map((market) => (
                        <Card
                          key={market.id}
                          featured={selectedMarket?.id === market.id}
                          className={`cursor-pointer card-hover-effect border-transparent overflow-hidden ${selectedMarket?.id === market.id ? "shadow-glow-lg" : ""}`}
                          onClick={() => handleMarketSelect(market)}
                        >
                          <div className="relative">
                            <div className="w-full h-32 overflow-hidden">
                              <img
                                src={market.image_url}
                                alt={market.name}
                                className="featured-image"
                              />
                              <div className="featured-image-overlay"></div>
                            </div>
                            <div className="absolute bottom-3 left-3 right-3">
                              <div className="flex flex-wrap gap-1">
                                {market.tags.slice(0, 3).map(tag => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="bg-background/80 backdrop-blur-sm border-white/20 text-xs shadow-sm"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className={`font-medium text-lg ${selectedMarket?.id === market.id ? "featured-title" : ""}`}>{market.name}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center mb-2">
                              <MapPin size={14} className="mr-1 text-secondary" />
                              {market.location}
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {market.open_hours}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {market.open_days}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-background/50 backdrop-blur-sm rounded-lg border border-border/50">
                        <div className="p-4 rounded-full bg-muted/50 w-16 h-16 mx-auto flex items-center justify-center mb-4">
                          <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-serif font-semibold mb-2">{t.noMarketsFound}</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          {t.tryAgain}
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Market Map */}
              <div className="md:col-span-2 border border-primary/10 rounded-lg overflow-hidden bg-background/95 backdrop-blur-sm shadow-soft">
                {selectedMarket ? (
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b bg-gradient-to-r from-background via-background/95 to-background">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-secondary/10 text-secondary">
                          <ShoppingBag className="h-5 w-5" />
                        </div>
                        <div>
                          <h2 className="text-xl font-serif font-bold tracking-tight">
                            {selectedMarket.name}
                          </h2>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-secondary" />
                            {selectedMarket.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 relative h-[450px] md:h-auto">
                      {/* Google Maps Component */}
                      {loadError && (
                        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center">
                          <Card className="text-center p-8 max-w-md border-destructive/30 shadow-lg">
                            <CardContent className="pt-6">
                              <div className="mb-6 text-destructive bg-destructive/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                                <MapPin className="h-10 w-10" />
                              </div>
                              <h3 className="text-xl font-serif font-bold mb-3">Error Loading Map</h3>
                              <p className="text-muted-foreground mb-6">
                                There was an error loading the Google Maps API. Please check your API key and try again.
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      )}

                      {!isLoaded && !loadError && (
                        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center">
                          <div className="text-center">
                            <div className="relative mx-auto w-16 h-16">
                              <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
                            </div>
                            <p className="mt-6 text-muted-foreground font-medium">{t.loading}</p>
                          </div>
                        </div>
                      )}

                      {isLoaded && (
                        <GoogleMap
                          mapContainerStyle={mapContainerStyle}
                          center={selectedMarket && selectedMarket.coordinates ?
                            {
                              lat: parseCoordinates(selectedMarket.coordinates)?.[0] || SAN_CRISTOBAL_CENTER.lat,
                              lng: parseCoordinates(selectedMarket.coordinates)?.[1] || SAN_CRISTOBAL_CENTER.lng
                            } :
                            SAN_CRISTOBAL_CENTER}
                          zoom={16}
                          onLoad={onMapLoad}
                          options={{
                            fullscreenControl: false,
                            streetViewControl: false,
                            mapTypeControl: true,
                            zoomControl: true,
                          }}
                        >
                          {/* Render market marker */}
                          {selectedMarket && selectedMarket.coordinates && (
                            <Marker
                              position={{
                                lat: parseCoordinates(selectedMarket.coordinates)?.[0] || SAN_CRISTOBAL_CENTER.lat,
                                lng: parseCoordinates(selectedMarket.coordinates)?.[1] || SAN_CRISTOBAL_CENTER.lng
                              }}
                              icon={{
                                path: window.google.maps.SymbolPath.CIRCLE,
                                scale: 12,
                                fillColor: '#FF5733',
                                fillOpacity: 0.8,
                                strokeWeight: 2,
                                strokeColor: '#FFFFFF',
                              }}
                              title={selectedMarket.name}
                            />
                          )}
                        </GoogleMap>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center p-6 max-w-md">
                      <h3 className="text-2xl font-serif font-bold mb-3">Explore Local Markets</h3>
                      <p className="mb-6 leading-relaxed">
                        Select a market from the list to see its location and details. Discover the vibrant markets of San Cristóbal de las Casas.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* City Gems Tab Content */}
          <TabsContent value="vendors" className="p-0">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t.searchPlaceholder}
                className="pl-9 bg-background/80 backdrop-blur-sm border-border/50 focus-visible:ring-primary/30 focus-visible:border-primary/30 rounded-full"
                value={vendorSearchQuery}
                onChange={(e) => setVendorSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto pb-2">
              <Badge
                variant={selectedCategory === null ? "secondary" : "outline"}
                className="cursor-pointer hover:bg-secondary/20 transition-colors"
                onClick={() => setSelectedCategory(null)}
              >
                {t.allCategory}
              </Badge>
              {vendorCategories.map(category => (
                <Badge
                  key={category.id}
                  variant={selectedCategory === category.id ? "secondary" : "outline"}
                  className="cursor-pointer hover:bg-secondary/20 transition-colors"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
              {/* Vendors List */}
              <div className="md:col-span-1 border border-primary/10 rounded-lg overflow-hidden shadow-soft bg-gradient-to-b from-background to-background/95 backdrop-blur-sm">
                <ScrollArea className="h-[calc(100vh-280px)]">
                  <div className="p-4 space-y-3">
                    {isLoading ? (
                      <div className="text-center py-12">
                        <div className="p-4 rounded-full bg-muted/50 w-16 h-16 mx-auto flex items-center justify-center mb-4">
                          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                        </div>
                        <p className="text-muted-foreground">{t.loading}</p>
                      </div>
                    ) : filteredVendors.length > 0 ? (
                      filteredVendors.map((vendor) => (
                        <Card
                          key={vendor.id}
                          featured={selectedVendor?.id === vendor.id || vendor.featured}
                          className={`cursor-pointer card-hover-effect border-transparent overflow-hidden ${selectedVendor?.id === vendor.id ? "shadow-glow-lg" : ""}`}
                          onClick={() => handleVendorSelect(vendor)}
                        >
                          <div className="relative">
                            <div className="w-full h-32 overflow-hidden">
                              <img
                                src={vendor.image_url}
                                alt={vendor.name}
                                className="featured-image"
                              />
                              <div className="featured-image-overlay"></div>
                            </div>
                            <div className="absolute bottom-3 left-3 right-3">
                              <div className="flex flex-wrap gap-1">
                                {vendor.tags && vendor.tags.slice(0, 3).map(tag => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="bg-background/80 backdrop-blur-sm border-white/20 text-xs shadow-sm"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className={`font-medium text-lg ${selectedVendor?.id === vendor.id || vendor.featured ? "featured-title" : ""}`}>{vendor.name}</h3>
                              {vendor.featured && (
                                <Badge variant="featured" className="text-xs">
                                  {t.featuredVendor}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center mb-2">
                              <MapPin size={14} className="mr-1 text-secondary" />
                              {vendor.location}
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                              <span className="flex items-center">
                                {vendor.category && (
                                  <Badge variant="outline" className="flex items-center gap-1 bg-background/50 text-xs">
                                    {vendor.category}
                                  </Badge>
                                )}
                              </span>
                              <span className="flex items-center">
                                {vendor.rating && renderStars(vendor.rating)}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-background/50 backdrop-blur-sm rounded-lg border border-border/50">
                        <div className="p-4 rounded-full bg-muted/50 w-16 h-16 mx-auto flex items-center justify-center mb-4">
                          <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-serif font-semibold mb-2">{t.noVendorsFound}</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          {t.tryAgain}
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Vendor Map and Details */}
              <div className="md:col-span-2 border border-primary/10 rounded-lg overflow-hidden bg-background/95 backdrop-blur-sm shadow-soft">
                {selectedVendor ? (
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b bg-gradient-to-r from-background via-background/95 to-background">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-secondary/10 text-secondary">
                          <Utensils className="h-5 w-5" />
                        </div>
                        <div>
                          <h2 className="text-xl font-serif font-bold tracking-tight">
                            {selectedVendor.name}
                          </h2>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-secondary" />
                            {selectedVendor.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-b">
                      <p className="text-sm leading-relaxed mb-4">
                        {selectedVendor.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedVendor.indigenous && (
                          <Badge variant="outline" className="bg-[#33FF57]/10 text-[#33FF57] border-[#33FF57]/30">
                            {t.indigenousFilter}
                          </Badge>
                        )}
                        {selectedVendor.sustainable && (
                          <Badge variant="outline" className="bg-[#33A1FF]/10 text-[#33A1FF] border-[#33A1FF]/30">
                            {t.sustainableFilter}
                          </Badge>
                        )}
                        {selectedVendor.specialty && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                            {selectedVendor.specialty}
                          </Badge>
                        )}
                        {selectedVendor.tags && selectedVendor.tags.map(tag => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="bg-background/80 border-primary/20 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="rounded-full text-xs h-8" size="sm">
                          <Star className="mr-1 h-3 w-3" />
                          {t.rateButton}
                        </Button>
                        <Button className="rounded-full text-xs h-8" size="sm" variant="secondary">
                          <Share2 className="mr-1 h-3 w-3" />
                          {t.shareButton}
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1 relative h-[350px] md:h-auto">
                      {/* Google Maps Component */}
                      {loadError && (
                        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center">
                          <Card className="text-center p-8 max-w-md border-destructive/30 shadow-lg">
                            <CardContent className="pt-6">
                              <div className="mb-6 text-destructive bg-destructive/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                                <MapPin className="h-10 w-10" />
                              </div>
                              <h3 className="text-xl font-serif font-bold mb-3">Error Loading Map</h3>
                              <p className="text-muted-foreground mb-6">
                                There was an error loading the Google Maps API. Please check your API key and try again.
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      )}

                      {!isLoaded && !loadError && (
                        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center">
                          <div className="text-center">
                            <div className="relative mx-auto w-16 h-16">
                              <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
                            </div>
                            <p className="mt-6 text-muted-foreground font-medium">{t.loading}</p>
                          </div>
                        </div>
                      )}

                      {isLoaded && (
                        <GoogleMap
                          mapContainerStyle={mapContainerStyle}
                          center={selectedVendor && selectedVendor.coordinates ?
                            {
                              lat: parseCoordinates(selectedVendor.coordinates)?.[0] || SAN_CRISTOBAL_CENTER.lat,
                              lng: parseCoordinates(selectedVendor.coordinates)?.[1] || SAN_CRISTOBAL_CENTER.lng
                            } :
                            SAN_CRISTOBAL_CENTER}
                          zoom={18}
                          onLoad={onMapLoad}
                          options={{
                            fullscreenControl: false,
                            streetViewControl: false,
                            mapTypeControl: true,
                            zoomControl: true,
                          }}
                        >
                          {/* Render vendor marker */}
                          {selectedVendor && selectedVendor.coordinates && (
                            <Marker
                              position={{
                                lat: parseCoordinates(selectedVendor.coordinates)?.[0] || SAN_CRISTOBAL_CENTER.lat,
                                lng: parseCoordinates(selectedVendor.coordinates)?.[1] || SAN_CRISTOBAL_CENTER.lng
                              }}
                              icon={{
                                path: window.google.maps.SymbolPath.CIRCLE,
                                scale: 10,
                                fillColor: selectedVendor.indigenous ? "#33FF57" :
                                  selectedVendor.sustainable ? "#33A1FF" : "#FF5733",
                                fillOpacity: 1,
                                strokeWeight: 2,
                                strokeColor: '#FFFFFF',
                              }}
                              title={selectedVendor.name}
                            />
                          )}
                        </GoogleMap>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center p-6 max-w-md">
                      <h3 className="text-2xl font-serif font-bold mb-3">Discover City Gems</h3>
                      <p className="mb-6 leading-relaxed">
                        Browse through our curated selection of local vendors and hidden gems. Select a vendor to see their location and details.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketNavigatorSimplified;
