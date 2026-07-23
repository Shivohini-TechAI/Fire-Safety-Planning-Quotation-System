import axios from "axios";
import Cookies from "js-cookie";

const TOKEN_COOKIE = "fs_token";

export function setToken(token: string) {
  // 1 hour to match backend JWT expiresIn: "1h"
  Cookies.set(TOKEN_COOKIE, token, { expires: 1 / 24, sameSite: "lax" });
}

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_COOKIE);
}

export function clearToken() {
  Cookies.remove(TOKEN_COOKIE);
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT to every request automatically
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is invalid/expired, clear it and bounce to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      clearToken();
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
