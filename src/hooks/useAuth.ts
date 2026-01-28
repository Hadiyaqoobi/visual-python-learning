"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveAt: string | null;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me");
      const result = await response.json();

      if (response.ok && result.success) {
        setState({
          user: result.data.user,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const refresh = () => {
    fetchUser();
  };

  return {
    ...state,
    logout,
    refresh,
  };
}
