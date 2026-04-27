import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthUser, getCurrentUser, setCurrentUser } from "@/lib/api";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  updateUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = (userData: AuthUser) => {
    setUser(userData);
    setCurrentUser(userData);
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
  };

  const updateUser = (userData: AuthUser) => {
    setUser(userData);
    setCurrentUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
