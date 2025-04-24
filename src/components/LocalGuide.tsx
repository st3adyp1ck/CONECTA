import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Calendar, Info, Search, Palmtree, Mountain, Compass, Heart, Share2, ExternalLink, Tag, Navigation, Locate, Map as MapIcon } from "lucide-react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";

interface GuideItem {
  id: string;
  title: string;
  description: string;
  image: string;
  type: "event" | "place";
  rating: number;
  location: string;
  date?: string;
  tags: string[];
  coordinates?: [number, number]; // [latitude, longitude]
}

// Define the center for San Cristobal de las Casas, Chiapas
const SAN_CRISTOBAL_CENTER = {
  lat: 16.7370,
  lng: -92.6376
};

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const LocalGuide = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<GuideItem | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [animatedItems, setAnimatedItems] = useState<string[]>([]);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedMapItem, setSelectedMapItem] = useState<GuideItem | null>(null);

  // Load the Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // Add animation effect after component mounts
  useEffect(() => {
    // Stagger the animation of items
    const timer = setTimeout(() => {
      const ids = mockItems.map(item => item.id);
      setAnimatedItems(ids);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Handle item click to show on map
  const handleItemClick = (item: GuideItem) => {
    setSelectedItem(item);

    // If the item has coordinates, show it on the map
    if (item.coordinates) {
      setShowMap(true);
      setSelectedMapItem(item);

      // Center the map on the item if the map is loaded
      if (mapRef) {
        mapRef.panTo({ lat: item.coordinates[0], lng: item.coordinates[1] });
        mapRef.setZoom(17);
      }
    }
  };

  // Callback function when the map loads
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMapRef(map);
  }, []);

  // Get user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);

        // Center map on user location
        if (mapRef) {
          mapRef.panTo({ lat: latitude, lng: longitude });
          mapRef.setZoom(15);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your location. Please check your permissions.");
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  // Mock data for events and places in San Cristobal de las Casas
  const mockItems: GuideItem[] = [
    // Best Peer-Reviewed Tourism Destinations
    {
      id: "1",
      title: "Casa Na Bolom (House of the Jaguar)",
      description:
        "Museum and cultural center dedicated to preserving the Lacandon Maya culture. Former home of archaeologists Frans and Gertrude Blom, housing artifacts, maps, photographs, and textiles documenting the Lacandon people's lives. Features a library, gardens, and a cozy café with occasional cultural events.",
      image:
        "https://images.unsplash.com/photo-1582034986517-30d163aa1da9?w=600&q=80",
      type: "place",
      rating: 4.8,
      location: "Av. Vicente Guerrero 33, Barrio El Cerrillo",
      tags: ["culture", "museum", "indigenous", "history"],
      coordinates: [16.7420, -92.6330],
    },
    {
      id: "2",
      title: "Reserva Ecológica y Jardín de Orquídeas Moxviquil",
      description:
        "Ecological reserve and orchid garden spanning 37 hectares with over 400 native orchid species. Features tranquil trails through pine-oak forests, a greenhouse showcasing vibrant orchids, and paths leading to viewpoints with panoramic city views. Perfect for nature lovers and those seeking a quiet escape.",
      image:
        "https://images.unsplash.com/photo-1588432415392-51c31e877f59?w=600&q=80",
      type: "place",
      rating: 4.7,
      location: "Periférico Norte s/n, 3 km northwest of main plaza",
      tags: ["nature", "outdoors", "hiking", "conservation"],
      coordinates: [16.7550, -92.6550],
    },
    {
      id: "3",
      title: "Museo de Trajes Regionales de Sergio Castro",
      description:
        "Small, private museum run by humanitarian Sergio Castro, showcasing an extensive collection of indigenous textiles and clothing from Chiapas' Tzotzil, Tzeltal, and other communities. Each piece reflects unique weaving techniques and cultural stories, with up to 100 distinct styles displayed.",
      image:
        "https://images.unsplash.com/photo-1603123853880-a92fafb7809f?w=600&q=80",
      type: "place",
      rating: 4.9,
      location: "Calle Guadalupe Victoria 47, Barrio de la Merced",
      tags: ["culture", "textiles", "indigenous", "museum"],
      coordinates: [16.7330, -92.6390],
    },

    // Uncommonly Awesome Things to Do
    {
      id: "4",
      title: "Cacao Ceremony at Kinoki Cultural Center",
      description:
        "Experience a traditional Mayan cacao ceremony, where ceremonial-grade cacao is consumed in a guided ritual to connect with oneself and the community. Participants sit in a circle, sip cacao, and engage in meditation, chanting, or sharing stories, often accompanied by copal incense and live music.",
      image:
        "https://images.unsplash.com/photo-1610611424854-5e07032143d8?w=600&q=80",
      type: "event",
      rating: 4.8,
      location: "Kinoki Cultural Center, Calle Belisario Domínguez 5A",
      date: "2023-12-15",
      tags: ["spiritual", "culture", "indigenous", "workshop"],
      coordinates: [16.7380, -92.6390],
    },
    {
      id: "5",
      title: "Explore Street Art and Zapatista Murals in Oventic",
      description:
        "Visit Oventic, a Zapatista-run autonomous village 30 km north of San Cristóbal, featuring vibrant murals depicting the 1994 Zapatista uprising and indigenous struggles. This semi-independent community offers a rare glimpse into Zapatista culture, with street art, small museums, and cooperative shops selling handmade crafts.",
      image:
        "https://images.unsplash.com/photo-1567784177951-6fa58317e16b?w=600&q=80",
      type: "place",
      rating: 4.6,
      location: "Oventic, 30 km north of San Cristobal",
      tags: ["culture", "art", "political", "indigenous"],
    },
    {
      id: "6",
      title: "Rock Climbing at La Roca Sala de Escalada",
      description:
        "San Cristóbal's only indoor climbing gym, offering bouldering and top-rope walls with routes for beginners to advanced climbers. Located in a converted warehouse, it's run by a passionate local community, fostering a laid-back vibe where you can meet like-minded travelers and locals.",
      image:
        "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600&q=80",
      type: "place",
      rating: 4.7,
      location: "Calle Tonala 15, Barrio de Mexicanos",
      tags: ["adventure", "sports", "indoor", "fitness"],
      coordinates: [16.7450, -92.6420],
    },

    // Uncommonly Known Events
    {
      id: "7",
      title: "Kinoki Documentary Screenings",
      description:
        "Monthly documentary screenings at Kinoki Cultural Center focused on Chiapas' indigenous communities, environmental issues, or Zapatista history. These intimate events feature films in Spanish (sometimes with English subtitles) followed by discussions with filmmakers or local activists.",
      image:
        "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80",
      type: "event",
      rating: 4.7,
      location: "Kinoki Cultural Center, Calle Belisario Domínguez 5A",
      date: "2023-12-10",
      tags: ["culture", "film", "education", "discussion"],
      coordinates: [16.7380, -92.6390],
    },
    {
      id: "8",
      title: "Pox Tasting Nights at La Viña de Bacco",
      description:
        "Experience pox (pronounced 'posh'), Chiapas' traditional distilled spirit made from corn and sugarcane. These low-key events feature small-batch pox from local producers, paired with tapas and stories about its cultural significance in Tzotzil rituals. Enjoy the bar's bohemian ambiance and live acoustic music.",
      image:
        "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&q=80",
      type: "event",
      rating: 4.8,
      location: "La Viña de Bacco, Real de Guadalupe 7",
      date: "2023-12-21",
      tags: ["food", "drinks", "culture", "tasting"],
      coordinates: [16.7370, -92.6350],
    },
    {
      id: "9",
      title: "Hridaya Yoga Family Workshops",
      description:
        "Holistic workshops blending yoga, meditation, and Tzotzil spiritual practices, such as copal cleansing or cacao rituals. These 3-5 hour sessions, led by local and international facilitators, focus on heart-centered practices and cultural exchange, attracting a small community of nomads and locals.",
      image:
        "https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&q=80",
      type: "event",
      rating: 4.6,
      location: "Hridaya Yoga Family, Calle Flavio A. Paniagua 33",
      date: "2023-12-17",
      tags: ["yoga", "wellness", "spiritual", "workshop"],
      coordinates: [16.7320, -92.6420],
    },

    // Original items
    {
      id: "10",
      title: "Mercado de Artesanías de Santo Domingo",
      description:
        "Vibrant market featuring indigenous crafts, textiles, and amber jewelry from local artisans. Perfect for finding authentic Chiapas souvenirs.",
      image:
        "https://images.unsplash.com/photo-1596397249129-c7a8f3dba082?w=600&q=80",
      type: "place",
      rating: 4.8,
      location: "Andador Eclesiástico",
      tags: ["market", "shopping", "crafts", "indigenous"],
      coordinates: [16.7390, -92.6365],
    },
    {
      id: "11",
      title: "Festival de la Primavera",
      description:
        "Annual spring festival celebrating indigenous culture with traditional dances, music, and food from the Tzotzil and Tzeltal communities.",
      image:
        "https://images.unsplash.com/photo-1551972873-b7e8754e8e26?w=600&q=80",
      type: "event",
      rating: 4.7,
      location: "Plaza de la Paz",
      date: "2024-03-21",
      tags: ["festival", "culture", "indigenous", "music"],
      coordinates: [16.7370, -92.6376],
    },
    {
      id: "12",
      title: "Cañón del Sumidero",
      description:
        "Spectacular canyon with towering 1000-meter walls. Take a boat tour through the emerald waters to see crocodiles, monkeys, and stunning waterfalls.",
      image:
        "https://images.unsplash.com/photo-1552201474-5056ad0c4d0c?w=600&q=80",
      type: "place",
      rating: 4.9,
      location: "30 min from San Cristobal",
      tags: ["nature", "outdoors", "wildlife", "boat tour"],
    },
    {
      id: "13",
      title: "Ceremonia Maya en San Juan Chamula",
      description:
        "Experience the unique blend of Catholic and indigenous Maya traditions in the famous church where photography is prohibited and pine needles cover the floor.",
      image:
        "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=600&q=80",
      type: "place",
      rating: 4.6,
      location: "San Juan Chamula",
      tags: ["culture", "indigenous", "spiritual", "history"],
    },
    {
      id: "14",
      title: "Festival del Chocolate",
      description:
        "Celebrate Chiapas' rich chocolate heritage with tastings, workshops, and demonstrations from local chocolatiers using ancient Maya techniques.",
      image:
        "https://images.unsplash.com/photo-1511381939415-e44015466834?w=600&q=80",
      type: "event",
      rating: 4.8,
      location: "Centro Cultural El Carmen",
      date: "2023-11-12",
      tags: ["food", "chocolate", "culture", "workshop"],
    },
    {
      id: "15",
      title: "Café Orgánico Tour",
      description:
        "Visit a local cooperative coffee farm to learn about sustainable growing practices and the importance of coffee to the region's economy.",
      image:
        "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=600&q=80",
      type: "place",
      rating: 4.7,
      location: "Outskirts of San Cristobal",
      tags: ["coffee", "organic", "tour", "sustainable"],
    },
  ];

  // Filter items based on search term and active tab
  const filteredItems = mockItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    if (activeTab === "all") return matchesSearch;
    return matchesSearch && item.type === activeTab;
  });

  // Render star ratings
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < Math.floor(rating) ? "text-primary fill-primary" : "text-muted/30"}`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Get icon based on tag
  const getTagIcon = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'hiking':
      case 'outdoors':
      case 'nature':
      case 'conservation':
        return <Mountain className="h-3 w-3" />;
      case 'food':
      case 'beer':
      case 'drinks':
      case 'chocolate':
      case 'tasting':
      case 'coffee':
        return <Heart className="h-3 w-3" />;
      case 'market':
      case 'shopping':
      case 'crafts':
        return <Tag className="h-3 w-3" />;
      case 'music':
      case 'festival':
      case 'entertainment':
      case 'film':
      case 'discussion':
        return <Palmtree className="h-3 w-3" />;
      case 'museum':
      case 'history':
      case 'textiles':
      case 'art':
      case 'political':
        return <Info className="h-3 w-3" />;
      case 'spiritual':
      case 'yoga':
      case 'wellness':
      case 'meditation':
        return <Star className="h-3 w-3" />;
      case 'adventure':
      case 'sports':
      case 'fitness':
      case 'indoor':
        return <Navigation className="h-3 w-3" />;
      case 'workshop':
      case 'education':
      case 'tour':
      case 'sustainable':
      case 'organic':
        return <Calendar className="h-3 w-3" />;
      default:
        return <Compass className="h-3 w-3" />;
    }
  };

  return (
    <div className="w-full h-full bg-background p-6 overflow-auto rounded-lg shadow-soft border border-primary/10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10 text-primary hidden sm:flex">
            <Palmtree className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2 tracking-tight">Local Guide</h1>
            <p className="text-muted-foreground">
              Discover peer-reviewed destinations, uncommonly awesome activities, and unique events in San Cristobal
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search events, places, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/80 backdrop-blur-sm border-border/50 focus-visible:ring-primary/30 focus-visible:border-primary/30 rounded-full"
            />
          </div>
          <Tabs
            defaultValue="all"
            className="w-full md:w-auto"
            onValueChange={setActiveTab}
          >
            <TabsList className="bg-background/80 backdrop-blur-sm p-1 rounded-full">
              <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Compass className="h-4 w-4 mr-2" />
                All
              </TabsTrigger>
              <TabsTrigger value="event" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                Events
              </TabsTrigger>
              <TabsTrigger value="place" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                Places
              </TabsTrigger>
              <TabsTrigger
                value="map"
                className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                onClick={() => setShowMap(true)}
              >
                <MapIcon className="h-4 w-4 mr-2" />
                Map View
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {activeTab === "map" ? (
          <div className="h-[450px] md:h-[600px] relative rounded-lg overflow-hidden border border-primary/10 shadow-soft">
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
                    <Compass className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
                  </div>
                  <p className="mt-6 text-muted-foreground font-medium">Loading map...</p>
                </div>
              </div>
            )}

            {isLoaded && (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={SAN_CRISTOBAL_CENTER}
                zoom={14}
                onLoad={onMapLoad}
                options={{
                  fullscreenControl: false,
                  streetViewControl: false,
                  mapTypeControl: true,
                  zoomControl: true,
                }}
              >
                {/* Render markers for all items with coordinates */}
                {filteredItems.map(item => {
                  if (!item.coordinates) return null;

                  const isSelected = selectedMapItem?.id === item.id;

                  return (
                    <Marker
                      key={item.id}
                      position={{
                        lat: item.coordinates[0],
                        lng: item.coordinates[1]
                      }}
                      icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: isSelected ? 10 : 8,
                        fillColor: item.type === "event" ? "#FF5733" : "#33A1FF",
                        fillOpacity: isSelected ? 1 : 0.7,
                        strokeWeight: isSelected ? 3 : 2,
                        strokeColor: '#FFFFFF',
                      }}
                      title={item.title}
                      onClick={() => handleItemClick(item)}
                    />
                  );
                })}

                {/* User location marker */}
                {userLocation && (
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

                {/* Info window for selected item */}
                {selectedMapItem && (
                  <InfoWindow
                    position={{
                      lat: selectedMapItem.coordinates![0],
                      lng: selectedMapItem.coordinates![1]
                    }}
                    onCloseClick={() => setSelectedMapItem(null)}
                  >
                    <div className="p-2 max-w-xs">
                      <h3 className="font-bold text-sm">{selectedMapItem.title}</h3>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {selectedMapItem.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          {renderRating(selectedMapItem.rating)}
                        </div>
                        <Badge variant={selectedMapItem.type === "event" ? "default" : "secondary"} className="text-xs">
                          {selectedMapItem.type === "event" ? "Event" : "Place"}
                        </Badge>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            )}

            {/* Map controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-9 w-9 bg-background/80 backdrop-blur-sm hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                onClick={getUserLocation}
              >
                <Locate className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-background/50 backdrop-blur-sm rounded-lg border border-border/50">
            <div className="p-4 rounded-full bg-muted/50 w-16 h-16 mx-auto flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-serif font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Try a different search term or browse all categories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Dialog key={item.id}>
                <DialogTrigger asChild>
                  <Card
                    featured={item.rating >= 4.8}
                    className={`overflow-hidden cursor-pointer card-hover-effect border-transparent ${animatedItems.includes(item.id) ? 'animate-fade-in' : 'opacity-0'}`}
                    style={{ animationDelay: `${parseInt(item.id) * 100}ms` }}
                  >
                    <div className="aspect-video w-full overflow-hidden relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="featured-image"
                      />
                      <div className="featured-image-overlay"></div>
                      <Badge
                        variant={item.type === "event" ? "default" : item.rating >= 4.8 ? "featured" : "secondary"}
                        className="absolute top-3 right-3 shadow-md"
                      >
                        {item.type === "event" ? "Event" : "Place"}
                      </Badge>
                      {item.rating >= 4.8 && (
                        <Badge
                          variant="featured"
                          className="absolute top-3 left-3 shadow-md"
                        >
                          Top Rated
                        </Badge>
                      )}
                    </div>
                    <CardHeader className="pb-2 relative -mt-6">
                      <div className="bg-background/95 backdrop-blur-sm p-4 rounded-t-lg shadow-soft">
                        <CardTitle featured={item.rating >= 4.8} className="text-xl font-serif">{item.title}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">
                          {item.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardFooter className="pt-0 flex justify-between items-center bg-background/95 backdrop-blur-sm p-4 rounded-b-lg">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1 text-secondary" />
                        {item.location}
                      </div>
                      {renderRating(item.rating)}
                    </CardFooter>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl bg-background/95 backdrop-blur-sm border-primary/10">
                  <DialogHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10 text-primary">
                        {item.type === "event" ? <Calendar className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
                      </div>
                      <div>
                        <DialogTitle className="text-2xl font-serif">{item.title}</DialogTitle>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge
                            variant={
                              item.type === "event" ? "default" : "secondary"
                            }
                            className="shadow-sm"
                          >
                            {item.type === "event" ? "Event" : "Place"}
                          </Badge>
                          {renderRating(item.rating)}
                        </div>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="aspect-video overflow-hidden rounded-lg shadow-soft relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-3 right-3 flex gap-2">
                        <Button size="icon" variant="outline" className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border-white/20 shadow-md hover:bg-primary/20 hover:text-primary">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline" className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border-white/20 shadow-md hover:bg-primary/20 hover:text-primary">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Card className="bg-background/50 backdrop-blur-sm border-primary/10 shadow-soft mb-4">
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2 flex items-center text-lg">
                            <Info className="h-4 w-4 mr-2 text-primary" />
                            About
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {item.description}
                          </p>
                        </CardContent>
                      </Card>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card className="bg-background/50 backdrop-blur-sm border-primary/10 shadow-soft overflow-hidden">
                          <div className="h-1 bg-secondary/80"></div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold mb-2 flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-secondary" />
                              Location
                            </h3>
                            <p className="text-muted-foreground">{item.location}</p>
                          </CardContent>
                        </Card>

                        {item.date && (
                          <Card className="bg-background/50 backdrop-blur-sm border-primary/10 shadow-soft overflow-hidden">
                            <div className="h-1 bg-primary/80"></div>
                            <CardContent className="p-4">
                              <h3 className="font-semibold mb-2 flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-primary" />
                                Date
                              </h3>
                              <p className="text-muted-foreground">
                                {new Date(item.date).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </CardContent>
                          </Card>
                        )}
                      </div>

                      <div className="mt-4">
                        <h3 className="font-semibold mb-2 flex items-center">
                          <Tag className="h-4 w-4 mr-2 text-accent-foreground" />
                          Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="flex items-center gap-1 bg-background/50 backdrop-blur-sm hover:bg-accent/10 transition-colors cursor-pointer">
                              {getTagIcon(tag)}
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="mt-6 gap-2">
                    <Button variant="outline" className="rounded-full">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button
                      className="rounded-full bg-primary hover:bg-primary/90 shadow-md hover:shadow-glow transition-all duration-300"
                      onClick={() => {
                        if (item.type === "place" && item.coordinates) {
                          setActiveTab("map");
                          handleItemClick(item);
                        } else if (item.type === "event" && item.date) {
                          // Add to calendar functionality would go here
                          alert("Calendar integration coming soon!");
                        }
                      }}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {item.type === "event"
                        ? "Add to Calendar"
                        : "Get Directions"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalGuide;
