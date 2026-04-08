import { foodApi } from "~/services/http";
import type { Food } from "~/types/models";

export interface UpsertFoodPayload {
  name: string;
  price: number;
  description: string;
}

export async function getFoods(): Promise<Food[]> {
  const response = await foodApi.get<Food[]>("/foods");
  return response.data;
}

export async function createFood(input: UpsertFoodPayload): Promise<Food> {
  const response = await foodApi.post<Food>("/foods", input);
  return response.data;
}

export async function updateFood(
  id: number | string,
  input: UpsertFoodPayload,
): Promise<Food> {
  const response = await foodApi.put<Food>(`/foods/${id}`, input);
  return response.data;
}

export async function deleteFood(id: number | string): Promise<void> {
  await foodApi.delete(`/foods/${id}`);
}
