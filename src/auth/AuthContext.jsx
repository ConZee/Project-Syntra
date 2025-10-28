// src/auth/AuthContext.jsx
import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const login = (token, u) => {
    setAccessToken(token);
    setUser(u);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(u));
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  const hasRole = (roles = []) => {
    if (!roles?.length) return true;
    const r = user?.role;
    return r ? roles.includes(r) : false;
  };

  const value = useMemo(
    () => ({ user, accessToken, login, logout, isAuthenticated: !!accessToken, hasRole }),
    [user, accessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
