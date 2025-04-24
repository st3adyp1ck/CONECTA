import { ApiService } from './api.service';
import { Event } from '@/types/database.types';
import { supabase, handleSupabaseError } from '@/lib/supabase';

/**
 * Service for managing local guide events
 */
export class EventService extends ApiService<Event> {
  constructor() {
    super('events');
  }

  /**
   * Get events by category
   */
  async getByCategory(category: string, options: { 
    page?: number; 
    limit?: number;
  } = {}) {
    try {
      const { page = 1, limit = 20 } = options;
      const offset = (page - 1) * limit;
      
      const { data, error, count } = await supabase
        .from('events')
        .select('*', { count: 'exact' })
        .eq('category', category)
        .eq('active', true)
        .order('start_date', { ascending: true })
        .range(offset, offset + limit - 1);
      
      if (error) {
        return handleSupabaseError(error);
      }
      
      return { 
        data, 
        count, 
        page, 
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  /**
   * Get upcoming events
   */
  async getUpcoming(options: { 
    page?: number; 
    limit?: number;
  } = {}) {
    try {
      const { page = 1, limit = 20 } = options;
      const offset = (page - 1) * limit;
      const today = new Date().toISOString();
      
      const { data, error, count } = await supabase
        .from('events')
        .select('*', { count: 'exact' })
        .gte('start_date', today)
        .eq('active', true)
        .order('start_date', { ascending: true })
        .range(offset, offset + limit - 1);
      
      if (error) {
        return handleSupabaseError(error);
      }
      
      return { 
        data, 
        count, 
        page, 
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  /**
   * Search events by name or description
   */
  async search(query: string, options: { 
    page?: number; 
    limit?: number;
  } = {}) {
    try {
      const { page = 1, limit = 20 } = options;
      const offset = (page - 1) * limit;
      
      const { data, error, count } = await supabase
        .from('events')
        .select('*', { count: 'exact' })
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .eq('active', true)
        .order('start_date', { ascending: true })
        .range(offset, offset + limit - 1);
      
      if (error) {
        return handleSupabaseError(error);
      }
      
      return { 
        data, 
        count, 
        page, 
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      return handleSupabaseError(error);
    }
  }
}

// Export instance for easy use
export const eventService = new EventService();
