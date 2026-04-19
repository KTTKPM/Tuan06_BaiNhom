import { paymentApi } from "~/services/http";
import type { Order, PaymentPayload } from "~/types/models";

export async function createPayment(input: PaymentPayload): Promise<Order> {
  const response = await paymentApi.post<Order>("/", input);
  return response.data;
}
