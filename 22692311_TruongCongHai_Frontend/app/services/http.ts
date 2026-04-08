import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { STORAGE_KEYS } from "~/lib/constants";

const RETRYABLE_METHOD = "GET";
const RETRYABLE_STATUS_CODES = new Set([429, 502, 503, 504]);
const RETRYABLE_ENDPOINTS = new Set(["/foods", "/orders", "/users"]);
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 300;
const MAX_DELAY_MS = 3000;

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  __retryCount?: number;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function normalizePath(url?: string): string {
  if (!url) {
    return "";
  }

  try {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return new URL(url).pathname;
    }
  } catch {
    return "";
  }

  const [pathOnly] = url.split("?");
  return pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`;
}

function isRetryableEndpoint(url?: string): boolean {
  return RETRYABLE_ENDPOINTS.has(normalizePath(url));
}

function isTimeoutError(error: AxiosError): boolean {
  return (
    error.code === "ECONNABORTED" ||
    error.message.toLowerCase().includes("timeout")
  );
}

function isNetworkError(error: AxiosError): boolean {
  if (error.response) {
    return false;
  }

  if (error.code === "ERR_NETWORK") {
    return true;
  }

  return /network\s+error/i.test(error.message);
}

function isRetryableStatus(status?: number): boolean {
  return typeof status === "number" && RETRYABLE_STATUS_CODES.has(status);
}

function shouldRetry(
  error: AxiosError,
  requestConfig: RetryableRequestConfig,
): boolean {
  const method = requestConfig.method?.toUpperCase();

  if (method !== RETRYABLE_METHOD) {
    return false;
  }

  if (!isRetryableEndpoint(requestConfig.url)) {
    return false;
  }

  return (
    isTimeoutError(error) ||
    isNetworkError(error) ||
    isRetryableStatus(error.response?.status)
  );
}

function getRetryAfterDelayMs(error: AxiosError): number | null {
  if (error.response?.status !== 429) {
    return null;
  }

  const retryAfter = error.response.headers?.["retry-after"];

  if (!retryAfter) {
    return null;
  }

  const seconds = Number.parseFloat(String(retryAfter));

  if (!Number.isFinite(seconds) || seconds <= 0) {
    return null;
  }

  return Math.min(seconds * 1000, MAX_DELAY_MS);
}

function computeRetryDelayMs(retryAttempt: number, error: AxiosError): number {
  const retryAfterDelay = getRetryAfterDelayMs(error);

  if (retryAfterDelay !== null) {
    return retryAfterDelay;
  }

  const exponentialDelay = Math.min(
    BASE_DELAY_MS * 2 ** (retryAttempt - 1),
    MAX_DELAY_MS,
  );
  const jitter = Math.floor(Math.random() * (exponentialDelay * 0.2));

  return Math.min(exponentialDelay + jitter, MAX_DELAY_MS);
}

function buildServiceBaseUrl(
  serviceEnvName: "VITE_USER_SERVICE_URL" | "VITE_FOOD_SERVICE_URL" | "VITE_ORDER_SERVICE_URL" | "VITE_PAYMENT_SERVICE_URL",
  fallback: string,
): string {
  const gatewayUrl = import.meta.env.VITE_API_GATEWAY_URL as string | undefined;

  if (gatewayUrl) {
    return gatewayUrl;
  }

  const explicitServiceUrl = import.meta.env[serviceEnvName] as string | undefined;

  if (explicitServiceUrl) {
    return explicitServiceUrl;
  }

  return fallback;
}

function createClient(baseURL: string) {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem(STORAGE_KEYS.token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<{ message?: string }>) => {
      const requestConfig = error.config as RetryableRequestConfig | undefined;

      if (requestConfig && shouldRetry(error, requestConfig)) {
        const currentRetryCount = requestConfig.__retryCount ?? 0;

        if (currentRetryCount < MAX_RETRIES) {
          const nextRetryCount = currentRetryCount + 1;
          requestConfig.__retryCount = nextRetryCount;

          const delayMs = computeRetryDelayMs(nextRetryCount, error);
          await sleep(delayMs);

          return client.request(requestConfig);
        }
      }

      const message =
        error.response?.data?.message || error.message || "Unexpected API error";

      return Promise.reject({
        message,
        status: error.response?.status,
        retryCount: requestConfig?.__retryCount ?? 0,
      });
    },
  );

  return client;
}

export const userApi = createClient(
  buildServiceBaseUrl("VITE_USER_SERVICE_URL", "http://localhost:8081"),
);

export const foodApi = createClient(
  buildServiceBaseUrl("VITE_FOOD_SERVICE_URL", "http://localhost:8082"),
);

export const orderApi = createClient(
  buildServiceBaseUrl("VITE_ORDER_SERVICE_URL", "http://localhost:8083"),
);

export const paymentApi = createClient(
  buildServiceBaseUrl("VITE_PAYMENT_SERVICE_URL", "http://localhost:8084"),
);
