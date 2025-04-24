import { ApiService } from './api.service';
import { Review } from '@/types/database.types';
import { supabase, handleSupabaseError } from '@/lib/supabase';

/**
 * Service for managing reviews
 */
export class ReviewService extends ApiService<Review> {
  constructor() {
    super('reviews');
  }

  /**
   * Get reviews for a specific vendor
   */
  async getVendorReviews(vendorId: string, options: { 
    page?: number; 
    limit?: number;
    status?: 'pending' | 'approved' | 'rejected';
  } = {}) {
    try {
      const { page = 1, limit = 20, status = 'approved' } = options;
      const offset = (page - 1) * limit;
      
      let query = supabase
        .from('reviews')
        .select('*, users(name)')
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error, count } = await query.count('exact');
      
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
   * Get reviews by status
   */
  async getByStatus(status: 'pending' | 'approved' | 'rejected', options: { 
    page?: number; 
    limit?: number;
  } = {}) {
    try {
      const { page = 1, limit = 20 } = options;
      const offset = (page - 1) * limit;
      
      const { data, error, count } = await supabase
        .from('reviews')
        .select('*, users(name), vendors(name)', { count: 'exact' })
        .eq('status', status)
        .order('created_at', { ascending: false })
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
   * Approve a review
   */
  async approve(id: string) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({ 
          status: 'approved',
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

  /**
   * Reject a review
   */
  async reject(id: string) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({ 
          status: 'rejected',
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

// Export instance for easy use
export const reviewService = new ReviewService();
