import { supabase, handleSupabaseError } from '@/lib/supabase';
import { UserPreferencesService } from './user-preferences.service';

/**
 * Service for authentication and user management
 */
export class AuthService {
  private userPreferencesService: UserPreferencesService;

  constructor() {
    this.userPreferencesService = new UserPreferencesService();
  }
  /**
   * Sign up a new user with email and password
   * @param email User email
   * @param password User password
   * @param name User's name (optional)
   */
  async signUp(email: string, password: string, name?: string) {
    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        return handleSupabaseError(authError);
      }

      // If auth user was created successfully, add to users table
      if (authData.user) {
        const { error: userError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email: email,
              name: name || email.split('@')[0], // Use part of email as name if not provided
              role: 'user' // Default role
            }
          ]);

        if (userError) {
          return handleSupabaseError(userError);
        }
      }

      return { data: authData };
    } catch (error) {
      return handleSupabaseError(error);
    }
  }
  /**
   * Sign in with email and password
   * @param email User email
   * @param password User password
   * @param rememberMe Whether to persist the session
   */
  async signIn(email: string, password: string, rememberMe: boolean = false) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          // When rememberMe is true, session persists for 30 days, otherwise just for the browser session
          persistSession: rememberMe
        }
      });

      if (error) {
        return handleSupabaseError(error);
      }

      // If user is authenticated, sync their preferences from the database to localStorage
      if (data.user) {
        // Store email for backward compatibility
        if (rememberMe) {
          localStorage.setItem('userEmail', email);
        }

        // Sync preferences from database to localStorage
        await this.userPreferencesService.syncPreferencesToLocalStorage(data.user.id);
      } else if (!rememberMe) {
        // Clear any stored preferences if not remembering
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userAvatarStyle');
        localStorage.removeItem('userAvatarSeed');
        localStorage.removeItem('language');
      }

      return { data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  /**
   * Sign out the current user
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return handleSupabaseError(error);
      }

      return { success: true };
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  /**
   * Get the current user
   */
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        return handleSupabaseError(error);
      }

      return { data: data.user };
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  /**
   * Check if the current user is an admin
   */
  async isAdmin() {
    try {
      const { data: user } = await this.getCurrentUser();

      if (!user) {
        return { isAdmin: false };
      }

      // Special check for admin email
      if (user.email === 'ib310us@gmail.com') {
        return { isAdmin: true };
      }

      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        return handleSupabaseError(error);
      }

      return { isAdmin: data?.role === 'admin' };
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  /**
   * Get the user's avatar style preference
   */
  getUserAvatarStyle(): string {
    return localStorage.getItem('userAvatarStyle') || 'avataaars';
  }

  /**
   * Set the user's avatar style preference
   * @param style Avatar style
   * @param userId Optional user ID to update in database
   */
  async setUserAvatarStyle(style: string, userId?: string): Promise<void> {
    // Always update localStorage for immediate access
    localStorage.setItem('userAvatarStyle', style);

    // If userId is provided, also update in database
    if (userId) {
      await this.userPreferencesService.updateUserPreferences(userId, {
        avatar_style: style
      });
    }
  }

  /**
   * Get the user's avatar seed (for consistent avatar generation)
   */
  getUserAvatarSeed(): string {
    return localStorage.getItem('userAvatarSeed') || localStorage.getItem('userEmail') || 'user';
  }

  /**
   * Set the user's avatar seed
   * @param seed Avatar seed
   * @param userId Optional user ID to update in database
   */
  async setUserAvatarSeed(seed: string, userId?: string): Promise<void> {
    // Always update localStorage for immediate access
    localStorage.setItem('userAvatarSeed', seed);

    // If userId is provided, also update in database
    if (userId) {
      await this.userPreferencesService.updateUserPreferences(userId, {
        avatar_seed: seed
      });
    }
  }

  /**
   * Get the user's language preference
   */
  getUserLanguage(): string {
    return localStorage.getItem('language') || 'en';
  }

  /**
   * Set the user's language preference
   * @param language Language code ('en' or 'es')
   * @param userId Optional user ID to update in database
   */
  async setUserLanguage(language: string, userId?: string): Promise<void> {
    // Always update localStorage for immediate access
    localStorage.setItem('language', language);
    document.documentElement.setAttribute('lang', language);

    // If userId is provided, also update in database
    if (userId) {
      await this.userPreferencesService.updateUserPreferences(userId, {
        language
      });
    }
  }

  /**
   * Get the full avatar URL based on user preferences
   */
  getUserAvatarUrl(email?: string): string {
    const style = this.getUserAvatarStyle();
    const seed = this.getUserAvatarSeed() || email || 'user';
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
  }
}

// Export instance for easy use
export const authService = new AuthService();
