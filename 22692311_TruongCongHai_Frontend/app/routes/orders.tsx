import { useEffect, useState } from "react";

import { OrderList } from "~/components/features/order-list";
import { PaymentForm } from "~/components/features/payment-form";
import { useAuth } from "~/hooks/use-auth";
import { useNotification } from "~/hooks/use-notification";
import { useOrders } from "~/hooks/use-orders";
import { useRequireAuth } from "~/hooks/use-route-guards";
import type { Order } from "~/types/models";

export default function OrdersPage() {
  useRequireAuth();

  const { user, isReady, isAuthenticated } = useAuth();
  const { orders, isLoading, refreshOrders, upsertOrder } = useOrders();
  const notification = useNotification();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady || !isAuthenticated || !user) {
      return;
    }

    const userId = user.role === "ADMIN" ? undefined : user.id;

    void (async () => {
      try {
        await refreshOrders(userId);
      } catch (ordersError) {
        const message =
          ordersError && typeof ordersError === "object" && "message" in ordersError
            ? String(ordersError.message)
            : "Khong the tai danh sach don hang";
        setErrorMessage(message);
        notification.error(message);
      }
    })();
  }, [isReady, isAuthenticated, user, refreshOrders, notification]);

  if (!isReady) {
    return <p>Dang khoi tao...</p>;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  function handlePaidOrder(order: Order) {
    upsertOrder(order);
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Don hang</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Theo doi trang thai don va thanh toan COD/Banking.
        </p>
      </header>

      <OrderList
        orders={orders}
        isLoading={isLoading}
        errorMessage={errorMessage}
        renderPaymentForm={(order) => {
          if (order.paymentStatus === "PAID") {
            return <p className="text-sm text-emerald-600">Don hang da thanh toan.</p>;
          }

          return (
            <PaymentForm
              orderId={order.id}
              userId={user.id}
              onPaid={handlePaidOrder}
              disabled={order.status === "CANCELLED"}
            />
          );
        }}
      />
    </section>
  );
}
