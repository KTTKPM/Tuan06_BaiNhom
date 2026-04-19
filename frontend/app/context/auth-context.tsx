import { createContext, useCallback, useEffect, useMemo, useReducer } from "react";

import { STORAGE_KEYS } from "~/lib/constants";
import { loginUser, registerUser } from "~/services/auth.service";
import type { LoginPayload, RegisterPayload } from "~/services/auth.service";
import type { AuthSession, User } from "~/types/models";

interface AuthState {
  token: string | null;
  user: User | null;
  isReady: boolean;
  isSubmitting: boolean;
}

type AuthAction =
  | { type: "HYDRATE"; payload: AuthSession | null }
  | { type: "SUBMIT_START" }
  | { type: "SET_SESSION"; payload: AuthSession }
  | { type: "CLEAR_SESSION" }
  | { type: "SUBMIT_END" };

interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  login: (input: LoginPayload) => Promise<void>;
  register: (input: RegisterPayload) => Promise<boolean>;
  logout: () => void;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isReady: false,
  isSubmitting: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "HYDRATE":
      return {
        ...state,
        token: action.payload?.token ?? null,
        user: action.payload?.user ?? null,
        isReady: true,
      };
    case "SUBMIT_START":
      return {
        ...state,
        isSubmitting: true,
      };
    case "SET_SESSION":
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isSubmitting: false,
      };
    case "CLEAR_SESSION":
      return {
        ...state,
        token: null,
        user: null,
        isSubmitting: false,
      };
    case "SUBMIT_END":
      return {
        ...state,
        isSubmitting: false,
      };
    default:
      return state;
  }
}

function readStoredSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const token = window.localStorage.getItem(STORAGE_KEYS.token);
  const userRaw = window.localStorage.getItem(STORAGE_KEYS.user);

  if (!token || !userRaw) {
    return null;
  }

  try {
    const user = JSON.parse(userRaw) as User;
    return { token, user };
  } catch {
    return null;
  }
}

function persistSession(session: AuthSession | null): void {
  if (typeof window === "undefined") {
    return;
  }

  if (!session) {
    window.localStorage.removeItem(STORAGE_KEYS.token);
    window.localStorage.removeItem(STORAGE_KEYS.user);
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.token, session.token);
  window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(session.user));
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    dispatch({ type: "HYDRATE", payload: readStoredSession() });
  }, []);

  const logout = useCallback(() => {
    persistSession(null);
    dispatch({ type: "CLEAR_SESSION" });
  }, []);

  const login = useCallback(async (input: LoginPayload) => {
    dispatch({ type: "SUBMIT_START" });

    try {
      const session = await loginUser(input);
      persistSession(session);
      dispatch({ type: "SET_SESSION", payload: session as AuthSession });
    } catch (error) {
      dispatch({ type: "SUBMIT_END" });
      throw error;
    }
  }, []);

  const register = useCallback(async (input: RegisterPayload) => {
    dispatch({ type: "SUBMIT_START" });

    try {
      await registerUser(input);

      dispatch({ type: "SUBMIT_END" });
      return true;
    } catch (error) {
      dispatch({ type: "SUBMIT_END" });
      throw error;
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      isAuthenticated: Boolean(state.token && state.user),
      login,
      register,
      logout,
    }),
    [state, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
