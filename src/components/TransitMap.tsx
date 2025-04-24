import { useState, useCallback } from "react";
import { GlassCard, GlassCardContent, GlassCardTitle } from "@/components/ui/glass-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GlowButton } from "@/components/ui/glow-button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MapPin, Bus, Route, Search, Layers, Compass, Navigation, Map as MapIcon, Locate, DollarSign, Landmark, Car, AlertCircle, RefreshCw, X } from "lucide-react";
import { GoogleMap, useJsApiLoader, Marker, Polyline, InfoWindow } from "@react-google-maps/api";
import { collectivoRoutes, collectivoTerminals } from "@/data/collectivos";

interface Route {
  id: string;
  name: string;
  color: string;
  stops: Stop[];
}

interface Stop {
  id: string;
  name: string;
  location: [number, number]; // [latitude, longitude]
}

interface Bus {
  id: string;
  routeId: string;
  location: [number, number]; // [latitude, longitude]
  lastUpdated: Date;
  nextStopIndex?: number; // Index of the next stop in the route
  speed?: number; // Speed in km/h
  direction?: number; // Direction in degrees
}

// Define the center for San Cristobal de las Casas, Chiapas
const SAN_CRISTOBAL_CENTER = {
  lat: 16.7370,
  lng: -92.6376
};

// Responsive map container style
const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '450px', // Ensure minimum height on all devices
};

