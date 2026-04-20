import { userApi } from "~/services/http";
import type { AuthSession, User } from "~/types/models";

export interface RegisterPayload {
  username: string;
  password: string;
  role: "USER" | "ADMIN";
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  accessToken?: string;
  user: {
    id: number;
    username: string;
    role: "USER" | "ADMIN";
  }
}

export interface RegisterResponse {
  data: {
    id: number;
    username: string;
    role: "USER" | "ADMIN";
  }
  message: string;
}

export async function registerUser(input: RegisterPayload): Promise<RegisterResponse | null> {
  const response = await userApi.post("/register", input);
  return response?.data;
}

function normalizeAuthSessionPayload(payload: unknown): LoginResponse | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const response = payload as {
    token?: string;
    accessToken?: string;
    user?: LoginResponse["user"];
    data?: {
      token?: string;
      accessToken?: string;
      user?: LoginResponse["user"];
    };
  };

  const token = response.token || response.accessToken || response.data?.token || response.data?.accessToken;
  const user = response.user || response.data?.user;

  if (!token || !user) {
    return null;
  }

  return {
    token,
    accessToken: token,
    user,
  };
}

export async function loginUser(input: LoginPayload): Promise<LoginResponse | null> {
  const response = await userApi.post("/login", {
    username: input.username,
    password: input.password,
  });
  const session = normalizeAuthSessionPayload(response?.data);

  if (!session) {
    throw { message: "Invalid login response from server" };
  }

  return session;
}

export async function refreshUserSession(): Promise<LoginResponse | null> {
  const response = await userApi.post("/refresh");
  const session = normalizeAuthSessionPayload(response?.data);

  if (!session) {
    throw { message: "Invalid refresh response from server" };
  }

  return session;
}

export async function logoutUser(): Promise<void> {
  await userApi.post("/logout");
}

export async function getUsers(): Promise<User[]> {
  const response = await userApi.get<User[]>("/");
  return response?.data || [];
}
