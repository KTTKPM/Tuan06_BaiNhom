import { formatCurrency, formatDateTime } from "~/lib/format";
import type { Order } from "~/types/models";

interface OrderListProps {
  orders: Order[];
  isLoading: boolean;
  errorMessage: string | null;
  renderPaymentForm: (order: Order) => React.ReactNode;
}

export function OrderList({
  orders,
  isLoading,
  errorMessage,
  renderPaymentForm,
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
        <p className="font-medium">Khong the tai danh sach don hang.</p>
        <p className="mt-1 text-sm text-muted-foreground">{errorMessage}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        <p className="font-medium">Ban chua co don hang nao.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <article key={order.id} className="rounded-lg border border-border bg-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold">Don #{order.id}</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="rounded-md bg-muted px-2 py-1">Order: {order.status}</span>
              <span className="rounded-md bg-muted px-2 py-1">Payment: {order.paymentStatus}</span>
            </div>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Tao luc: {formatDateTime(order.createdAt)}
          </p>

          <ul className="mt-3 list-disc pl-6 text-sm text-muted-foreground">
            {order.items.map((item) => (
              <li key={`${order.id}-${item.foodId}`}>
                {item.name} x {item.quantity} ({formatCurrency(item.price)})
              </li>
            ))}
          </ul>

          <p className="mt-3 font-semibold">Tong tien: {formatCurrency(order.totalAmount)}</p>

          <div className="mt-4">{renderPaymentForm(order)}</div>
        </article>
      ))}
    </div>
  );
}
