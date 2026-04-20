import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { AUTH_EVENTS, STORAGE_KEYS } from "~/lib/constants";

type ApiErrorPayload = {
  message?: string;
};

type AuthResponsePayload = {
  token?: string;
  accessToken?: string;
  user?: unknown;
  data?: {
    token?: string;
    accessToken?: string;
    user?: unknown;
  };
};

type RequestConfigWithRetry = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshPromise: Promise<string> | null = null;
let hasNotifiedSessionExpired = false;

function buildApiBaseUrl(): string {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error("Missing required env: VITE_API_BASE_URL");
  }

  return apiBaseUrl;
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(STORAGE_KEYS.token);
}

function setStoredSession(token: string, user?: unknown): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.token, token);

  if (user) {
    window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  }
}

function clearStoredSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEYS.token);
  window.localStorage.removeItem(STORAGE_KEYS.user);
}

function extractAuthToken(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const authPayload = payload as AuthResponsePayload;
  return (
    authPayload.token ||
    authPayload.accessToken ||
    authPayload.data?.token ||
    authPayload.data?.accessToken ||
    null
  );
}

function extractAuthUser(payload: unknown): unknown {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const authPayload = payload as AuthResponsePayload;
  return authPayload.user || authPayload.data?.user || null;
}

function notifySessionExpiredOnce(): void {
  if (typeof window === "undefined") {
    return;
  }

  if (hasNotifiedSessionExpired) {
    return;
  }

  hasNotifiedSessionExpired = true;
  window.dispatchEvent(new Event(AUTH_EVENTS.sessionExpired));
}

function normalizeApiError(error: unknown): { message: string; status?: number } {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message || error.message || "Unexpected API error";

    return {
      message,
      status: error.response?.status,
    };
  }

  if (error && typeof error === "object" && "message" in error) {
    return {
      message: String((error as { message?: unknown }).message || "Unexpected API error"),
    };
  }

  return {
    message: "Unexpected API error",
  };
}

function isAuthEndpoint(url?: string): boolean {
  if (!url) {
    return false;
  }

  const normalizedUrl = url.toLowerCase();

  return (
    normalizedUrl.includes("/login") ||
    normalizedUrl.includes("/refresh") ||
    normalizedUrl.includes("/register") ||
    normalizedUrl.includes("/logout")
  );
}

async function refreshAccessToken(apiBaseUrl: string): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = axios
    .post<AuthResponsePayload>(
      `${apiBaseUrl}/users/refresh`,
      {},
      {
        timeout: 10000,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
    .then((response) => {
      const token = extractAuthToken(response?.data);

      if (!token) {
        throw new Error("Invalid refresh response from server");
      }

      setStoredSession(token, extractAuthUser(response?.data));
      hasNotifiedSessionExpired = false;

      return token;
    })
    .catch((error) => {
      clearStoredSession();
      notifySessionExpiredOnce();
      throw normalizeApiError(error);
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

function createClient(baseURL: string, extendedUrl: string) {
  const client = axios.create({
    baseURL: `${baseURL}/${extendedUrl.replace(/^\/+/, "")}`,
    timeout: 10000,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use((config) => {
    const token = getStoredToken();

    if (token) {
      hasNotifiedSessionExpired = false;
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiErrorPayload>) => {
      const requestConfig = error.config as RequestConfigWithRetry | undefined;
      const isUnauthorized = error.response?.status === 401;
      const canRetry =
        Boolean(requestConfig) &&
        isUnauthorized &&
        !requestConfig?._retry &&
        !isAuthEndpoint(requestConfig?.url);

      if (canRetry && requestConfig) {
        requestConfig._retry = true;

        try {
          const refreshedToken = await refreshAccessToken(baseURL);
          requestConfig.headers.Authorization = `Bearer ${refreshedToken}`;
          return client(requestConfig);
        } catch {
          return Promise.reject(normalizeApiError(error));
        }
      }

      return Promise.reject(normalizeApiError(error));
    },
  );

  return client;
}

const API_BASE_URL = normalizeBaseUrl(buildApiBaseUrl());

export const userApi = createClient(
  API_BASE_URL,
  "users"
);

export const foodApi = createClient(
  API_BASE_URL,
  "foods"
);

export const orderApi = createClient(
  API_BASE_URL,
  "orders"

);

export const paymentApi = createClient(
  API_BASE_URL,
  "payments"
);
