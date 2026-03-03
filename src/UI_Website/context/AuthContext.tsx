"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login(redirectPath?: string, asAdmin?: boolean): void;
  logout(): void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider(props: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(function () {
    const storedAuth = localStorage.getItem("isAuthenticated");
    const loggedIn = localStorage.getItem("isLoggedIn");
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    const token = localStorage.getItem("auth-token");
    if (storedAuth === "true" || loggedIn === "true" || !!token) {
      setIsAuthenticated(true);
      setIsAdmin(adminStatus);
    }
  }, []);

  function login(redirectPath: string = "/", asAdmin: boolean = false) {
    setIsAuthenticated(true);
    setIsAdmin(asAdmin);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("isAdmin", asAdmin ? "true" : "false");
    router.push(redirectPath);
  }

  function logout() {
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("auth-token");
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: isAuthenticated, isAdmin: isAdmin, login: login, logout: logout }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("Loi context");
  }
  return context;
}