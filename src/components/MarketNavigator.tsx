import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Star,
  Search,
  MapPin,
  Navigation,
  ChevronRight,
  ArrowRight,
  ShoppingBag,
  Coffee,
  Utensils,
  Shirt,
  Gem,
  PenTool,
  Heart,
  Share2,
  Clock,
  Calendar,
  Locate,
  Compass,
} from "lucide-react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";

// Language translations
const translations = {
  en: {
    title: "Local Markets",
    subtitle: "Discover the traditional and artisanal markets of San Cristobal",
    searchPlaceholder: "Search markets or vendors...",
    marketsTab: "Markets",
    vendorsTab: "Vendors",
    allFilter: "All",
    indigenousFilter: "Indigenous",
    sustainableFilter: "Sustainable",
    amberFilter: "Amber",
    textilesFilter: "Textiles",
    coffeeFilter: "Coffee",
    localFilter: "Local",
    foodFilter: "Food",
    craftsFilter: "Crafts",
    tianguisFilter: "Tianguis",
    sweetsFilter: "Sweets",
    wholesaleFilter: "Wholesale",
    organicFilter: "Organic",
    selectedBadge: "Selected",
    noMarketsFound: "No markets found",
    tryAgain: "Try another search or remove active filters.",
    noVendorsFound: "No vendors found",
    welcomeTitle: "Markets of San Cristobal",
    welcomeDescription: "Discover the colorful traditional and artisanal markets of San Cristobal de las Casas, where you can find everything from indigenous textiles and amber to organic products and specialty coffee.",
    selectMarket: "Select a market from the list to explore its vendors",
    welcomeTo: "Welcome to",
    selectVendor: "Select a vendor from the list to navigate",
    followArrow: "Follow the arrow to find this vendor",
    rateButton: "Rate",
    shareButton: "Share",
    rating: "Rating",
    location: "Location",
    schedule: "Schedule",
    days: "Days",
    specialty: "Specialty",
    yourOpinion: "Your Opinion",
    reviewPlaceholder: "Share your experience with this vendor...",
    submitReview: "Submit Review",
    featuredVendor: "Featured Vendor",
    findAtMarkets: "Find at Local Markets",
  },
  es: {
    title: "Mercados Locales",
    subtitle: "Descubre los mercados tradicionales y artesanales de San Cristóbal",
    searchPlaceholder: "Buscar mercados o vendedores...",
    marketsTab: "Mercados",
    vendorsTab: "Vendedores",
    allFilter: "Todos",
    indigenousFilter: "Indígena",
    sustainableFilter: "Sostenible",
    amberFilter: "Ámbar",
    textilesFilter: "Textiles",
    coffeeFilter: "Café",
    localFilter: "Local",
    foodFilter: "Comida",
    craftsFilter: "Artesanías",
    tianguisFilter: "Tianguis",
    sweetsFilter: "Dulces",
    wholesaleFilter: "Mayorista",
    organicFilter: "Orgánico",
    selectedBadge: "Seleccionado",
    noMarketsFound: "No se encontraron mercados",
    tryAgain: "Intenta con otra búsqueda o elimina los filtros activos.",
    noVendorsFound: "No se encontraron vendedores",
    welcomeTitle: "Mercados de San Cristóbal",
    welcomeDescription: "Descubre los coloridos mercados tradicionales y artesanales de San Cristóbal de las Casas, donde puedes encontrar desde textiles indígenas y ámbar hasta productos orgánicos y café de especialidad.",
    selectMarket: "Selecciona un mercado de la lista para explorar sus vendedores",
    welcomeTo: "Bienvenido a",
    selectVendor: "Selecciona un vendedor de la lista para navegar",
    followArrow: "Sigue la flecha para encontrar este vendedor",
    rateButton: "Calificar",
    shareButton: "Compartir",
    rating: "Calificación",
    location: "Ubicación",
    schedule: "Horario",
    days: "Días",
    specialty: "Especialidad",
    yourOpinion: "Tu Opinión",
    reviewPlaceholder: "Comparte tu experiencia con este vendedor...",
    submitReview: "Enviar Opinión",
    featuredVendor: "Vendedor Destacado",
    findAtMarkets: "Encontrar en Mercados Locales",
  }
};

interface Vendor {
  id: string;
  name: string;
  category: string;
  description: string;
  rating: number;
  location: string;
  image: string;
  indigenous?: boolean;
  sustainable?: boolean;
  specialty?: string;
  priceRange?: string;
  openHours?: string;
  tags?: string[];
  coordinates?: [number, number]; // [latitude, longitude]
}

interface Market {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  openDays: string;
  openHours: string;
  specialty?: string;
  tags: string[];
  vendors: Vendor[];
  coordinates: [number, number]; // [latitude, longitude]
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
  minHeight: '400px', // Ensure minimum height on all devices
};

