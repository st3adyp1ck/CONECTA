import { ApiService } from './api.service';
import { Market, Vendor } from '@/types/database.types';
import { supabase, handleSupabaseError } from '@/lib/supabase';

/**
 * Service for managing markets
 */
export class MarketService extends ApiService<Market> {
  constructor() {
    super('markets');
  }

  /**
   * Get all vendors for a specific market
   */
  async getMarketVendors(marketId: string) {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('market_id', marketId)
        .eq('active', true)
        .order('name');

      if (error) {
        return handleSupabaseError(error);
      }

      return { data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  /**
   * Get markets by tag
   */
  async getByTag(tag: string, options: {
    page?: number;
    limit?: number;
  } = {}) {
    try {
      const { page = 1, limit = 20 } = options;
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabase
        .from('markets')
        .select('*', { count: 'exact' })
        .contains('tags', [tag])
        .eq('active', true)
        .order('name')
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

/**
 * Service for managing vendors
 */
export class VendorService extends ApiService<Vendor> {
  constructor() {
    super('vendors');
  }

  /**
   * Get featured vendors
   */
  async getFeatured(options: {
    page?: number;
    limit?: number;
  } = {}) {
    try {
      const { page = 1, limit = 20 } = options;
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabase
        .from('vendors')
        .select('*', { count: 'exact' })
        .eq('featured', true)
        .eq('active', true)
        .order('name')
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
   * Get vendors by category
   */
  async getByCategory(category: string, options: {
    page?: number;
    limit?: number;
  } = {}) {
    try {
      const { page = 1, limit = 20 } = options;
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabase
        .from('vendors')
        .select('*', { count: 'exact' })
        .eq('category', category)
        .eq('active', true)
        .order('name')
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
   * Get indigenous vendors
   */
  async getIndigenous(options: {
    page?: number;
    limit?: number;
  } = {}) {
    try {
      const { page = 1, limit = 20 } = options;
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabase
        .from('vendors')
        .select('*', { count: 'exact' })
        .eq('indigenous', true)
        .eq('active', true)
        .order('name')
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
   * Get sustainable vendors
   */
  async getSustainable(options: {
    page?: number;
    limit?: number;
  } = {}) {
    try {
      const { page = 1, limit = 20 } = options;
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabase
        .from('vendors')
        .select('*', { count: 'exact' })
        .eq('sustainable', true)
        .eq('active', true)
        .order('name')
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
   * Search vendors by name or description
   */
  async search(query: string, options: {
    page?: number;
    limit?: number;
  } = {}) {
    try {
      const { page = 1, limit = 20 } = options;
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabase
        .from('vendors')
        .select('*', { count: 'exact' })
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .eq('active', true)
        .order('name')
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

// Export instances for easy use
export const marketService = new MarketService();
export const vendorService = new VendorService();
