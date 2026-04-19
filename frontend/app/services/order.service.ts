import { orderApi } from "~/services/http";
import type { CreateOrderPayload, Order } from "~/types/models";

const ORDER_SERVICE_BASE_PATH = "/order";

export async function createOrder(input: CreateOrderPayload): Promise<Order> {
  const response = await orderApi.post(ORDER_SERVICE_BASE_PATH, input);
  const order = response?.data?.data

  if (!order) {
    throw { message: "Invalid create order response from server" };
  }

  return order;
}

export async function getOrders(): Promise<Order[]> {
  const response = await orderApi.get(ORDER_SERVICE_BASE_PATH);
  
  return response?.data?.orders || []
}
