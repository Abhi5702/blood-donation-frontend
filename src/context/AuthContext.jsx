import { createContext, useContext, useState, useEffect } from "react";
import { tokenUtils } from "../utils/tokenUtils";
import { roleUtils } from "../utils/roleUtils";
import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // ── On app load — fetch /me if token exists ────────────
  useEffect(() => {
    const token = tokenUtils.getToken();
    if (token) {
      axiosInstance.get(ENDPOINTS.ME)
        .then((res) => setUser(res.data.data))
        .catch(() => tokenUtils.clearAll())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // ── Login ──────────────────────────────────────────────
  const login = (token, refreshToken, userData) => {
    tokenUtils.setToken(token);
    tokenUtils.setRefreshToken(refreshToken);
    setUser(userData);
  };

  // ── Logout ─────────────────────────────────────────────
  const logout = () => {
    tokenUtils.clearAll();
    setUser(null);
  };

  // ── Role helpers ───────────────────────────────────────
  const dashboardRoute = user
    ? roleUtils.getDashboardRoute(user.role)
    : "/login";

  return (
    <AuthContext.Provider value={{
      user, setUser,
      login, logout,
      loading,
      dashboardRoute,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};