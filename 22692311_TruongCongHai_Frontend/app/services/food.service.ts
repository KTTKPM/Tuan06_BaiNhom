import { foodApi } from "~/services/http";
import type { Food } from "~/types/models";

const FOOD_SERVICE_BASE_PATH = "/api/foods";

export interface UpsertFoodPayload {
  name: string;
  price: number;
  description: string;
}

export async function getFoods(): Promise<Food[]> {
  const response = await foodApi.get<Food[]>(FOOD_SERVICE_BASE_PATH);
  return response.data;
}

export async function createFood(input: UpsertFoodPayload): Promise<Food> {
  const response = await foodApi.post<Food>(FOOD_SERVICE_BASE_PATH, input);
  return response.data;
}

export async function updateFood(
  id: number | string,
  input: UpsertFoodPayload,
): Promise<Food> {
  const response = await foodApi.put<Food>(`${FOOD_SERVICE_BASE_PATH}/${id}`, input);
  return response.data;
}

export async function deleteFood(id: number | string): Promise<void> {
  await foodApi.delete(`${FOOD_SERVICE_BASE_PATH}/${id}`);
}