const MarketNavigator = () => {
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [animatedItems, setAnimatedItems] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

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

  // Update language when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const newLanguage = localStorage.getItem('language') || 'en';
      setLanguage(newLanguage);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Get translations for current language
  const t = translations[language as keyof typeof translations] || translations.en;

  // Add animation effect after component mounts
  useEffect(() => {
    // Stagger the animation of items
    const timer = setTimeout(() => {
      const ids = markets.map(market => market.id);
      setAnimatedItems(ids);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Get icon based on category
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food':
      case 'comida':
        return <Utensils className="h-4 w-4" />;
      case 'crafts':
      case 'artesanías':
        return <PenTool className="h-4 w-4" />;
      case 'textiles':
      case 'ropa':
        return <Shirt className="h-4 w-4" />;
      case 'coffee':
      case 'café':
        return <Coffee className="h-4 w-4" />;
      case 'jewelry':
      case 'joyería':
        return <Gem className="h-4 w-4" />;
      default:
        return <ShoppingBag className="h-4 w-4" />;
    }
  };

  // Get localized market data based on current language
  const getLocalizedMarkets = () => {
    const marketsData = {
      en: [
        {
          id: "1",
          name: "Municipal Market (Mercado del Centro)",
          location: "Between Calle Utrilla and Belisario Domínguez",
          description:
            "The heart of San Cristóbal's market scene, this vibrant and colorful market is a sensory delight. It offers everything from fresh fruits and vegetables to traditional Chiapanecan dishes like tamales and pozol. The bustling atmosphere, filled with locals and vendors, makes it a must-visit for anyone wanting to experience the city's culture firsthand.",
          image:
            "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
          openDays: "Monday to Sunday",
          openHours: "7:00 - 18:00",
          specialty: "General market, food, local cuisine",
          tags: ["local", "food", "produce", "authentic"],
          coordinates: [16.7380, -92.6410], // [latitude, longitude]
        },
        {
          id: "2",
          name: "Merposur",
          location: "South zone of the city",
          description:
            "Merposur is the go-to market for locals seeking the best prices and widest variety of products. As the main wholesale market in San Cristóbal, it attracts buyers from across the region. The atmosphere is lively and authentic, offering a true taste of local commercial life.",
          image:
            "https://images.unsplash.com/photo-1605448211038-e5b4c1f0e61b?w=800&q=80",
          openDays: "Monday to Sunday",
          openHours: "6:00 - 17:00",
          specialty: "General market, wholesale, food",
          tags: ["wholesale", "local", "food", "produce"],
          coordinates: [16.7290, -92.6380], // [latitude, longitude]
        },
        {
          id: "3",
          name: "Mercaltos",
          location: "Near the Terminal de Transporte",
          description:
            "Praised for its variety, cleanliness, and competitive prices, Mercaltos offers a well-organized and pleasant shopping experience. Visitors can find a wide range of products, from fresh produce to household items. Its proximity to the bus terminal makes it convenient for travelers.",
          image:
            "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80",
          openDays: "Monday to Sunday",
          openHours: "7:00 - 18:00",
          specialty: "General market",
          tags: ["organized", "clean", "general", "convenient"],
          coordinates: [16.7320, -92.6450], // [latitude, longitude]
        },
        {
          id: "4",
          name: "Mercado Norte",
          location: "Near Colonia Palestima",
          description:
            "As the largest market in terms of size, Mercado Norte provides a spacious shopping environment. However, it is known for having less variety and higher prices compared to other markets. While it may not offer the same vibrant atmosphere as others, it still provides an authentic local experience.",
          image:
            "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80",
          openDays: "Monday to Sunday",
          openHours: "7:00 - 17:00",
          specialty: "General market, food",
          tags: ["spacious", "local", "food", "general"],
          coordinates: [16.7450, -92.6390], // [latitude, longitude]
        },
        {
          id: "5",
          name: "Mercado de San Francisco",
          location: "On Calle Insurgentes, next to the San Francisco church",
          description:
            "This covered market is a treasure trove of handmade textiles and traditional Chiapanecan sweets. It's a great spot for finding unique souvenirs, such as woven fabrics and regional delicacies. The market has a tourist-friendly atmosphere while maintaining its authenticity.",
          image:
            "https://images.unsplash.com/photo-1596397249129-c7a8f3dba082?w=800&q=80",
          openDays: "Monday to Sunday",
          openHours: "9:00 - 19:00",
          specialty: "Crafts, textiles, local sweets",
          tags: ["crafts", "textiles", "sweets", "souvenirs"],
          coordinates: [16.7360, -92.6380], // [latitude, longitude]
        },
        {
          id: "6",
          name: "Mercado de Santo Domingo",
          location: "Near the Santo Domingo church",
          description:
            "Similar to Mercado de San Francisco, this market offers a variety of handmade goods, including textiles, jewelry, and sculptures. It's another excellent destination for craft enthusiasts and those looking to support local artisans. The market's proximity to the iconic Santo Domingo church adds to its charm.",
          image:
            "https://images.unsplash.com/photo-1596397249129-c7a8f3dba082?w=800&q=80",
          openDays: "Monday to Sunday",
          openHours: "9:00 - 20:00",
          specialty: "Crafts",
          tags: ["crafts", "textiles", "amber", "indigenous"],
          coordinates: [16.7390, -92.6365], // [latitude, longitude]
        },
        {
          id: "7",
          name: "Mercado de Dulces y Artesanías",
          location: "City center",
          description:
            "A hidden gem for those with a sweet tooth and an appreciation for handmade crafts. This market offers a delightful selection of traditional Chiapanecan sweets, such as candied fruits and coconut bars, alongside unique artisanal products. Perfect for visitors seeking a quieter, more specialized shopping experience.",
          image:
            "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=800&q=80",
          openDays: "Monday to Saturday",
          openHours: "10:00 - 18:00",
          specialty: "Sweets and crafts",
          tags: ["sweets", "crafts", "artisanal", "specialty"],
          coordinates: [16.7370, -92.6370], // [latitude, longitude]
        },
        {
          id: "8",
          name: "Tianguis de La Hormiga",
          location: "Various locations (open-air market)",
          description:
            "This traditional tianguis offers a lively and authentic shopping experience, featuring local produce, street food, and a variety of goods. It's a fantastic way to immerse yourself in the local culture and find bargains. The dynamic atmosphere makes it a favorite among locals and adventurous travelers alike.",
          image:
            "https://images.unsplash.com/photo-1534237710431-e2fc698436d0?w=800&q=80",
          openDays: "Specific days (check locally)",
          openHours: "7:00 - 15:00",
          specialty: "Open-air market, food, general goods",
          tags: ["tianguis", "open-air", "local", "bargains"],
          coordinates: [16.7350, -92.6400], // [latitude, longitude]
        },
        {
          id: "9",
          name: "Tianguis de la calle Diego Dugelay",
          location: "On Calle Diego Dugelay",
          description:
            "Similar to other tianguis, this market provides a vibrant atmosphere with a focus on local products. It's an excellent spot for interacting with residents, discovering unique items, and experiencing the city's community spirit.",
          image:
            "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
          openDays: "Specific days (check locally)",
          openHours: "7:00 - 15:00",
          specialty: "Open-air market",
          tags: ["tianguis", "open-air", "local", "community"],
          coordinates: [16.7340, -92.6380], // [latitude, longitude]
        },
        {
          id: "10",
          name: "Tianguis del Barrio de San Diego",
          location: "In the Barrio de San Diego",
          description:
            "This neighborhood tianguis offers a community-focused shopping experience with fresh produce, handmade goods, and a friendly vibe. It's ideal for travelers looking to explore beyond the main tourist areas and connect with local life.",
          image:
            "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&q=80",
          openDays: "Specific days (check locally)",
          openHours: "7:00 - 14:00",
          specialty: "Open-air market",
          tags: ["tianguis", "neighborhood", "local", "community"],
          coordinates: [16.7330, -92.6370], // [latitude, longitude]
        },
        {
          id: "11",
          name: "Tierra Cruda Market",
          location: "El Cerrillo Neighborhood",
          description:
            "Organic and sustainable market where local producers sell organic food, specialty coffee and artisanal products. A favorite among health-conscious visitors and those interested in sustainable shopping practices.",
          image:
            "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80",
          openDays: "Wednesdays and Saturdays",
          openHours: "9:00 - 15:00",
          specialty: "Organic and sustainable products",
          tags: ["organic", "sustainable", "coffee", "vegan"],
          coordinates: [16.7350, -92.6395], // [latitude, longitude]
        }
      ],
      es: [
        {
          id: "1",
          name: "Mercado Municipal (Mercado del Centro)",
          location: "Entre Calle Utrilla y Belisario Domínguez",
          description:
            "El corazón de la escena de mercados de San Cristóbal, este mercado vibrante y colorido es un deleite sensorial. Ofrece de todo, desde frutas y verduras frescas hasta platos tradicionales chiapanecos como tamales y pozol. El ambiente bullicioso, lleno de locales y vendedores, lo convierte en una visita obligada para cualquiera que quiera experimentar la cultura de la ciudad de primera mano.",
          image:
            "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
          openDays: "Lunes a Domingo",
          openHours: "7:00 - 18:00",
          specialty: "Mercado general, comida, cocina local",
          tags: ["local", "food", "produce", "authentic"],
          coordinates: [16.7380, -92.6410], // [latitude, longitude]
        },
        {
          id: "2",
          name: "Merposur",
          location: "Zona sur de la ciudad",
          description:
            "Merposur es el mercado preferido por los locales que buscan los mejores precios y la mayor variedad de productos. Como principal mercado mayorista de San Cristóbal, atrae a compradores de toda la región. El ambiente es animado y auténtico, ofreciendo una verdadera muestra de la vida comercial local.",
          image:
            "https://images.unsplash.com/photo-1605448211038-e5b4c1f0e61b?w=800&q=80",
          openDays: "Lunes a Domingo",
          openHours: "6:00 - 17:00",
          specialty: "Mercado general, mayorista, comida",
          tags: ["wholesale", "local", "food", "produce"],
          coordinates: [16.7290, -92.6380], // [latitude, longitude]
        },
        {
          id: "3",
          name: "Mercaltos",
          location: "Cerca de la Terminal de Transporte",
          description:
            "Elogiado por su variedad, limpieza y precios competitivos, Mercaltos ofrece una experiencia de compra bien organizada y agradable. Los visitantes pueden encontrar una amplia gama de productos, desde productos frescos hasta artículos para el hogar. Su proximidad a la terminal de autobuses lo hace conveniente para los viajeros.",
          image:
            "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80",
          openDays: "Lunes a Domingo",
          openHours: "7:00 - 18:00",
          specialty: "Mercado general",
          tags: ["organized", "clean", "general", "convenient"],
          coordinates: [16.7320, -92.6450], // [latitude, longitude]
        },
        {
          id: "4",
          name: "Mercado Norte",
          location: "Cerca de Colonia Palestima",
          description:
            "Como el mercado más grande en términos de tamaño, Mercado Norte proporciona un ambiente de compras espacioso. Sin embargo, es conocido por tener menos variedad y precios más altos en comparación con otros mercados. Aunque puede no ofrecer el mismo ambiente vibrante que otros, todavía proporciona una experiencia local auténtica.",
          image:
            "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80",
          openDays: "Lunes a Domingo",
          openHours: "7:00 - 17:00",
          specialty: "Mercado general, comida",
          tags: ["spacious", "local", "food", "general"],
          coordinates: [16.7450, -92.6390], // [latitude, longitude]
        },
        {
          id: "5",
          name: "Mercado de San Francisco",
          location: "En Calle Insurgentes, junto a la iglesia de San Francisco",
          description:
            "Este mercado cubierto es un tesoro de textiles hechos a mano y dulces tradicionales chiapanecos. Es un gran lugar para encontrar souvenirs únicos, como tejidos y delicias regionales. El mercado tiene un ambiente amigable para los turistas mientras mantiene su autenticidad.",
          image:
            "https://images.unsplash.com/photo-1596397249129-c7a8f3dba082?w=800&q=80",
          openDays: "Lunes a Domingo",
          openHours: "9:00 - 19:00",
          specialty: "Artesanías, textiles, dulces locales",
          tags: ["crafts", "textiles", "sweets", "souvenirs"],
          coordinates: [16.7360, -92.6380], // [latitude, longitude]
        },
        {
          id: "6",
          name: "Mercado de Santo Domingo",
          location: "Cerca de la iglesia de Santo Domingo",
          description:
            "Similar al Mercado de San Francisco, este mercado ofrece una variedad de productos hechos a mano, incluyendo textiles, joyería y esculturas. Es otro excelente destino para los entusiastas de las artesanías y aquellos que buscan apoyar a los artesanos locales. La proximidad del mercado a la icónica iglesia de Santo Domingo añade a su encanto.",
          image:
            "https://images.unsplash.com/photo-1596397249129-c7a8f3dba082?w=800&q=80",
          openDays: "Lunes a Domingo",
          openHours: "9:00 - 20:00",
          specialty: "Artesanías",
          tags: ["crafts", "textiles", "amber", "indigenous"],
          coordinates: [16.7390, -92.6365], // [latitude, longitude]
        },
        {
          id: "7",
          name: "Mercado de Dulces y Artesanías",
          location: "Centro de la ciudad",
          description:
            "Una joya escondida para aquellos con un gusto por lo dulce y una apreciación por las artesanías hechas a mano. Este mercado ofrece una deliciosa selección de dulces tradicionales chiapanecos, como frutas confitadas y barras de coco, junto con productos artesanales únicos. Perfecto para visitantes que buscan una experiencia de compra más tranquila y especializada.",
          image:
            "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=800&q=80",
          openDays: "Lunes a Sábado",
          openHours: "10:00 - 18:00",
          specialty: "Dulces y artesanías",
          tags: ["sweets", "crafts", "artisanal", "specialty"],
          coordinates: [16.7370, -92.6370], // [latitude, longitude]
        },
        {
          id: "8",
          name: "Tianguis de La Hormiga",
          location: "Varias ubicaciones (mercado al aire libre)",
          description:
            "Este tianguis tradicional ofrece una experiencia de compra animada y auténtica, con productos locales, comida callejera y una variedad de mercancías. Es una manera fantástica de sumergirse en la cultura local y encontrar gangas. El ambiente dinámico lo convierte en un favorito entre los locales y viajeros aventureros por igual.",
          image:
            "https://images.unsplash.com/photo-1534237710431-e2fc698436d0?w=800&q=80",
          openDays: "Días específicos (consultar localmente)",
          openHours: "7:00 - 15:00",
          specialty: "Mercado al aire libre, comida, productos generales",
          tags: ["tianguis", "open-air", "local", "bargains"],
          coordinates: [16.7350, -92.6400], // [latitude, longitude]
        },
        {
          id: "9",
          name: "Tianguis de la calle Diego Dugelay",
          location: "En la calle Diego Dugelay",
          description:
            "Similar a otros tianguis, este mercado proporciona un ambiente vibrante con un enfoque en productos locales. Es un excelente lugar para interactuar con residentes, descubrir artículos únicos y experimentar el espíritu comunitario de la ciudad.",
          image:
            "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
          openDays: "Días específicos (consultar localmente)",
          openHours: "7:00 - 15:00",
          specialty: "Mercado al aire libre",
          tags: ["tianguis", "open-air", "local", "community"],
          coordinates: [16.7340, -92.6380], // [latitude, longitude]
        },
        {
          id: "10",
          name: "Tianguis del Barrio de San Diego",
          location: "En el Barrio de San Diego",
          description:
            "Este tianguis de barrio ofrece una experiencia de compra centrada en la comunidad con productos frescos, artículos hechos a mano y un ambiente amigable. Es ideal para viajeros que buscan explorar más allá de las principales áreas turísticas y conectar con la vida local.",
          image:
            "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&q=80",
          openDays: "Días específicos (consultar localmente)",
          openHours: "7:00 - 14:00",
          specialty: "Mercado al aire libre",
          tags: ["tianguis", "neighborhood", "local", "community"],
          coordinates: [16.7330, -92.6370], // [latitude, longitude]
        },
        {
          id: "11",
          name: "Mercado Tierra Cruda",
          location: "Barrio El Cerrillo",
          description:
            "Mercado orgánico y sostenible donde productores locales venden alimentos orgánicos, café de especialidad y productos artesanales. Un favorito entre los visitantes conscientes de la salud y aquellos interesados en prácticas de compra sostenibles.",
          image:
            "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80",
          openDays: "Miércoles y Sábados",
          openHours: "9:00 - 15:00",
          specialty: "Productos orgánicos y sostenibles",
          tags: ["organic", "sustainable", "coffee", "vegan"],
          coordinates: [16.7350, -92.6395], // [latitude, longitude]
        }
      ]
    };

    return marketsData[language as keyof typeof marketsData] || marketsData.en;
  };

  // Get localized vendor data based on market ID and current language
  const getLocalizedVendors = (marketId: string) => {
    const vendorsData = {
      en: {
        "1": [
          {
            id: "101",
            name: "Don Pedro's Fruits & Vegetables",
            category: "Produce",
            description: "Fresh fruits and vegetables from the Chiapas region.",
            rating: 4.6,
            location: "Section A, Stall 12",
            image:
              "https://images.unsplash.com/photo-1573246123716-6b1782bfc499?w=400&q=80",
            indigenous: true,
            sustainable: true,
            priceRange: "$",
            tags: ["organic", "local", "indigenous"],
            coordinates: [16.7382, -92.6412],
          },
          {
            id: "102",
            name: "Doña Lupita's Kitchen",
            category: "Food",
            description: "Traditional Chiapas cuisine with family recipes passed down through generations.",
            rating: 4.8,
            location: "Section B, Stall 5",
            image:
              "https://images.unsplash.com/photo-1562059390-a761a084768e?w=400&q=80",
            indigenous: true,
            specialty: "Bread soup and Chiapas tamales",
            priceRange: "$",
            openHours: "8:00 - 16:00",
            tags: ["traditional", "local", "authentic"],
            coordinates: [16.7378, -92.6408],
          },
          {
            id: "103",
            name: "Maya Herbs & Spices",
            category: "Spices",
            description: "Medicinal herbs, spices, and traditional remedies from Mayan culture.",
            rating: 4.7,
            location: "Section C, Stall 8",
            image:
              "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=400&q=80",
            indigenous: true,
            sustainable: true,
            specialty: "Medicinal herbs",
            tags: ["medicinal", "traditional", "maya"],
          },
        ],
        "2": [
          {
            id: "201",
            name: "Zinacantán Textiles",
            category: "Textiles",
            description: "Traditional handmade textiles by women from Zinacantán with colorful embroidery and unique designs.",
            rating: 4.9,
            location: "North Corridor, Stall 3",
            image:
              "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
            indigenous: true,
            sustainable: true,
            specialty: "Embroidered blouses and shawls",
            priceRange: "$$",
            tags: ["handmade", "indigenous", "traditional"],
          },
          {
            id: "202",
            name: "Chiapas Amber",
            category: "Jewelry",
            description: "Authentic Chiapas amber jewelry, known for its quality and unique beauty.",
            rating: 4.8,
            location: "South Corridor, Stall 7",
            image:
              "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&q=80",
            specialty: "Blue and green amber",
            priceRange: "$$$",
            tags: ["amber", "jewelry", "premium"],
          },
          {
            id: "203",
            name: "Clay Crafts",
            category: "Crafts",
            description: "Handmade clay figures and utensils following ancestral techniques.",
            rating: 4.6,
            location: "Central Corridor, Stall 12",
            image:
              "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&q=80",
            indigenous: true,
            sustainable: true,
            priceRange: "$$",
            tags: ["pottery", "clay", "handmade"],
          },
        ],
        "3": [
          {
            id: "301",
            name: "Highland Coffee",
            category: "Coffee",
            description: "Specialty coffee grown in the mountains of Chiapas by indigenous cooperatives.",
            rating: 4.9,
            location: "North Zone, Stall 2",
            image:
              "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&q=80",
            indigenous: true,
            sustainable: true,
            specialty: "Artisanally roasted specialty coffee",
            priceRange: "$$",
            tags: ["specialty coffee", "organic", "fair trade"],
          },
          {
            id: "302",
            name: "Multifloral Honey",
            category: "Food",
            description: "Organic honey produced at different altitudes in Chiapas, each with unique flavors.",
            rating: 4.7,
            location: "Central Zone, Stall 5",
            image:
              "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400&q=80",
            sustainable: true,
            specialty: "Wildflower honey",
            priceRange: "$$",
            tags: ["honey", "organic", "natural"],
          },
          {
            id: "303",
            name: "Mayordomo Chocolates",
            category: "Food",
            description: "Artisanal chocolate made with organic Chiapas cacao following traditional Mayan recipes.",
            rating: 4.8,
            location: "South Zone, Stall 8",
            image:
              "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400&q=80",
            indigenous: true,
            sustainable: true,
            specialty: "Traditional drinking chocolate",
            priceRange: "$$",
            tags: ["chocolate", "traditional", "organic"],
          },
        ],
      },
      es: {
        "1": [
          {
            id: "101",
            name: "Frutas y Verduras Don Pedro",
            category: "Produce",
            description: "Frutas y verduras frescas de los alrededores de Chiapas.",
            rating: 4.6,
            location: "Sección A, Puesto 12",
            image:
              "https://images.unsplash.com/photo-1573246123716-6b1782bfc499?w=400&q=80",
            indigenous: true,
            sustainable: true,
            priceRange: "$",
            tags: ["organic", "local", "indigenous"],
          },
          {
            id: "102",
            name: "Comedor Doña Lupita",
            category: "Food",
            description: "Comida tradicional chiapaneca con recetas familiares que han pasado por generaciones.",
            rating: 4.8,
            location: "Sección B, Puesto 5",
            image:
              "https://images.unsplash.com/photo-1562059390-a761a084768e?w=400&q=80",
            indigenous: true,
            specialty: "Sopa de pan y tamales chiapanecos",
            priceRange: "$",
            openHours: "8:00 - 16:00",
            tags: ["traditional", "local", "authentic"],
          },
          {
            id: "103",
            name: "Especias y Hierbas Maya",
            category: "Spices",
            description: "Hierbas medicinales, especias y remedios tradicionales de la cultura maya.",
            rating: 4.7,
            location: "Sección C, Puesto 8",
            image:
              "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=400&q=80",
            indigenous: true,
            sustainable: true,
            specialty: "Hierbas medicinales",
            tags: ["medicinal", "traditional", "maya"],
          },
        ],
        "2": [
          {
            id: "201",
            name: "Textiles Zinacantán",
            category: "Textiles",
            description: "Textiles tradicionales hechos a mano por mujeres de Zinacantán con bordados coloridos y diseños únicos.",
            rating: 4.9,
            location: "Pasillo Norte, Puesto 3",
            image:
              "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
            indigenous: true,
            sustainable: true,
            specialty: "Blusas bordadas y chales",
            priceRange: "$$",
            tags: ["handmade", "indigenous", "traditional"],
          },
          {
            id: "202",
            name: "Ámbar de Chiapas",
            category: "Jewelry",
            description: "Joyería de ámbar auténtico de Chiapas, conocido por su calidad y belleza única.",
            rating: 4.8,
            location: "Pasillo Sur, Puesto 7",
            image:
              "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&q=80",
            specialty: "Ámbar azul y verde",
            priceRange: "$$$",
            tags: ["amber", "jewelry", "premium"],
          },
          {
            id: "203",
            name: "Artesanías en Barro",
            category: "Crafts",
            description: "Figuras y utensilios de barro hechos a mano siguiendo técnicas ancestrales.",
            rating: 4.6,
            location: "Pasillo Central, Puesto 12",
            image:
              "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&q=80",
            indigenous: true,
            sustainable: true,
            priceRange: "$$",
            tags: ["pottery", "clay", "handmade"],
          },
        ],
        "3": [
          {
            id: "301",
            name: "Café de Altura",
            category: "Coffee",
            description: "Café de especialidad cultivado en las montañas de Chiapas por cooperativas indígenas.",
            rating: 4.9,
            location: "Zona Norte, Puesto 2",
            image:
              "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&q=80",
            indigenous: true,
            sustainable: true,
            specialty: "Café de especialidad tostado artesanalmente",
            priceRange: "$$",
            tags: ["specialty coffee", "organic", "fair trade"],
          },
          {
            id: "302",
            name: "Miel Multifloral",
            category: "Food",
            description: "Miel orgánica producida en diferentes altitudes de Chiapas, cada una con sabores únicos.",
            rating: 4.7,
            location: "Zona Central, Puesto 5",
            image:
              "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400&q=80",
            sustainable: true,
            specialty: "Miel de flores silvestres",
            priceRange: "$$",
            tags: ["honey", "organic", "natural"],
          },
          {
            id: "303",
            name: "Chocolates Mayordomo",
            category: "Food",
            description: "Chocolate artesanal elaborado con cacao orgánico de Chiapas siguiendo recetas tradicionales mayas.",
            rating: 4.8,
            location: "Zona Sur, Puesto 8",
            image:
              "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400&q=80",
            indigenous: true,
            sustainable: true,
            specialty: "Chocolate para bebida tradicional",
            priceRange: "$$",
            tags: ["chocolate", "traditional", "organic"],
          },
        ],
      },
    };

    return vendorsData[language as keyof typeof vendorsData]?.[marketId] || [];
  };

  // Get markets based on current language
  const markets: Market[] = getLocalizedMarkets();

  // Update market objects to include localized vendors
  markets.forEach(market => {
    market.vendors = getLocalizedVendors(market.id);
  });
  const filteredMarkets = markets.filter((market) => {
    const matchesSearch =
      market.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    // If there's an active filter, check if the market has that tag
    if (activeFilter && !market.tags.includes(activeFilter)) {
      return false;
    }

    return matchesSearch;
  });

  const filteredVendors = selectedMarket?.vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vendor.tags && vendor.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));

    // If there's an active filter, check if the vendor has that tag
    if (activeFilter) {
      if (vendor.tags && vendor.tags.includes(activeFilter)) {
        return true;
      }
      if (vendor.category.toLowerCase() === activeFilter.toLowerCase()) {
        return true;
      }
      if (activeFilter === 'indigenous' && vendor.indigenous) {
        return true;
      }
      if (activeFilter === 'sustainable' && vendor.sustainable) {
        return true;
      }
      return false;
    }

    return matchesSearch;
  }) || [];

  const handleMarketSelect = (market: Market) => {
    setSelectedMarket(market);
    setSelectedVendor(null);
    setSearchQuery("");
  };

  const handleVendorSelect = (vendor: Vendor) => {
    setSelectedVendor(vendor);

    // If the vendor has coordinates, center the map on them
    if (vendor.coordinates && mapRef) {
      mapRef.panTo({ lat: vendor.coordinates[0], lng: vendor.coordinates[1] });
      mapRef.setZoom(19); // Zoom in closer to see the vendor
    }
  };

  const handleSubmitReview = () => {
    // In a real app, this would send the review to a backend
    console.log("Review submitted:", {
      vendorId: selectedVendor?.id,
      rating,
      reviewText,
    });
    setReviewDialogOpen(false);
    setRating(0);
    setReviewText("");
  };

  // Callback function when the map loads
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMapRef(map);
  }, []);

  // Get user's current location for directions
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setShowDirections(true);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your location. Please check your permissions.");
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

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

  // Render price range
  const renderPriceRange = (priceRange?: string) => {
    if (!priceRange) return null;

    return (
      <div className="text-xs text-muted-foreground">
        {priceRange === '$' ? (
          <span className="font-medium">$ <span className="opacity-30">$$</span></span>
        ) : priceRange === '$$' ? (
          <span className="font-medium">$$ <span className="opacity-30">$</span></span>
        ) : (
          <span className="font-medium">$$$</span>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-lg overflow-hidden shadow-soft border border-primary/10">
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

            <div className="pt-2">
              <Button
                className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-md hover:shadow-glow transition-all duration-300"
              >
                {t.findAtMarkets}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

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

        <div className="flex flex-wrap gap-2 mt-4">
          <Badge
            variant={activeFilter === null ? "secondary" : "outline"}
            className="cursor-pointer hover:bg-secondary/20 transition-colors"
            onClick={() => setActiveFilter(null)}
          >
            {t.allFilter}
          </Badge>
          <Badge
            variant={activeFilter === "local" ? "secondary" : "outline"}
            className="cursor-pointer hover:bg-secondary/20 transition-colors"
            onClick={() => setActiveFilter("local")}
          >
            {t.localFilter}
          </Badge>
          <Badge
            variant={activeFilter === "food" ? "secondary" : "outline"}
            className="cursor-pointer hover:bg-secondary/20 transition-colors"
            onClick={() => setActiveFilter("food")}
          >
            {t.foodFilter}
          </Badge>
          <Badge
            variant={activeFilter === "crafts" ? "secondary" : "outline"}
            className="cursor-pointer hover:bg-secondary/20 transition-colors"
            onClick={() => setActiveFilter("crafts")}
          >
            {t.craftsFilter}
          </Badge>
          <Badge
            variant={activeFilter === "tianguis" ? "secondary" : "outline"}
            className="cursor-pointer hover:bg-secondary/20 transition-colors"
            onClick={() => setActiveFilter("tianguis")}
          >
            {t.tianguisFilter}
          </Badge>
          <Badge
            variant={activeFilter === "sweets" ? "secondary" : "outline"}
            className="cursor-pointer hover:bg-secondary/20 transition-colors"
            onClick={() => setActiveFilter("sweets")}
          >
            {t.sweetsFilter}
          </Badge>
          <Badge
            variant={activeFilter === "wholesale" ? "secondary" : "outline"}
            className="cursor-pointer hover:bg-secondary/20 transition-colors"
            onClick={() => setActiveFilter("wholesale")}
          >
            {t.wholesaleFilter}
          </Badge>
          <Badge
            variant={activeFilter === "textiles" ? "secondary" : "outline"}
            className="cursor-pointer hover:bg-secondary/20 transition-colors"
            onClick={() => setActiveFilter("textiles")}
          >
            {t.textilesFilter}
          </Badge>
          <Badge
            variant={activeFilter === "organic" ? "secondary" : "outline"}
            className="cursor-pointer hover:bg-secondary/20 transition-colors"
            onClick={() => setActiveFilter("organic")}
          >
            {t.organicFilter}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t.searchPlaceholder}
            className="pl-9 bg-background/80 backdrop-blur-sm border-border/50 focus-visible:ring-primary/30 focus-visible:border-primary/30 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
          {/* Markets and Vendors List */}
          <div className="md:col-span-1 border border-primary/10 rounded-lg overflow-hidden shadow-soft bg-gradient-to-b from-background to-background/95 backdrop-blur-sm">
            <Tabs defaultValue="markets">
              <TabsList className="w-full bg-background/80 backdrop-blur-sm p-1">
                <TabsTrigger value="markets" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  {t.marketsTab}
                </TabsTrigger>
                <TabsTrigger
                  value="vendors"
                  className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  disabled={!selectedMarket}
                >
                  <Utensils className="h-4 w-4 mr-2" />
                  {t.vendorsTab}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="markets" className="p-0">
                <ScrollArea className="h-[calc(100vh-280px)]">
                  <div className="p-4 space-y-3">
                    {filteredMarkets.length > 0 ? (
                      filteredMarkets.map((market) => (
                        <Card
                          key={market.id}
                          featured={selectedMarket?.id === market.id}
                          className={`cursor-pointer card-hover-effect border-transparent overflow-hidden ${selectedMarket?.id === market.id ? "shadow-glow-lg" : ""} ${animatedItems.includes(market.id) ? 'animate-fade-in' : 'opacity-0'}`}
                          style={{ animationDelay: `${parseInt(market.id) * 100}ms` }}
                          onClick={() => handleMarketSelect(market)}
                        >
                          <div className="relative">
                            <div className="w-full h-32 overflow-hidden">
                              <img
                                src={market.image}
                                alt={market.name}
                                className="featured-image"
                              />
                              <div className="featured-image-overlay"></div>
                            </div>
                            <div className="absolute bottom-3 left-3 right-3">
                              <div className="flex flex-wrap gap-1">
                                {market.tags.map(tag => (
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
                              <CardTitle featured={selectedMarket?.id === market.id} className="text-lg">{market.name}</CardTitle>
                              {selectedMarket?.id === market.id && (
                                <Badge variant="featured" className="ml-2">
                                  {t.selectedBadge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center mb-2">
                              <MapPin size={14} className="mr-1 text-secondary" />
                              {market.location}
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {market.openHours}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {market.openDays}
                              </span>
                            </div>
                            <p className="text-xs line-clamp-2 text-muted-foreground">
                              {market.description}
                            </p>
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
              </TabsContent>

              <TabsContent value="vendors" className="p-0">
                {selectedMarket && (
                  <ScrollArea className="h-[calc(100vh-280px)]">
                    <div className="p-4 space-y-3">
                      {filteredVendors.length > 0 ? (
                        filteredVendors.map((vendor) => (
                          <Card
                            key={vendor.id}
                            featured={selectedVendor?.id === vendor.id}
                            className={`cursor-pointer card-hover-effect border-transparent overflow-hidden ${selectedVendor?.id === vendor.id ? "shadow-glow-lg" : ""}`}
                            onClick={() => handleVendorSelect(vendor)}
                          >
                            <div className="h-1" style={{ backgroundColor: vendor.indigenous ? "#33FF57" : vendor.sustainable ? "#33A1FF" : "#FF5733" }}></div>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-md overflow-hidden shadow-lg">
                                  <img
                                    src={vendor.image}
                                    alt={vendor.name}
                                    className="featured-image"
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <CardTitle featured={selectedVendor?.id === vendor.id}>{vendor.name}</CardTitle>
                                    <Badge variant="outline" className="flex items-center gap-1 bg-background/50">
                                      {getCategoryIcon(vendor.category)}
                                      {language === 'es' ? vendor.category :
                                        vendor.category === 'Produce' ? 'Produce' :
                                          vendor.category === 'Food' ? 'Food' :
                                            vendor.category === 'Spices' ? 'Spices' :
                                              vendor.category === 'Textiles' ? 'Textiles' :
                                                vendor.category === 'Jewelry' ? 'Jewelry' :
                                                  vendor.category === 'Crafts' ? 'Crafts' :
                                                    vendor.category === 'Coffee' ? 'Coffee' : vendor.category
                                      }
                                    </Badge>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      {renderStars(vendor.rating)}
                                    </div>
                                    {renderPriceRange(vendor.priceRange)}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-2 flex items-center">
                                    <MapPin size={12} className="mr-1 text-secondary" />
                                    {vendor.location}
                                  </p>
                                </div>
                              </div>

                              {(vendor.indigenous || vendor.sustainable || vendor.specialty) && (
                                <div className="mt-3 pt-3 border-t border-border/30 flex flex-wrap gap-2">
                                  {vendor.indigenous && (
                                    <Badge variant="outline" className="bg-[#33FF57]/10 text-[#33FF57] border-[#33FF57]/30">
                                      {t.indigenousFilter}
                                    </Badge>
                                  )}
                                  {vendor.sustainable && (
                                    <Badge variant="outline" className="bg-[#33A1FF]/10 text-[#33A1FF] border-[#33A1FF]/30">
                                      {t.sustainableFilter}
                                    </Badge>
                                  )}
                                  {vendor.specialty && (
                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                                      {t.specialty}: {vendor.specialty}
                                    </Badge>
                                  )}
                                </div>
                              )}
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
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Market Map and Navigation */}
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
                          <Compass className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
                        </div>
                        <p className="mt-6 text-muted-foreground font-medium">Loading map...</p>
                      </div>
                    </div>
                  )}

                  {isLoaded && (
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={selectedMarket ?
                        { lat: selectedMarket.coordinates[0], lng: selectedMarket.coordinates[1] } :
                        SAN_CRISTOBAL_CENTER}
                      zoom={selectedVendor ? 19 : 16}
                      onLoad={onMapLoad}
                      options={{
                        fullscreenControl: false,
                        streetViewControl: false,
                        mapTypeControl: true,
                        zoomControl: true,
                      }}
                    >
                      {/* Render market marker */}
                      {selectedMarket && (
                        <Marker
                          position={{
                            lat: selectedMarket.coordinates[0],
                            lng: selectedMarket.coordinates[1]
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

                      {/* Render vendor markers */}
                      {selectedMarket && selectedMarket.vendors.map(vendor => {
                        if (!vendor.coordinates) return null;

                        const isSelected = selectedVendor?.id === vendor.id;
                        const vendorColor = vendor.indigenous ? "#33FF57" :
                          vendor.sustainable ? "#33A1FF" : "#FF5733";

                        return (
                          <Marker
                            key={vendor.id}
                            position={{
                              lat: vendor.coordinates[0],
                              lng: vendor.coordinates[1]
                            }}
                            icon={{
                              path: window.google.maps.SymbolPath.CIRCLE,
                              scale: isSelected ? 10 : 8,
                              fillColor: vendorColor,
                              fillOpacity: isSelected ? 1 : 0.7,
                              strokeWeight: isSelected ? 3 : 2,
                              strokeColor: '#FFFFFF',
                            }}
                            title={vendor.name}
                            onClick={() => handleVendorSelect(vendor)}
                          />
                        );
                      })}

                      {/* User location marker for directions */}
                      {showDirections && userLocation && (
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
                    </GoogleMap>
                  )}

                  {/* Vendor Info Panel */}
                  {selectedVendor && (
                    <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg border border-primary/10 shadow-soft p-4 animate-fade-in">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                          <img
                            src={selectedVendor.image}
                            alt={selectedVendor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-lg">{selectedVendor.name}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="flex items-center gap-1 bg-background/50">
                              {getCategoryIcon(selectedVendor.category)}
                              {selectedVendor.category}
                            </Badge>
                            {renderStars(selectedVendor.rating)}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full h-9 w-9 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                          onClick={getUserLocation}
                        >
                          <Navigation className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Dialog
                          open={reviewDialogOpen}
                          onOpenChange={setReviewDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" className="rounded-full text-xs h-8" size="sm">
                              <Star className="mr-1 h-3 w-3" />
                              {t.rateButton}
                            </Button>
                          </DialogTrigger>
                        </Dialog>

                        <Button className="rounded-full text-xs h-8" size="sm" variant="secondary">
                          <Share2 className="mr-1 h-3 w-3" />
                          {t.shareButton}
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center" style={{ display: isLoaded ? 'none' : 'flex' }}>
                    <div className="text-center p-6 max-w-md">
                      {selectedVendor ? (
                        <div className="space-y-5 animate-fade-in">
                          <div className="relative">
                            <div className="w-36 h-36 mx-auto rounded-full overflow-hidden border-4 border-primary/20 shadow-glow">
                              <img
                                src={selectedVendor.image}
                                alt={selectedVendor.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {selectedVendor.indigenous && (
                              <Badge className="absolute bottom-0 right-1/3 bg-[#33FF57]/80 text-white border-0">
                                {t.indigenousFilter}
                              </Badge>
                            )}
                            {selectedVendor.sustainable && (
                              <Badge className="absolute bottom-0 left-1/3 bg-[#33A1FF]/80 text-white border-0">
                                {t.sustainableFilter}
                              </Badge>
                            )}
                          </div>

                          <div>
                            <h3 className="text-2xl font-serif font-bold">
                              {selectedVendor.name}
                            </h3>
                            <Badge className="mx-auto mt-2 flex items-center gap-1 justify-center bg-background/50 backdrop-blur-sm">
                              {getCategoryIcon(selectedVendor.category)}
                              {language === 'es' ? selectedVendor.category :
                                selectedVendor.category === 'Produce' ? 'Produce' :
                                  selectedVendor.category === 'Food' ? 'Food' :
                                    selectedVendor.category === 'Spices' ? 'Spices' :
                                      selectedVendor.category === 'Textiles' ? 'Textiles' :
                                        selectedVendor.category === 'Jewelry' ? 'Jewelry' :
                                          selectedVendor.category === 'Crafts' ? 'Crafts' :
                                            selectedVendor.category === 'Coffee' ? 'Coffee' : selectedVendor.category
                              }
                            </Badge>
                          </div>

                          <Card className="bg-background/50 backdrop-blur-sm border-primary/10 shadow-soft">
                            <CardContent className="p-4">
                              <p className="text-sm leading-relaxed">
                                {selectedVendor.description}
                              </p>
                            </CardContent>
                          </Card>

                          <div className="grid grid-cols-2 gap-3">
                            <Card className="bg-background/50 backdrop-blur-sm border-primary/10 shadow-soft overflow-hidden">
                              <div className="h-1 bg-primary/80"></div>
                              <CardContent className="p-3">
                                <p className="text-xs font-medium text-muted-foreground mb-1">{t.rating}</p>
                                <div className="flex justify-center">
                                  {renderStars(selectedVendor.rating)}
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="bg-background/50 backdrop-blur-sm border-primary/10 shadow-soft overflow-hidden">
                              <div className="h-1 bg-secondary/80"></div>
                              <CardContent className="p-3">
                                <p className="text-xs font-medium text-muted-foreground mb-1">{t.location}</p>
                                <p className="flex items-center justify-center text-sm font-medium">
                                  <MapPin size={14} className="mr-1 text-secondary" />
                                  {selectedVendor.location}
                                </p>
                              </CardContent>
                            </Card>
                          </div>

                          <div className="pt-4">
                            <div className="bg-primary/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center shadow-glow animate-pulse-glow">
                              <Navigation size={28} className="text-primary" />
                            </div>
                            <div className="mt-4 flex items-center justify-center">
                              <ArrowRight
                                size={20}
                                className="text-primary animate-pulse"
                              />
                              <span className="ml-2 font-medium">
                                {t.followArrow}
                              </span>
                            </div>
                          </div>

                          <div className="pt-4 flex flex-wrap gap-2 justify-center">
                            <Dialog
                              open={reviewDialogOpen}
                              onOpenChange={setReviewDialogOpen}
                            >
                              <DialogTrigger asChild>
                                <Button variant="outline" className="rounded-full">
                                  <Star className="mr-2 h-4 w-4" />
                                  {t.rateButton}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-background/95 backdrop-blur-sm border-primary/10">
                                <DialogHeader>
                                  <DialogTitle className="font-serif text-xl">
                                    {t.rateButton} {selectedVendor.name}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div>
                                    <p className="text-sm font-medium mb-2">
                                      {t.rating}
                                    </p>
                                    <div className="flex space-x-1">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          size={24}
                                          className={`cursor-pointer ${star <= rating ? "text-primary fill-primary" : "text-muted/30"}`}
                                          onClick={() => setRating(star)}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium mb-2">
                                      {t.yourOpinion}
                                    </p>
                                    <Textarea
                                      placeholder={t.reviewPlaceholder}
                                      value={reviewText}
                                      onChange={(e) =>
                                        setReviewText(e.target.value)
                                      }
                                      rows={4}
                                      className="bg-background/80 backdrop-blur-sm border-border/50 focus-visible:ring-primary/30 focus-visible:border-primary/30"
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    onClick={handleSubmitReview}
                                    className="rounded-full bg-primary hover:bg-primary/90 shadow-md hover:shadow-glow transition-all duration-300"
                                  >
                                    {t.submitReview}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <Button className="rounded-full bg-secondary hover:bg-secondary/90 shadow-md hover:shadow-glow transition-all duration-300">
                              <Share2 className="mr-2 h-4 w-4" />
                              {t.shareButton}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="animate-fade-in">
                          <div className="relative w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-glow mb-6" style={{ height: '280px' }}>
                            <img
                              src={selectedMarket.image}
                              alt={selectedMarket.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-4 left-4 right-4">
                              <div className="flex flex-wrap gap-1">
                                {selectedMarket.tags.map(tag => (
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

                          <h3 className="text-2xl font-serif font-bold mb-3">
                            {t.welcomeTo} {selectedMarket.name}
                          </h3>

                          <Card className="bg-background/50 backdrop-blur-sm border-primary/10 shadow-soft mb-6">
                            <CardContent className="p-4">
                              <p className="leading-relaxed">{selectedMarket.description}</p>
                            </CardContent>
                          </Card>

                          <div className="grid grid-cols-2 gap-3 mb-6">
                            <Card className="bg-background/50 backdrop-blur-sm border-primary/10 shadow-soft overflow-hidden">
                              <div className="h-1 bg-primary/80"></div>
                              <CardContent className="p-3">
                                <p className="text-xs font-medium text-muted-foreground mb-1">{t.schedule}</p>
                                <p className="text-sm font-medium flex items-center justify-center">
                                  <Clock className="h-4 w-4 mr-1 text-primary" />
                                  {selectedMarket.openHours}
                                </p>
                              </CardContent>
                            </Card>

                            <Card className="bg-background/50 backdrop-blur-sm border-primary/10 shadow-soft overflow-hidden">
                              <div className="h-1 bg-secondary/80"></div>
                              <CardContent className="p-3">
                                <p className="text-xs font-medium text-muted-foreground mb-1">{t.days}</p>
                                <p className="text-sm font-medium flex items-center justify-center">
                                  <Calendar className="h-4 w-4 mr-1 text-secondary" />
                                  {selectedMarket.openDays}
                                </p>
                              </CardContent>
                            </Card>
                          </div>

                          <p className="text-muted-foreground">
                            {t.selectVendor}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center p-6 max-w-md animate-fade-in">
                  <div className="relative w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-soft mb-6" style={{ height: '280px' }}>
                    <img
                      src="https://images.unsplash.com/photo-1604506822843-43759288463a?w=800&q=80"
                      alt="Mercados de San Cristóbal"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-3">{t.welcomeTitle}</h3>
                  <p className="mb-6 leading-relaxed">
                    {t.welcomeDescription}
                  </p>
                  <p className="text-muted-foreground">
                    {t.selectMarket}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketNavigator;
