import { useCallback, useEffect, useMemo, useState } from "react";

import { OrderList } from "~/components/features/order-list";
import { useAuth } from "~/hooks/use-auth";
import { useNotification } from "~/hooks/use-notification";
import { useOrders } from "~/hooks/use-orders";
import { useRequireAuth } from "~/hooks/use-route-guards";
import type { PaymentResult } from "~/types/models";

export default function OrdersPage() {
  useRequireAuth();

  const { user, isReady, isAuthenticated } = useAuth();
  const { orders, isLoading, refreshOrders, applyOrderUpdate } = useOrders();
  const notification = useNotification();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const visibleOrders = useMemo(() => {
    if (!user) {
      return [];
    }

    if (user.role === "ADMIN") {
      return orders;
    }

    return orders.filter((order) => String(order.userId) === String(user.id));
  }, [orders, user]);

  const handlePaymentSuccess = useCallback(
    (paymentResult: PaymentResult) => {
      if (paymentResult.order) {
        applyOrderUpdate(paymentResult.order);
        return;
      }

      void refreshOrders();
    },
    [applyOrderUpdate, refreshOrders],
  );

  useEffect(() => {
    if (!isReady || !isAuthenticated || !user) {
      return;
    }

    void (async () => {
      try {
        await refreshOrders();
      } catch (ordersError) {
        const message =
          ordersError && typeof ordersError === "object" && "message" in ordersError
            ? String(ordersError.message)
            : "Không thể tải danh sách đơn hàng";
        setErrorMessage(message);
        notification.error(message);
      }
    })();
  }, [isReady, isAuthenticated, user, refreshOrders, notification]);

  if (!isReady) {
    return <p>Đang khởi tạo...</p>;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Đơn hàng</h1>
        <p className="mt-1 text-sm text-muted-foreground">Danh sách đơn hàng của hệ thống.</p>
      </header>

      <OrderList
        orders={visibleOrders}
        isLoading={isLoading}
        errorMessage={errorMessage}
        currentUserId={user.id}
        isAdmin={user.role === "ADMIN"}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </section>
  );
}
