import { orderApi } from "~/services/http";
import type { CreateOrderPayload, Order } from "~/types/models";

export async function createOrder(input: CreateOrderPayload): Promise<Order> {
  const response = await orderApi.post("/", input);
  const order = response?.data?.data;

  if (!order) {
    throw { message: "Invalid create order response from server" };
  }

  return order;
}

export async function getOrders(): Promise<Order[]> {
  const response = await orderApi.get("/");

  return response?.data?.orders || [];
}
