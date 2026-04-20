import { PaymentForm } from "~/components/features/payment-form";
import { formatCurrency, formatDateTime } from "~/lib/format";
import type { Order, PaymentResult } from "~/types/models";

interface OrderListProps {
  orders: Order[];
  isLoading: boolean;
  errorMessage: string | null;
  currentUserId: number | string;
  isAdmin: boolean;
  onPaymentSuccess: (paymentResult: PaymentResult) => void;
}

export function OrderList({
  orders,
  isLoading,
  errorMessage,
  currentUserId,
  isAdmin,
  onPaymentSuccess,
}: OrderListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-44 animate-pulse rounded-lg border border-border bg-muted" />
        ))}
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
        <p className="font-medium">Không thể tải danh sách đơn hàng.</p>
        <p className="mt-1 text-sm text-muted-foreground">{errorMessage}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        <p className="font-medium">Bạn chưa có đơn hàng nào.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const normalizedStatus = String(order.status).toUpperCase();
        const isPayableStatus = normalizedStatus === "PENDING" || normalizedStatus === "UNPAID";
        const canPayOrder =
          isPayableStatus &&
          (isAdmin || String(order.userId) === String(currentUserId));

        return (
          <article key={order.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold">Đơn #{order.id}</h3>
              <span className="rounded-md bg-muted px-2 py-1 text-sm">Trạng thái: {order.status}</span>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Tạo lúc: {formatDateTime(order.createdAt)}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">Người dùng: {order.userId}</p>

            <p className="mt-3 font-semibold">Tổng tiền: {formatCurrency(Number(order.totalAmount))}</p>

            {canPayOrder ? (
              <div className="mt-3">
                <PaymentForm
                  orderId={order.id}
                  userId={order.userId}
                  onPaid={onPaymentSuccess}
                />
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
