import { supabase, handleSupabaseError } from '@/lib/supabase';

/**
 * Base API service with common CRUD operations
 */
export class ApiService<T> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * Get all records from a table
   */
  async getAll(options: {
    page?: number;
    limit?: number;
    filters?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
  } = {}) {
    try {
      const {
        page = 1,
        limit = 50,
        filters = {},
        orderBy = { column: 'created_at', ascending: false }
      } = options;

      const offset = (page - 1) * limit;

      let query = supabase
        .from(this.tableName)
        .select('*')
        .range(offset, offset + limit - 1);

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      // Apply ordering
      query = query.order(orderBy.column, {
        ascending: orderBy.ascending ?? false
      });

      // Add count option to the select method
      const { data, error, count } = await query;

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
   * Get a single record by ID
   */
  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
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
   * Create a new record
   */
  async create(record: Partial<T>) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .insert([{ ...record, created_at: new Date().toISOString() }])
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
   * Update an existing record
   */
  async update(id: string, record: Partial<T>) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update({ ...record, updated_at: new Date().toISOString() })
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
   * Delete a record
   */
  async delete(id: string) {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        return handleSupabaseError(error);
      }

      return { success: true };
    } catch (error) {
      return handleSupabaseError(error);
    }
  }
}
