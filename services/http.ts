import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

interface RetryRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const http = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

const refreshHttp = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

const AUTH_ROUTES = [
  "/authentication/login",
  "/authentication/register",
  "/authentication/refresh-token",
];

/* ---------------- REFRESH STATE ---------------- */

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: string | null | undefined) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
};

/* ---------------- REQUEST ---------------- */

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

/* ---------------- RESPONSE ---------------- */

http.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    if (!error.config) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetryRequest;

    const status = error.response?.status;
    const url = originalRequest.url ?? "";
    const isAuthRoute = AUTH_ROUTES.some((r) => url.includes(r));

    if (status !== 401 || originalRequest._retry || isAuthRoute) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            if (!token) {
              reject(new Error("Token refresh failed"));
              return;
            }

            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${token}`;

            resolve(http(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) throw new Error("No refresh token");

      const refreshRes = await refreshHttp.post(
        "/authentication/refresh-token",
        {
          refresh_token: refreshToken,
        },
      );

      const newToken = refreshRes?.data?.data?.access_token;

      if (!newToken) throw new Error("Invalid refresh response");

      localStorage.setItem("access_token", newToken);

      http.defaults.headers.common.Authorization = `Bearer ${newToken}`;

      processQueue(null, newToken);

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return http(originalRequest);
    } catch (err) {
      processQueue(err, null);

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      window.location.href = "/login";

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

export default http;
