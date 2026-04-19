import { orderApi } from "~/services/http";
import type { CreateOrderPayload, Order } from "~/types/models";

const ORDER_SERVICE_BASE_PATH = "/order";

function unwrapData<T>(value: unknown): T | null {
  if (value && typeof value === "object" && "data" in value) {
    return (value as { data?: T }).data ?? null;
  }

  return (value as T) ?? null;
}

function normalizeOrder(raw: unknown): Order | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const value = raw as {
    id?: number | string;
    userId?: string;
    totalAmount?: number | string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
  };

  if (
    value.id === undefined ||
    value.id === null ||
    !value.userId ||
    value.totalAmount === undefined ||
    value.totalAmount === null ||
    !value.status
  ) {
    return null;
  }

  return {
    id: value.id,
    userId: value.userId,
    totalAmount: value.totalAmount,
    status: value.status,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  };
}

export async function createOrder(input: CreateOrderPayload): Promise<Order> {
  const response = await orderApi.post(ORDER_SERVICE_BASE_PATH, input);
  const payload = unwrapData<Order>(response.data);
  const order = normalizeOrder(payload);

  if (!order) {
    throw { message: "Invalid create order response from server" };
  }

  return order;
}

export async function getOrders(): Promise<Order[]> {
  const response = await orderApi.get(ORDER_SERVICE_BASE_PATH);
  const payload = unwrapData<Order[]>(response.data);

  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .map((item) => normalizeOrder(item))
    .filter((item): item is Order => item !== null);
}
