import axios from "axios";
import * as Auth from "@/lib/auth";

const env =
  (import.meta as unknown as { env?: Record<string, string | undefined> })
    .env ?? {};

const apiOrigin = env.VITE_API_URL || env.API_URL || 'http://localhost:3000';
const apiVersion = env.VITE_API_VERSION || env.API_VERSION || '1';
// Build base like: http://localhost:3000/api/v1
const baseURL = `${apiOrigin.replace(/\/$/, '')}/api/v${apiVersion}`;

const API = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach access token if present
API.interceptors.request.use((config) => {
  const token = Auth.getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshCallQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

// Helper to process queued requests after refresh
function processQueue(error: unknown, token: string | null = null) {
  refreshCallQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token as string);
  });
  refreshCallQueue = [];
}

// Response interceptor: on 401 try to refresh the token once
API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalReq = err.config;

    if (err.response && err.response.status === 401 && !originalReq._retry) {
      originalReq._retry = true;

      const refreshToken = Auth.getRefreshToken();
      if (!refreshToken) {
        Auth.clearAuth();
        return Promise.reject(err);
      }

      if (isRefreshing) {
        // queue the request until refresh finished
        return new Promise((resolve, reject) => {
          refreshCallQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalReq.headers.Authorization = `Bearer ${token}`;
            return API(originalReq);
          })
          .catch((e) => Promise.reject(e));
      }

      isRefreshing = true;

      try {
        // call refresh endpoint using plain axios to avoid interceptors
        const refreshUrl = `${API.defaults.baseURL}/auth/refresh`;
        const resp = await axios.post(refreshUrl, { refreshToken });
        const { accessToken, refreshToken: newRefresh } = resp.data;
        Auth.setAuthTokens({ accessToken, refreshToken: newRefresh });
        originalReq.headers.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
        return API(originalReq);
      } catch (e) {
        processQueue(e, null);
        Auth.clearAuth();
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default API;
