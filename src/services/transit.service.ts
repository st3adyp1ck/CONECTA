import { ApiService } from './api.service';
import { Route, Stop, Bus } from '@/types/database.types';
import { supabase, handleSupabaseError } from '@/lib/supabase';

/**
 * Service for managing transit routes
 */
export class RouteService extends ApiService<Route> {
  constructor() {
    super('routes');
  }

  /**
   * Get all stops for a specific route
   */
  async getRouteStops(routeId: string) {
    try {
      const { data, error } = await supabase
        .from('stops')
        .select('*')
        .eq('route_id', routeId)
        .order('order', { ascending: true });
      
      if (error) {
        return handleSupabaseError(error);
      }
      
      return { data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  /**
   * Get all buses for a specific route
   */
  async getRouteBuses(routeId: string) {
    try {
      const { data, error } = await supabase
        .from('buses')
        .select('*')
        .eq('route_id', routeId)
        .eq('status', 'active');
      
      if (error) {
        return handleSupabaseError(error);
      }
      
      return { data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  }
}

/**
 * Service for managing transit stops
 */
export class StopService extends ApiService<Stop> {
  constructor() {
    super('stops');
  }
}

/**
 * Service for managing buses
 */
export class BusService extends ApiService<Bus> {
  constructor() {
    super('buses');
  }

  /**
   * Update bus location
   */
  async updateLocation(id: string, location: [number, number]) {
    try {
      const { data, error } = await supabase
        .from('buses')
        .update({ 
          location, 
          last_updated: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        return handleSupabaseError(error);
      }
      
      return { data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  }
}

// Export instances for easy use
export const routeService = new RouteService();
export const stopService = new StopService();
export const busService = new BusService();
