import axios, { AxiosError } from "axios";
import { STORAGE_KEYS } from "~/lib/constants";

function buildApiBaseUrl(): string {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error("Missing required env: VITE_API_BASE_URL");
  }

  return apiBaseUrl;
}

function createClient(baseURL: string, extendedUrl: string) {
  const client = axios.create({
    baseURL: baseURL + "/" + extendedUrl.replace(/^\/+/, ""),
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

const API_BASE_URL = buildApiBaseUrl();

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
