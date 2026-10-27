import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, checkIsAdmin } from '../../lib/supabase';

interface AdminAuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize session and auth state listener
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (initialSession?.user) {
          const authorized = await checkIsAdmin(initialSession.user.id);
          if (mounted) {
            setSession(initialSession);
            setUser(initialSession.user);
            setIsAdmin(authorized);
          }
        }
      } catch (err: any) {
        console.error('Session initialization error:', err);
        if (mounted) setError(err.message || 'Authentication error');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;

      if (newSession?.user) {
        setSession(newSession);
        setUser(newSession.user);
        const authorized = await checkIsAdmin(newSession.user.id);
        setIsAdmin(authorized);
      } else {
        setSession(null);
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) {
        setError(signInError.message || 'Invalid email or password.');
        setLoading(false);
        return { success: false, error: signInError.message };
      }

      if (!data.user) {
        setError('Login failed. Please check your credentials.');
        setLoading(false);
        return { success: false, error: 'User record not returned' };
      }

      // Explicit Admin Authorization Check
      const authorized = await checkIsAdmin(data.user.id);

      if (!authorized) {
        // Disallow non-admin users
        await supabase.auth.signOut();
        const accessDeniedMsg = 'Access denied. This account does not have administrator privileges.';
        setError(accessDeniedMsg);
        setUser(null);
        setSession(null);
        setIsAdmin(false);
        setLoading(false);
        return { success: false, error: accessDeniedMsg };
      }

      setUser(data.user);
      setSession(data.session);
      setIsAdmin(true);
      setLoading(false);
      return { success: true };
    } catch (err: any) {
      const msg = err.message || 'An unexpected error occurred during sign in.';
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setError(null);
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        loading,
        error,
        signIn,
        signOut,
        clearError,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
