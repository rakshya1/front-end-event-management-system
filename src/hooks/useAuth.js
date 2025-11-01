import { useState, useEffect, useCallback } from "react";
import authApi from "../api/authApi";
import axiosClient from "../api/axiosClient";

const TOKEN_KEY = "auth_token";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || null);

  // 🧠 Automatically attach token to axios headers
  useEffect(() => {
    if (token) {
      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axiosClient.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // 🔄 Fetch authenticated user profile
  const fetchUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await authApi.getProfile();
      setUser(response.data);
      setError(null);
    } catch (err) {
      setUser(null);
      setError(err.response?.data?.message || "Failed to fetch user profile");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // 🔐 Login handler
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authApi.login(credentials);

      const newToken = response.data?.data?.token;
      if (newToken) {
        localStorage.setItem(TOKEN_KEY, newToken);
        setToken(newToken);
      }

      await fetchUser();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🧾 Register handler — now mirrors login()
  const register = async (data) => {
    try {
      setLoading(true);
      const response = await authApi.register(data);

      // some APIs send token under different paths
      const newToken =
        response.data?.data?.token || response.data?.token || null;

      if (newToken) {
        localStorage.setItem(TOKEN_KEY, newToken);
        setToken(newToken);
      }

      // ✅ fetch user profile using token
      await fetchUser();

      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Logout handler
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    }
  };

  return {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
  };
};

export default useAuth;
