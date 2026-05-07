import { useEffect, useState, ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { clearSupabaseAuthStorage } from "@/lib/authStorage";
import { AuthContext } from "@/contexts/auth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth changes (set up first to catch TOKEN_REFRESHED / SIGNED_OUT)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === "TOKEN_REFRESHED" && !session) {
        // Refresh failed — clear any stale tokens
        clearSupabaseAuthStorage();
        supabase.auth.signOut().catch(() => {});
      }
    });

    // Get initial session; if it fails (e.g. stale refresh token), clear it
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          console.warn("getSession failed, clearing stale auth:", error);
          clearSupabaseAuthStorage();
          supabase.auth.signOut().catch(() => {});
          setSession(null);
          setUser(null);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("getSession threw, clearing stale auth:", err);
        clearSupabaseAuthStorage();
        supabase.auth.signOut().catch(() => {});
        setSession(null);
        setUser(null);
        setLoading(false);
      });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
