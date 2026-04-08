import { userApi } from "~/services/http";
import type { AuthSession, User } from "~/types/models";

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  usernameOrEmail: string;
  password: string;
}

function coerceUser(rawUser: unknown): User | null {
  if (!rawUser || typeof rawUser !== "object") {
    return null;
  }

  const value = rawUser as {
    id?: string | number;
    username?: string;
    email?: string;
    role?: "USER" | "ADMIN";
  };

  if (!value.id || !value.username || !value.role) {
    return null;
  }

  return {
    id: value.id,
    username: value.username,
    email: value.email,
    role: value.role,
  };
}

function normalizeAuthResponse(data: unknown): AuthSession | null {
  const payload = data as {
    token?: string;
    accessToken?: string;
    user?: User;
    data?: {
      token?: string;
      accessToken?: string;
      user?: User;
    };
  };

  const token =
    payload.token || payload.accessToken || payload.data?.token || payload.data?.accessToken;

  const user = coerceUser(payload.user) || coerceUser(payload.data?.user);

  if (!token || !user) {
    return null;
  }

  return { token, user };
}

export async function registerUser(input: RegisterPayload): Promise<AuthSession | null> {
  const response = await userApi.post("/register", input);
  return normalizeAuthResponse(response.data);
}

export async function loginUser(input: LoginPayload): Promise<AuthSession> {
  const response = await userApi.post("/login", input);
  const session = normalizeAuthResponse(response.data);

  if (!session) {
    throw { message: "Invalid login response from server" };
  }

  return session;
}

export async function getUsers(): Promise<User[]> {
  const response = await userApi.get<User[]>("/users");
  return response.data;
}
