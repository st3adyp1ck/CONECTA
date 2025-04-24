import { supabase, handleSupabaseError } from '@/lib/supabase';

/**
 * Service for managing user preferences
 */
export class UserPreferencesService {
  /**
   * Get user preferences from the database
   * @param userId User ID
   */
  async getUserPreferences(userId: string) {
    try {
      if (!userId) {
        return { error: { message: 'User ID is required' } };
      }

      const { data, error } = await supabase.rpc('get_user_preferences', {
        user_id: userId
      });

      if (error) {
        return handleSupabaseError(error);
      }

      return { data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  /**
   * Update user preferences in the database
   * @param userId User ID
   * @param preferences Object containing preferences to update
   */
  async updateUserPreferences(
    userId: string,
    preferences: {
      avatar_style?: string;
      avatar_seed?: string;
      language?: string;
    }
  ) {
    try {
      if (!userId) {
        return { error: { message: 'User ID is required' } };
      }

      const { data, error } = await supabase.rpc('update_user_preferences', {
        user_id: userId,
        p_avatar_style: preferences.avatar_style,
        p_avatar_seed: preferences.avatar_seed,
        p_language: preferences.language
      });

      if (error) {
        return handleSupabaseError(error);
      }

      // Update localStorage with the new values for immediate access
      if (preferences.avatar_style) {
        localStorage.setItem('userAvatarStyle', preferences.avatar_style);
      }

      if (preferences.avatar_seed) {
        localStorage.setItem('userAvatarSeed', preferences.avatar_seed);
      }

      if (preferences.language) {
        localStorage.setItem('language', preferences.language);
        document.documentElement.setAttribute('lang', preferences.language);
      }

      return { data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  /**
   * Sync preferences from database to localStorage
   * This is useful when a user logs in to ensure localStorage has the latest values
   * @param userId User ID
   */
  async syncPreferencesToLocalStorage(userId: string) {
    try {
      const { data, error } = await this.getUserPreferences(userId);

      if (error) {
        return { error };
      }

      if (data) {
        // Update localStorage with values from the database
        if (data.avatar_style) {
          localStorage.setItem('userAvatarStyle', data.avatar_style);
        }

        if (data.avatar_seed) {
          localStorage.setItem('userAvatarSeed', data.avatar_seed);
        } else if (data.id) {
          // If no seed is set, use the user ID as a fallback
          localStorage.setItem('userAvatarSeed', data.id);
        }

        if (data.language) {
          localStorage.setItem('language', data.language);
          document.documentElement.setAttribute('lang', data.language);
        }
      }

      return { success: true };
    } catch (error) {
      return handleSupabaseError(error);
    }
  }
}

// Export instance for easy use
export const userPreferencesService = new UserPreferencesService();
