"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types";
import api, { getToken, clearToken } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function fetchProfile(): Promise<User> {
  const res = await api.get("/auth/profile");
  const u = res.data.user;
  return { id: u.id, name: u.full_name, email: u.email, role: u.role };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hasToken] = useState(() => !!getToken());
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    enabled: hasToken,
    retry: false,
  });

  useEffect(() => {
    if (data) setUser(data);
  }, [data]);

  useEffect(() => {
    if (isError) {
      clearToken();
      setUser(null);
    }
  }, [isError]);

  const logout = () => {
    clearToken();
    setUser(null);
    queryClient.clear();
  };

  const login = (u: User) => {
    setUser(u);
    queryClient.setQueryData(["profile"], u);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading: hasToken ? isLoading : false, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
