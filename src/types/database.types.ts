// Database Types for CONECTA App

// Transit Types
export interface Route {
  id: string;
  name: string;
  description: string;
  color: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Stop {
  id: string;
  route_id: string;
  name: string;
  description: string;
  location: [number, number]; // [latitude, longitude]
  order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Bus {
  id: string;
  route_id: string;
  name: string;
  location: [number, number]; // [latitude, longitude]
  status: 'active' | 'inactive' | 'maintenance';
  last_updated: string;
  created_at: string;
  updated_at: string;
}

// Local Guide Types
export interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  coordinates: [number, number]; // [latitude, longitude]
  start_date: string;
  end_date: string;
  image_url: string;
  category: string;
  price: string;
  tags: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Market Types
export interface Market {
  id: string;
  name: string;
  description: string;
  location: string;
  coordinates: [number, number]; // [latitude, longitude]
  open_days: string;
  open_hours: string;
  image_url: string;
  specialty: string;
  tags: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Vendor {
  id: string;
  market_id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  coordinates: [number, number]; // [latitude, longitude]
  image_url: string;
  indigenous: boolean;
  sustainable: boolean;
  price_range: string;
  specialty?: string;
  open_hours?: string;
  featured: boolean;
  tags: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Review Types
export interface Review {
  id: string;
  user_id: string;
  vendor_id: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar_style?: string;
  avatar_seed?: string;
  language?: 'en' | 'es';
  created_at: string;
  updated_at: string;
}

// Translation Types for Multilingual Support
export interface Translation {
  id: string;
  entity_type: 'route' | 'stop' | 'event' | 'market' | 'vendor';
  entity_id: string;
  language: string;
  field: string;
  value: string;
  created_at: string;
  updated_at: string;
}
