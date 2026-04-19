import { paymentApi } from "~/services/http";
import type { PaymentPayload, PaymentRecord, PaymentResult } from "~/types/models";

type RawPaymentHistoryItem = {
  id?: number | string;
  order_id?: number | string;
  orderId?: number | string;
  customer_name?: string;
  customerName?: string;
  payment_method?: string;
  paymentMethod?: string;
  status?: string;
  created_at?: string;
  createdAt?: string;
};

function normalizePaymentHistoryItem(item: RawPaymentHistoryItem): PaymentRecord {
  return {
    id: item.id,
    orderId: item.orderId ?? item.order_id ?? "",
    customerName: item.customerName ?? item.customer_name ?? "Unknown",
    paymentMethod: item.paymentMethod ?? item.payment_method ?? "COD",
    status: item.status ?? "UNPAID",
    createdAt: item.createdAt ?? item.created_at,
  };
}

export async function createPayment(input: PaymentPayload): Promise<PaymentResult> {
  const response = await paymentApi.post<PaymentResult>("/", input);
  const payload = response?.data;

  if (!payload || payload.success !== true) {
    throw { message: payload?.message || "Thanh toán thất bại" };
  }

  return payload;
}

export async function getPaymentHistory(): Promise<PaymentRecord[]> {
  const response = await paymentApi.get<RawPaymentHistoryItem[]>("/history");
  const payload = response?.data;

  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.map(normalizePaymentHistoryItem);
}
