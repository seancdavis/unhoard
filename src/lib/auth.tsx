import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  getUser,
  handleAuthCallback,
  logout as nLogout,
  oauthLogin,
  onAuthChange,
  type User,
} from "@netlify/identity";

const DEV_USER: User = {
  id: "dev-user",
  email: "dev@unhoard.local",
  name: "Dev User",
};

type AuthState = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(
    import.meta.env.DEV ? DEV_USER : null,
  );
  const [loading, setLoading] = useState(!import.meta.env.DEV);

  useEffect(() => {
    if (import.meta.env.DEV) return;
    let cancelled = false;
    (async () => {
      try {
        await handleAuthCallback();
      } catch (err) {
        console.error("auth callback error", err);
      }
      const u = await getUser();
      if (!cancelled) {
        setUser(u);
        setLoading(false);
      }
    })();
    const unsubscribe = onAuthChange((_event, current) => {
      setUser(current);
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const value: AuthState = {
    user,
    loading,
    signInWithGoogle: () => {
      if (import.meta.env.DEV) {
        setUser(DEV_USER);
        return;
      }
      oauthLogin("google");
    },
    signOut: async () => {
      if (import.meta.env.DEV) {
        setUser(null);
        return;
      }
      await nLogout();
      setUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function getDisplayName(user: User | null): string {
  if (!user) return "";
  return user.name || user.email || "Friend";
}

export function getInitial(user: User | null): string {
  const name = getDisplayName(user);
  return name.trim().charAt(0).toUpperCase() || "?";
}
