import axios, { AxiosError } from "axios";

import { STORAGE_KEYS } from "~/lib/constants";

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
    (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message || error.message || "Unexpected API error";
      return Promise.reject({
        message,
        status: error.response?.status,
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
