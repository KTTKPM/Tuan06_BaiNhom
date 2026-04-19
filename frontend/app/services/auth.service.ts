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

export async function loginUser(input: LoginPayload): Promise<LoginResponse | null> {
  const response = await userApi.post("/login", {
    username: input.username,
    password: input.password,
  });
  const session = response?.data;

  if (!session) {
    throw { message: "Invalid login response from server" };
  }

  return session;
}

export async function getUsers(): Promise<User[]> {
  const response = await userApi.get<User[]>("/");
  return response?.data || [];
}
