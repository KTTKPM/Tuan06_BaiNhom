export const STORAGE_KEYS = {
  token: "mfos_token",
  user: "mfos_user",
  cart: "mfos_cart",
} as const;

export const AUTH_EVENTS = {
  sessionExpired: "mfos_auth_session_expired",
} as const;

export const APP_ROUTES = {
  login: "/login",
  register: "/register",
  foods: "/foods",
  cart: "/cart",
  orders: "/orders",
} as const;