const TransitMap = () => {
  // We no longer need selectedRoute since we've moved all routes to collectivos
  const [showStops, setShowStops] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMarker, setSelectedMarker] = useState<Stop | null>(null);
  const [mapRef, setMapRef] = useState(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [showUserLocation, setShowUserLocation] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [forceMapUpdate, setForceMapUpdate] = useState(0);
  const [collectivoType, setCollectivoType] = useState<'all' | 'neighborhood' | 'mountain' | 'tourist'>('all');
  const [selectedCollectivoRoute, setSelectedCollectivoRoute] = useState<string | null>(null);
  const [selectedTerminal, setSelectedTerminal] = useState<string | null>(null);

  // Load the Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyDTLYgmAaeYsI4ses0ODflNM8VFx3nhZBs",
    // You can add additional libraries here if needed
    // libraries: ['places']
  });

  // Mock data for San Cristobal de las Casas routes
  const routes: Route[] = [
    {
      id: "1",
      name: "Centro Histórico",
      color: "#FF5733",
      stops: [
        { id: "1-1", name: "Catedral de San Cristóbal", location: [16.7370, -92.6376] },
        { id: "1-2", name: "Arco del Carmen", location: [16.7352, -92.6390] },
        { id: "1-3", name: "Mercado Municipal", location: [16.7380, -92.6410] },
        { id: "1-4", name: "Templo de Santo Domingo", location: [16.7390, -92.6365] },
        { id: "1-5", name: "Andador Eclesiástico", location: [16.7375, -92.6355] },
      ],
    },
    {
      id: "2",
      name: "Ruta Cultural",
      color: "#33A1FF",
      stops: [
        { id: "2-1", name: "Museo Na Bolom", location: [16.7420, -92.6320] },
        { id: "2-2", name: "Museo del Ámbar", location: [16.7365, -92.6368] },
        { id: "2-3", name: "Centro Cultural El Carmen", location: [16.7350, -92.6395] },
        { id: "2-4", name: "Museo de Culturas Populares", location: [16.7385, -92.6372] },
      ],
    },
    {
      id: "3",
      name: "Pueblos Indígenas",
      color: "#33FF57",
      stops: [
        { id: "3-1", name: "San Juan Chamula", location: [16.7833, -92.6833] },
        { id: "3-2", name: "Zinacantán", location: [16.7667, -92.7167] },
        { id: "3-3", name: "Tenejapa", location: [16.8167, -92.5167] },
        { id: "3-4", name: "Amatenango del Valle", location: [16.5333, -92.4333] },
      ],
    },
    {
      id: "4",
      name: "Ruta Ecoturística",
      color: "#9933FF",
      stops: [
        { id: "4-1", name: "Cañón del Sumidero", location: [16.8500, -93.0833] },
        { id: "4-2", name: "Cascadas El Chiflón", location: [16.1000, -92.2667] },
        { id: "4-3", name: "Lagos de Montebello", location: [16.1167, -91.7333] },
        { id: "4-4", name: "Cascadas de Agua Azul", location: [17.2500, -92.1167] },
      ],
    },
  ];

  // Initial bus data
  const initialBuses: Bus[] = [
    {
      id: "bus-1",
      routeId: "1",
      location: [16.7365, -92.6380],
      lastUpdated: new Date(),
      nextStopIndex: 1,
      speed: 20,
    },
    {
      id: "bus-2",
      routeId: "1",
      location: [16.7385, -92.6395],
      lastUpdated: new Date(),
      nextStopIndex: 3,
      speed: 15,
    },
    {
      id: "bus-3",
      routeId: "2",
      location: [16.7390, -92.6340],
      lastUpdated: new Date(),
      nextStopIndex: 2,
      speed: 18,
    },
    {
      id: "bus-4",
      routeId: "3",
      location: [16.7800, -92.6800],
      lastUpdated: new Date(),
      nextStopIndex: 1,
      speed: 25,
    },
    {
      id: "bus-5",
      routeId: "4",
      location: [16.8400, -93.0700],
      lastUpdated: new Date(),
      nextStopIndex: 2,
      speed: 30,
    },
  ];

  // We've removed the bus state since we don't need real-time updates
  const buses = initialBuses; // Keep this as a constant for the Buses tab

  // We no longer need filteredRoutes since we've moved all routes to collectivos

  const filteredCollectivoRoutes = collectivoRoutes.filter((route) => {
    const matchesSearch = route.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = collectivoType === 'all' || route.type === collectivoType;
    return matchesSearch && matchesType;
  });

  // We no longer need selectedRouteData since we've moved all routes to collectivos

  const selectedCollectivoData = selectedCollectivoRoute
    ? collectivoRoutes.find((r) => r.id === selectedCollectivoRoute)
    : null;

  // We don't need selectedTerminalData as we're using selectedTerminal directly

  // Callback function when the map loads
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMapRef(map);

    // Add click listener to clear selections when clicking on the map
    map.addListener('click', () => {
      // Only clear if we have something selected
      if (selectedCollectivoRoute || selectedTerminal) {
        setSelectedCollectivoRoute(null);
        setSelectedTerminal(null);
        setSelectedTerminalInfo(null);
        setSelectedCollectivoStopInfo(null);
      }
    });
  }, [selectedCollectivoRoute, selectedTerminal]);

  // Handle marker click
  const handleMarkerClick = (stop: Stop) => {
    setSelectedMarker(stop);
  };

  // Close info window
  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };

  // Reset all selections and return to default map view
  const resetMap = useCallback(() => {
    // Clear all selections
    setSelectedCollectivoRoute(null);
    setSelectedTerminal(null);
    setSelectedTerminalInfo(null);
    setSelectedCollectivoStopInfo(null);
    setSelectedMarker(null);

    // Reset map view to show all of San Cristobal
    if (mapRef) {
      mapRef.panTo(SAN_CRISTOBAL_CENTER);
      mapRef.setZoom(14);
    }
  }, [mapRef]);

  // Handle collectivo terminal info
  const [selectedTerminalInfo, setSelectedTerminalInfo] = useState<any>(null);

  // Handle collectivo stop info
  const [selectedCollectivoStopInfo, setSelectedCollectivoStopInfo] = useState<any>(null);

  // Get user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setShowUserLocation(true);

        // Center map on user location
        if (mapRef) {
          mapRef.panTo({ lat: latitude, lng: longitude });
          mapRef.setZoom(15);
        }

        setIsLocating(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your location. Please check your permissions.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  // We no longer need this effect since we've moved all routes to collectivos

  // We've removed the distance and bearing calculation functions since we don't need real-time updates

  // We've removed the bus movement simulation since we don't need real-time updates

  return (
    <div className="flex flex-col h-full w-full bg-background rounded-lg overflow-hidden shadow-soft border border-primary/10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b bg-gradient-to-r from-background via-background/95 to-background gap-4 sm:gap-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <MapIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold tracking-tight">Transit Map</h2>
            <p className="text-sm text-muted-foreground">Explore routes and transportation</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border shadow-sm">
            <Switch
              id="show-stops"
              checked={showStops}
              onCheckedChange={setShowStops}
              className="data-[state=checked]:bg-primary"
            />
            <Label htmlFor="show-stops" className="text-sm font-medium cursor-pointer">Stops</Label>
          </div>

          <GlowButton
            variant="glass"
            size="icon"
            glow="subtle"
            animation={isLocating ? "pulse" : "none"}
            className="rounded-full h-9 w-9"
            onClick={getUserLocation}
            disabled={isLocating}
          >
            <Locate className={`h-4 w-4 ${isLocating ? 'animate-pulse' : ''}`} />
          </GlowButton>
          <GlowButton
            variant="glass"
            size="icon"
            glow="subtle"
            className="rounded-full h-9 w-9"
          >
            <Layers className="h-4 w-4" />
          </GlowButton>
        </div>
      </div>

      {/* Mobile Route Selection - visible only on mobile, organized in tabs */}
      <div className="md:hidden p-3 border-b border-primary/10 bg-gradient-to-r from-background via-background/95 to-background">
        <Tabs defaultValue="collectivos" className="w-full">
          <TabsList className="w-full mb-2 grid grid-cols-2 bg-background/80 backdrop-blur-sm p-1 rounded-full">
            <TabsTrigger value="collectivos" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Bus className="h-3 w-3 mr-1" />
              Collectivos
            </TabsTrigger>
            <TabsTrigger value="rideshare" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Car className="h-3 w-3 mr-1" />
              Rideshare
            </TabsTrigger>
          </TabsList>

          <TabsContent value="collectivos" className="mt-2">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-medium">Routes</h3>
              {/* Reset button - only show when something is selected */}
              {(selectedCollectivoRoute || selectedTerminal) && (
                <GlowButton
                  variant="glass"
                  size="sm"
                  glow="subtle"
                  animation="none"
                  className="text-xs py-1 px-2"
                  onClick={resetMap}
                >
                  <X className="h-3 w-3 mr-1" />
                  Reset
                </GlowButton>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {filteredCollectivoRoutes.map((route) => (
                <GlowButton
                  key={route.id}
                  variant={selectedCollectivoRoute === route.id ? "glass-primary" : "glass"}
                  size="sm"
                  glow={selectedCollectivoRoute === route.id ? "medium" : "subtle"}
                  animation={selectedCollectivoRoute === route.id ? "shimmer" : "none"}
                  className={`whitespace-nowrap text-xs`}
                  onClick={() => {
                    // Toggle the route on/off when clicked
                    const newSelectedRoute = route.id === selectedCollectivoRoute ? null : route.id;
                    setSelectedCollectivoRoute(newSelectedRoute);

                    if (newSelectedRoute === null) {
                      // If deselecting, reset the map view to show all of San Cristobal
                      if (mapRef) {
                        mapRef.panTo(SAN_CRISTOBAL_CENTER);
                        mapRef.setZoom(14);
                      }
                    } else if (mapRef && route.stops.length > 0) {
                      // If selecting a route, fit the map to show all stops
                      const bounds = new window.google.maps.LatLngBounds();
                      route.stops.forEach((stop) => {
                        bounds.extend({ lat: stop.location[0], lng: stop.location[1] });
                      });
                      mapRef.fitBounds(bounds);
                    }
                  }}
                  style={selectedCollectivoRoute === route.id ? {} : { borderColor: `${route.color}40`, color: route.color }}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-1.5 ${selectedCollectivoRoute === route.id ? 'animate-pulse-glow' : ''}`}
                    style={{ backgroundColor: route.color }}
                  ></div>
                  <span className="truncate">{route.name}</span>
                </GlowButton>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rideshare" className="mt-2">
            <div className="flex flex-col items-center justify-center p-4 space-y-4 text-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping"></div>
                <div className="relative bg-background/80 backdrop-blur-sm p-4 rounded-full border border-primary/20 shadow-glow">
                  <Car className="h-8 w-8 text-primary animate-pulse-glow" />
                </div>
              </div>

              <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-gradient">
                Rideshare Coming Soon
              </h3>

              <p className="text-xs text-muted-foreground">
                We're working on connecting you with local drivers for convenient ridesharing.
              </p>

              <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
                <AlertCircle className="h-3 w-3 text-primary" />
                <span className="text-xs">Stay tuned!</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex flex-col md:flex-row h-[calc(100%-7rem)] md:h-[calc(100%-4rem)]">
        {/* Left sidebar - hidden on mobile, will be replaced by the navigation in home.tsx */}
        <div className="hidden md:flex w-80 border-r border-primary/10 p-5 flex-col h-full bg-gradient-to-b from-background to-background/95">
          <div className="relative mb-5">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search routes..."
              className="pl-9 bg-background/80 backdrop-blur-sm border-border/50 focus-visible:ring-primary/30 focus-visible:border-primary/30 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs
            defaultValue="collectivos"
            className="flex-1 flex flex-col"
          >
            <TabsList className="grid w-full grid-cols-4 bg-background/80 backdrop-blur-sm p-1 rounded-full">
              <TabsTrigger value="collectivos" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Bus className="h-4 w-4 mr-2" />
                Collectivos
              </TabsTrigger>
              <TabsTrigger value="rideshare" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Car className="h-4 w-4 mr-2" />
                Rideshare
              </TabsTrigger>
              <TabsTrigger value="stops" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                Stops
              </TabsTrigger>
              <TabsTrigger value="buses" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Bus className="h-4 w-4 mr-2" />
                Buses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="collectivos" className="flex-1 overflow-auto mt-4 pr-1">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Filter by Type</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={collectivoType === 'all' ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setCollectivoType('all')}
                  >
                    All Routes
                  </Badge>
                  <Badge
                    variant={collectivoType === 'neighborhood' ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setCollectivoType('neighborhood')}
                  >
                    Neighborhood
                  </Badge>
                  <Badge
                    variant={collectivoType === 'mountain' ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setCollectivoType('mountain')}
                  >
                    Mountain
                  </Badge>
                  <Badge
                    variant={collectivoType === 'tourist' ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setCollectivoType('tourist')}
                  >
                    Tourist
                  </Badge>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Main Terminals</h3>
                <div className="space-y-2">
                  {collectivoTerminals.map((terminal) => (
                    <GlassCard
                      key={terminal.id}
                      className="cursor-pointer"
                      glowIntensity={selectedTerminal === terminal.id ? "medium" : "subtle"}
                      glassOpacity="medium"
                      hoverEffect={true}
                      animateOnHover={true}
                      noiseTexture={true}
                      colorTint={selectedTerminal === terminal.id ? "purple" : "none"}
                      borderGlow={selectedTerminal === terminal.id}
                      featured={selectedTerminal === terminal.id}
                      onClick={() => {
                        // Toggle the terminal on/off when clicked
                        const newSelectedTerminal = terminal.id === selectedTerminal ? null : terminal.id;
                        setSelectedTerminal(newSelectedTerminal);

                        // Force a re-render when toggling terminals
                        setForceMapUpdate(prev => prev + 1);

                        if (newSelectedTerminal === null) {
                          // If deselecting, reset the map view to show all of San Cristobal
                          if (mapRef) {
                            mapRef.panTo(SAN_CRISTOBAL_CENTER);
                            mapRef.setZoom(14);
                          }
                        } else if (mapRef && terminal) {
                          // If selecting a terminal, zoom in on it
                          mapRef.panTo({ lat: terminal.location[0], lng: terminal.location[1] });
                          mapRef.setZoom(16);
                        }
                      }}
                    >
                      <GlassCardContent className="p-3 flex items-center">
                        <div
                          className={`w-5 h-5 rounded-full mr-3 shadow-sm flex items-center justify-center bg-primary/10 text-primary ${selectedTerminal === terminal.id ? 'animate-pulse-glow' : ''}`}
                        >
                          <Landmark className="h-3 w-3" />
                        </div>
                        <div className="flex-1">
                          <GlassCardTitle featured={selectedTerminal === terminal.id} className="text-base">{terminal.name}</GlassCardTitle>
                          <div className="text-xs text-muted-foreground mt-1">
                            {terminal.description.substring(0, 60)}...
                          </div>
                        </div>
                      </GlassCardContent>
                    </GlassCard>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium mb-2">Collectivo Routes</h3>
                {filteredCollectivoRoutes.map((route) => (
                  <GlassCard
                    key={route.id}
                    className="cursor-pointer"
                    glowIntensity={selectedCollectivoRoute === route.id ? "medium" : "subtle"}
                    glassOpacity="medium"
                    hoverEffect={true}
                    animateOnHover={true}
                    noiseTexture={true}
                    colorTint={selectedCollectivoRoute === route.id ? "purple" : "none"}
                    borderGlow={selectedCollectivoRoute === route.id}
                    featured={selectedCollectivoRoute === route.id}
                    onClick={() => {
                      // Toggle the route on/off when clicked
                      const newSelectedRoute = route.id === selectedCollectivoRoute ? null : route.id;
                      setSelectedCollectivoRoute(newSelectedRoute);

                      // Force a re-render when toggling routes
                      setForceMapUpdate(prev => prev + 1);

                      if (newSelectedRoute === null) {
                        // If deselecting, reset the map view to show all of San Cristobal
                        if (mapRef) {
                          mapRef.panTo(SAN_CRISTOBAL_CENTER);
                          mapRef.setZoom(14);
                        }
                      } else if (mapRef && route.stops.length > 0) {
                        // If selecting a route, fit the map to show all stops
                        const bounds = new window.google.maps.LatLngBounds();
                        route.stops.forEach((stop) => {
                          bounds.extend({ lat: stop.location[0], lng: stop.location[1] });
                        });
                        mapRef.fitBounds(bounds);
                      }
                    }}
                  >
                    <GlassCardContent className="p-4 flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full mr-3 shadow-sm ${selectedCollectivoRoute === route.id ? 'animate-pulse-glow' : ''}`}
                        style={{ backgroundColor: route.color }}
                      ></div>
                      <div className="flex-1">
                        <GlassCardTitle featured={selectedCollectivoRoute === route.id} className="text-base">{route.name}</GlassCardTitle>
                        <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>{route.stops.length} stops</span>
                          <span className="mx-1">•</span>
                          <DollarSign className="h-3 w-3" />
                          <span>{route.fare}</span>
                        </div>
                      </div>
                      <Badge
                        variant={route.type === 'mountain' ? "secondary" : "outline"}
                        className="ml-2 capitalize"
                      >
                        {route.type}
                      </Badge>
                    </GlassCardContent>
                  </GlassCard>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rideshare" className="flex-1 overflow-auto mt-4 pr-1">
              <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping"></div>
                  <div className="relative bg-background/80 backdrop-blur-sm p-6 rounded-full border border-primary/20 shadow-glow">
                    <Car className="h-12 w-12 text-primary animate-pulse-glow" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-gradient">
                  Rideshare Coming Soon
                </h3>

                <p className="text-muted-foreground max-w-md">
                  We're working on connecting you with local drivers for convenient ridesharing throughout San Cristóbal de las Casas and surrounding areas.
                </p>

                <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Stay tuned for updates!</span>
                </div>

                <div className="grid grid-cols-3 gap-4 w-full max-w-md mt-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-24 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 flex items-center justify-center p-4"
                      style={{
                        animationDelay: `${i * 0.2}s`,
                        animation: 'pulse 3s infinite ease-in-out'
                      }}
                    >
                      <div className="w-full h-2 bg-primary/10 rounded-full animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stops" className="flex-1 overflow-auto mt-4 pr-1">
              <div className="space-y-3">
                {routes
                  .flatMap((route) => route.stops.map(stop => ({ ...stop, routeColor: route.color, routeName: route.name })))
                  .map((stop) => (
                    <GlassCard
                      key={stop.id}
                      className="cursor-pointer"
                      glowIntensity="subtle"
                      glassOpacity="medium"
                      hoverEffect={true}
                      animateOnHover={true}
                      noiseTexture={true}
                      onClick={() => handleMarkerClick(stop)}
                    >
                      <GlassCardContent className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 rounded-full shadow-glow-soft" style={{ backgroundColor: stop.routeColor }}></div>
                          <div className="font-medium">{stop.name}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs bg-background/50 border-border/50">
                            {stop.routeName}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            <Compass className="h-3 w-3 inline mr-1" />
                            {stop.location[0].toFixed(4)}, {stop.location[1].toFixed(4)}
                          </div>
                        </div>
                      </GlassCardContent>
                    </GlassCard>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="buses" className="flex-1 overflow-auto mt-4 pr-1">
              <div className="space-y-3">
                {buses.map((bus) => {
                  const route = routes.find((r) => r.id === bus.routeId);
                  return (
                    <GlassCard
                      key={bus.id}
                      className="cursor-pointer overflow-hidden"
                      glowIntensity="subtle"
                      glassOpacity="medium"
                      hoverEffect={true}
                      animateOnHover={true}
                      noiseTexture={true}
                      colorTint="none"
                    >
                      <div className="h-1 animate-pulse-glow" style={{ backgroundColor: route?.color }}></div>
                      <GlassCardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              <Bus className="h-4 w-4 text-primary" />
                              Bus #{bus.id.replace('bus-', '')}
                            </div>
                            <div className="text-sm mt-1">
                              Route:{" "}
                              <span className="font-medium shadow-glow-soft" style={{ color: route?.color }}>
                                {route?.name}
                              </span>
                            </div>
                          </div>
                          <Badge className="bg-secondary/10 text-secondary border-none hover:bg-secondary/20 transition-colors">
                            Static
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <Navigation className="h-3 w-3" />
                          <span>Static route information</span>
                        </div>
                      </GlassCardContent>
                    </GlassCard>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main map area - full height on mobile */}
        <div className="flex-1 relative h-[450px] md:h-auto">
          {loadError && (
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center">
              <GlassCard
                className="text-center p-8 max-w-md"
                glowIntensity="medium"
                glassOpacity="high"
                hoverEffect={false}
                noiseTexture={true}
                colorTint="none"
                borderGlow={true}
              >
                <GlassCardContent className="pt-6">
                  <div className="mb-6 text-destructive bg-destructive/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto shadow-glow-destructive animate-pulse-glow">
                    <MapPin className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-3">Error Loading Map</h3>
                  <p className="text-muted-foreground mb-6">
                    There was an error loading the Google Maps API. Please check your API key and try again.
                  </p>
                  <GlowButton variant="outline" glow="medium" animation="pulse" className="mt-2">
                    <span>Retry</span>
                  </GlowButton>
                </GlassCardContent>
              </GlassCard>
            </div>
          )}

          {!isLoaded && !loadError && (
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center">
              <GlassCard
                className="text-center p-8"
                glowIntensity="medium"
                glassOpacity="low"
                hoverEffect={false}
                noiseTexture={true}
                colorTint="primary"
                borderGlow={true}
              >
                <GlassCardContent className="pt-6">
                  <div className="relative mx-auto w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20 shadow-glow-primary"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary rounded-full animate-spin border-t-transparent shadow-glow"></div>
                    <Compass className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse shadow-glow-primary" />
                  </div>
                  <p className="mt-6 text-muted-foreground font-medium">Loading map...</p>
                </GlassCardContent>
              </GlassCard>
            </div>
          )}

          {isLoaded && (
            <GoogleMap
              // Removed force re-render key to fix route display issues
              mapContainerStyle={mapContainerStyle}
              center={SAN_CRISTOBAL_CENTER}
              zoom={14}
              onLoad={onMapLoad}
              options={{
                fullscreenControl: false,
                streetViewControl: false,
                mapTypeControl: false, // Disabled map/satellite buttons
                zoomControl: true,
                disableDefaultUI: false,
                // Removed dark mode styling to use the default light theme
                styles: []
              }}
            >
              {/* Render collectivo terminals */}
              {collectivoTerminals.map(terminal => (
                <Marker
                  key={terminal.id}
                  position={{
                    lat: terminal.location[0],
                    lng: terminal.location[1]
                  }}
                  icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 12,
                    fillColor: '#FF5733',
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#FFFFFF',
                  }}
                  title={terminal.name}
                  onClick={(e) => {
                    // Stop the event from propagating to the map
                    e.stop();

                    // Toggle the terminal on/off when clicked
                    const newSelectedTerminal = terminal.id === selectedTerminal ? null : terminal.id;
                    setSelectedTerminal(newSelectedTerminal);

                    // Force a re-render when toggling terminals
                    setForceMapUpdate(prev => prev + 1);

                    // Only show info window if we're selecting the terminal
                    if (newSelectedTerminal !== null) {
                      setSelectedTerminalInfo(terminal);
                    } else {
                      setSelectedTerminalInfo(null);
                    }

                    if (newSelectedTerminal === null) {
                      // If deselecting, reset the map view to show all of San Cristobal
                      if (mapRef) {
                        mapRef.panTo(SAN_CRISTOBAL_CENTER);
                        mapRef.setZoom(14);
                      }
                    } else if (mapRef) {
                      // If selecting a terminal, zoom in on it
                      mapRef.panTo({ lat: terminal.location[0], lng: terminal.location[1] });
                      mapRef.setZoom(16);
                    }
                  }}
                />
              ))}

              {/* Terminal Info Window */}
              {selectedTerminalInfo && (
                <InfoWindow
                  position={{
                    lat: selectedTerminalInfo.location[0],
                    lng: selectedTerminalInfo.location[1]
                  }}
                  onCloseClick={() => setSelectedTerminalInfo(null)}
                >
                  <div className="p-2 max-w-xs">
                    <h3 className="font-bold text-base mb-1">{selectedTerminalInfo.name}</h3>
                    <p className="text-sm mb-2">{selectedTerminalInfo.description}</p>
                    {selectedTerminalInfo.access && (
                      <div className="text-xs mt-2">
                        <strong>Access:</strong> {selectedTerminalInfo.access}
                      </div>
                    )}
                  </div>
                </InfoWindow>
              )}

              {/* Render collectivo route polylines */}
              {selectedCollectivoData && (
                <Polyline
                  path={selectedCollectivoData.stops.map(stop => ({
                    lat: stop.location[0],
                    lng: stop.location[1]
                  }))}
                  options={{
                    strokeColor: selectedCollectivoData.color,
                    strokeOpacity: 0.8,
                    strokeWeight: 5,
                    geodesic: true,
                    icons: [{
                      icon: {
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: '#ffffff',
                        fillOpacity: 1,
                        strokeWeight: 0
                      },
                      offset: '0',
                      repeat: '60px'
                    }]
                  }}
                />
              )}

              {/* Render collectivo stops */}
              {selectedCollectivoData && selectedCollectivoData.stops.map(stop => (
                <Marker
                  key={stop.id}
                  position={{
                    lat: stop.location[0],
                    lng: stop.location[1]
                  }}
                  icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: selectedCollectivoData.color,
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#FFFFFF',
                  }}
                  title={stop.name}
                  onClick={(e) => {
                    // Stop the event from propagating to the map
                    e.stop();

                    setSelectedCollectivoStopInfo({
                      ...stop,
                      routeName: selectedCollectivoData.name,
                      routeColor: selectedCollectivoData.color,
                      fare: selectedCollectivoData.fare,
                      type: selectedCollectivoData.type
                    });
                  }}
                />
              ))}

              {/* Collectivo Stop Info Window */}
              {selectedCollectivoStopInfo && (
                <InfoWindow
                  position={{
                    lat: selectedCollectivoStopInfo.location[0],
                    lng: selectedCollectivoStopInfo.location[1]
                  }}
                  onCloseClick={() => setSelectedCollectivoStopInfo(null)}
                >
                  <div className="p-2 max-w-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: selectedCollectivoStopInfo.routeColor }}
                      ></div>
                      <h3 className="font-bold text-base">{selectedCollectivoStopInfo.name}</h3>
                    </div>
                    <p className="text-sm mb-1">Route: {selectedCollectivoStopInfo.routeName}</p>
                    <p className="text-xs">Fare: {selectedCollectivoStopInfo.fare}</p>
                    {selectedCollectivoStopInfo.description && (
                      <p className="text-xs mt-1">{selectedCollectivoStopInfo.description}</p>
                    )}
                  </div>
                </InfoWindow>
              )}

              {/* We've removed the regular route polylines since we've moved all routes to collectivos */}

              {/* We've moved all routes to collectivos, so we don't need to render these stops separately */}

              {/* Removed real-time bus tracking for collectivos */}

              {/* Reset button - only show when something is selected */}
              {(selectedCollectivoRoute || selectedTerminal || selectedTerminalInfo || selectedCollectivoStopInfo) && (
                <div
                  className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm p-2 rounded-full border border-primary/20 shadow-glow cursor-pointer hover:bg-background/90 transition-colors"
                  onClick={resetMap}
                  title="Reset Map"
                >
                  <X className="h-5 w-5 text-primary" />
                </div>
              )}

              {/* User location marker */}
              {showUserLocation && userLocation && (
                <Marker
                  position={{
                    lat: userLocation[0],
                    lng: userLocation[1]
                  }}
                  icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: '#4285F4',
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#FFFFFF',
                  }}
                  title="Your Location"
                />
              )}

              {/* Info Window for selected marker */}
              {selectedMarker && (
                <InfoWindow
                  position={{
                    lat: selectedMarker.location[0],
                    lng: selectedMarker.location[1]
                  }}
                  onCloseClick={handleInfoWindowClose}
                >
                  <div className="p-2">
                    <h3 className="font-bold text-sm">{selectedMarker.name}</h3>
                    <p className="text-xs text-gray-600">
                      Coordinates: {selectedMarker.location[0].toFixed(4)}, {selectedMarker.location[1].toFixed(4)}
                    </p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          )}
        </div>
      </div>

      {/* We've removed the route details panel since we've moved all routes to collectivos */}
    </div>
  );
};

export default TransitMap;






