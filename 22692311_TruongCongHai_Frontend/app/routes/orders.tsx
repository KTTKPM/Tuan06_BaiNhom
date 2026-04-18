import { useEffect, useMemo, useState } from "react";

import { OrderList } from "~/components/features/order-list";
import { useAuth } from "~/hooks/use-auth";
import { useNotification } from "~/hooks/use-notification";
import { useOrders } from "~/hooks/use-orders";
import { useRequireAuth } from "~/hooks/use-route-guards";

export default function OrdersPage() {
  useRequireAuth();

  const { user, isReady, isAuthenticated } = useAuth();
  const { orders, isLoading, refreshOrders } = useOrders();
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

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Don hang</h1>
        <p className="mt-1 text-sm text-muted-foreground">Danh sach don hang cua he thong.</p>
      </header>

      <OrderList orders={visibleOrders} isLoading={isLoading} errorMessage={errorMessage} />
    </section>
  );
}
