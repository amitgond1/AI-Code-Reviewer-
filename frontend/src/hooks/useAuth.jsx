import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("acr_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      localStorage.removeItem("acr_user");
      return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem("acr_token"));
  const [loading, setLoading] = useState(false);

  const persistAuth = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("acr_token", newToken);
    localStorage.setItem("acr_user", JSON.stringify(newUser));
  };

  const clearAuth = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("acr_token");
    localStorage.removeItem("acr_user");
  };

  const signup = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/signup", payload);
      persistAuth(data.token, data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/login", payload);
      persistAuth(data.token, data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {
      // ignore API errors and clear local session anyway
    }
    clearAuth();
  };

  const refreshProfile = async () => {
    if (!token) return;
    const { data } = await api.get("/profile");
    setUser(data.user);
    localStorage.setItem("acr_user", JSON.stringify(data.user));
  };

  useEffect(() => {
    const handler = () => clearAuth();
    window.addEventListener("auth-expired", handler);
    return () => window.removeEventListener("auth-expired", handler);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      signup,
      login,
      logout,
      refreshProfile,
      setUser
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
