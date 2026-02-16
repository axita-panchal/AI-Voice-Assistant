import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export interface AxiosRequestWithRetry extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface FailedQueueItem {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

// 🔹 separate instance for refresh
const refreshHttp = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const AUTH_ROUTES = [
  "/authentication/login",
  "/authentication/register",
  "/authentication/refresh-token",
];

const processQueue = (error: unknown, token?: string) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else if (token) p.resolve(token);
  });
  failedQueue = [];
};

/* ---------------- REQUEST ---------------- */

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
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
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestWithRetry;
    const status = error.response?.status;
    const url = originalRequest?.url ?? "";

    const isAuthRoute = AUTH_ROUTES.some((r) => url.includes(r));

    if (status === 400 || status === 422) {
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return http(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        console.log("refreshToken: ", refreshToken);

        const res = await refreshHttp.post("/authentication/refresh-token", {
          refresh_token: refreshToken,
        });

        // ✅ CORRECT PATH
        const newToken = res.data?.data?.access_token;
        console.log("newToken: ", newToken);

        if (!newToken) throw new Error("No access token from refresh");

        localStorage.setItem("access_token", newToken);

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return http(originalRequest);
      } catch (err) {
        console.log("err: ", err);
        processQueue(err);

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default http;
