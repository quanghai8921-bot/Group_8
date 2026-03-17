"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getUserProfile } from "@/lib/apiClient";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isMerchant: boolean;
  userId: string | null;
  login(redirectPath?: string, asAdmin?: boolean, roles?: string[]): void;
  logout(): void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider(props: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMerchant, setIsMerchant] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(function () {
    const storedAuth = localStorage.getItem("isAuthenticated");
    const loggedIn = localStorage.getItem("isLoggedIn");
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    const merchantStatus = localStorage.getItem("isMerchant") === "true";
    const token = localStorage.getItem("authToken") || localStorage.getItem("auth-token");
    const userId = localStorage.getItem("userId");
    
    if (storedAuth === "true" || loggedIn === "true" || !!token) {
      setIsAuthenticated(true);
      setIsAdmin(adminStatus);
      setIsMerchant(merchantStatus);
      setUserId(userId);

      // Refresh roles from server to handle background approvals
      // Skip for demo accounts which aren't in the DB
      if (userId && !userId.startsWith("dev-")) {
        getUserProfile(userId).then(profile => {
          if (profile && profile.roles) {
            const lowerRoles = profile.roles.map(r => r.toLowerCase().trim());
            const hasMerchantRole = lowerRoles.some(r => r.includes("merchant") || r.includes("chủ quán"));
            const hasAdminRole = lowerRoles.some(r => r.includes("admin") || r.includes("quản trị viên"));
            
            setIsMerchant(hasMerchantRole);
            setIsAdmin(hasAdminRole);
            localStorage.setItem("isMerchant", hasMerchantRole ? "true" : "false");
            localStorage.setItem("isAdmin", hasAdminRole ? "true" : "false");
            localStorage.setItem("userRoles", JSON.stringify(profile.roles));
          }
        }).catch(err => {
          console.error("Failed to sync roles", err);
        });
      }
    }
  }, []);

  function login(redirectPath: string = "/", asAdmin: boolean = false, roles: string[] = []) {
    const lowerRoles = roles.map(r => r.toLowerCase().trim());
    const hasMerchantRole = lowerRoles.some(r => r.includes("merchant") || r.includes("chủ quán"));
    const hasAdminRole = lowerRoles.some(r => r.includes("admin") || r.includes("quản trị viên"));
    
    const rawUserId = localStorage.getItem("userId");
    setUserId(rawUserId);

    setIsAuthenticated(true);
    setIsAdmin(hasAdminRole);
    setIsMerchant(hasMerchantRole);
    
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("isAdmin", hasAdminRole ? "true" : "false");
    localStorage.setItem("isMerchant", hasMerchantRole ? "true" : "false");
    router.push(redirectPath);
  }

  function logout() {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setIsMerchant(false);
    setUserId(null);

    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("isMerchant");
    localStorage.removeItem("authToken");
    localStorage.removeItem("auth-token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userFullName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userRoles");
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: isAuthenticated, 
      isAdmin: isAdmin, 
      isMerchant: isMerchant,
      userId: userId,
      login: login, 
      logout: logout 
    }}>
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