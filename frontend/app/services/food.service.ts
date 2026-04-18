import { foodApi } from "~/services/http";
import type { Food } from "~/types/models";

const FOOD_SERVICE_BASE_PATH = "/api/foods";

export interface UpsertFoodPayload {
  name: string;
  category: string;
  price: number;
  available: boolean;
}

function unwrapData<T>(value: unknown): T | null {
  if (value && typeof value === "object" && "data" in value) {
    return (value as { data?: T }).data ?? null;
  }

  return (value as T) ?? null;
}

function normalizeFood(raw: unknown): Food | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const value = raw as {
    id?: number | string;
    name?: string;
    category?: string;
    price?: number | string;
    available?: boolean;
  };

  if (
    value.id === undefined ||
    value.id === null ||
    !value.name ||
    !value.category ||
    value.price === undefined ||
    value.price === null ||
    typeof value.available !== "boolean"
  ) {
    return null;
  }

  const normalizedPrice =
    typeof value.price === "number" ? value.price : Number.parseFloat(String(value.price));

  if (!Number.isFinite(normalizedPrice)) {
    return null;
  }

  return {
    id: value.id,
    name: value.name,
    category: value.category,
    price: normalizedPrice,
    available: value.available,
  };
}

export async function getFoods(): Promise<Food[]> {
  const response = await foodApi.get(FOOD_SERVICE_BASE_PATH);
  const payload = unwrapData<Food[]>(response.data);

  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .map((item) => normalizeFood(item))
    .filter((item): item is Food => item !== null);
}

export async function createFood(input: UpsertFoodPayload): Promise<Food> {
  const response = await foodApi.post(FOOD_SERVICE_BASE_PATH, input);
  const payload = unwrapData<Food>(response.data);
  const food = normalizeFood(payload);

  if (!food) {
    throw { message: "Invalid create food response from server" };
  }

  return food;
}

export async function updateFood(
  id: number | string,
  input: UpsertFoodPayload,
): Promise<Food> {
  const response = await foodApi.put(`${FOOD_SERVICE_BASE_PATH}/${id}`, input);
  const payload = unwrapData<Food>(response.data);
  const food = normalizeFood(payload);

  if (!food) {
    throw { message: "Invalid update food response from server" };
  }

  return food;
}

export async function deleteFood(id: number | string): Promise<void> {
  await foodApi.delete(`${FOOD_SERVICE_BASE_PATH}/${id}`);
}
