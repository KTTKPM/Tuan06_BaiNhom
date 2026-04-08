import { orderApi } from "~/services/http";
import type { CreateOrderPayload, Order } from "~/types/models";

export async function createOrder(input: CreateOrderPayload): Promise<Order> {
  const response = await orderApi.post<Order>("/orders", input);
  return response.data;
}

export async function getOrders(userId?: string | number): Promise<Order[]> {
  const response = await orderApi.get<Order[]>("/orders", {
    params: userId ? { userId } : undefined,
  });
  return response.data;
}
