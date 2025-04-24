import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { authService } from '@/services';

// Define the context type
type AuthContextType = {
  user: any | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name?: string) => Promise<any>;
  signOut: () => Promise<void>;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isLoading: true,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => { },
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component to wrap the app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for user session on initial load
  useEffect(() => {
    const checkUser = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);

          // Check if user is admin
          const adminResult = await authService.isAdmin();
          if ('isAdmin' in adminResult) {
            setIsAdmin(adminResult.isAdmin);
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user || null);

        if (session?.user) {
          const adminResult = await authService.isAdmin();
          if ('isAdmin' in adminResult) {
            setIsAdmin(adminResult.isAdmin);
          }
        } else {
          setIsAdmin(false);
        }

        setIsLoading(false);
      }
    );

    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    return await authService.signIn(email, password);
  };

  // Sign up function
  const signUp = async (email: string, password: string, name?: string) => {
    return await authService.signUp(email, password, name);
  };

  // Sign out function
  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  // Context value
  const value = {
    user,
    isAdmin,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
