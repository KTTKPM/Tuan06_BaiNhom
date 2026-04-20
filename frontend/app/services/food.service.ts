import { foodApi } from "~/services/http";
import type { Food } from "~/types/models";

export interface UpsertFoodPayload {
  name: string;
  category: string;
  price: number;
  available: boolean;
}

export async function getFoods(): Promise<Food[]> {
  const response = await foodApi.get("/");
  return response?.data || [];
}

export async function createFood(input: UpsertFoodPayload): Promise<Food> {
  const response = await foodApi.post("/", input);
  const food = response?.data;

  if (!food) {
    throw { message: "Invalid create food response from server" };
  }

  return food;
}

export async function updateFood(
  id: number | string,
  input: UpsertFoodPayload,
): Promise<Food> {
  const response = await foodApi.put(`/${id}`, input);
  const food = response?.data;

  if (!food) {
    throw { message: "Invalid update food response from server" };
  }

  return food;
}

export async function deleteFood(id: number | string): Promise<void> {
  await foodApi.delete(`/${id}`);
}
