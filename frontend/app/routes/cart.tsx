import { useState } from "react";
import { useNavigate } from "react-router";

import { CartItem } from "~/components/features/cart-item";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/hooks/use-auth";
import { useCart } from "~/hooks/use-cart";
import { useNotification } from "~/hooks/use-notification";
import { useOrders } from "~/hooks/use-orders";
import { useRequireAuth } from "~/hooks/use-route-guards";
import { APP_ROUTES } from "~/lib/constants";
import { formatCurrency } from "~/lib/format";

export default function CartPage() {
  useRequireAuth();

  const { user, isReady, isAuthenticated } = useAuth();
  const { items, totalAmount, updateQuantity, removeFromCart, clearCart } = useCart();
  const { placeOrder, isSubmitting } = useOrders();
  const notification = useNotification();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    if (!user?.id) {
      const message = "Không tìm thấy thông tin người dùng";
      setError(message);
      notification.error(message);
      return;
    }

    if (items.length === 0) {
      const message = "Giỏ hàng đang trống";
      setError(message);
      notification.error(message);
      return;
    }

    setError(null);

    try {
      const order = await placeOrder({
        userId: String(user.id),
        totalAmount,
      });

      clearCart();
      notification.success(`Đặt đơn #${order.id} thành công`);
      console.log(`User ${user.username} đã đặt đơn #${order.id} thành công`);
      navigate(APP_ROUTES.orders);
    } catch (checkoutError) {
      const message =
        checkoutError && typeof checkoutError === "object" && "message" in checkoutError
          ? String(checkoutError.message)
          : "Không thể tạo đơn hàng";
      setError(message);
      notification.error(message);
    }
  }

  if (!isReady) {
    return <p>Đang khởi tạo...</p>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Giỏ hàng</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kiểm tra lại món ăn trước khi tạo đơn.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <p className="font-medium">Giỏ hàng của bạn đang trống.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <CartItem
              key={item.food.id}
              item={item}
              onIncrease={() => updateQuantity(item.food.id, item.quantity + 1)}
              onDecrease={() => updateQuantity(item.food.id, item.quantity - 1)}
              onRemove={() => removeFromCart(item.food.id)}
            />
          ))}
        </div>
      )}

      <section className="rounded-lg border border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-lg font-semibold">Tổng thanh toán: {formatCurrency(totalAmount)}</p>
          <Button type="button" onClick={handleCheckout} disabled={items.length === 0 || isSubmitting}>
            {isSubmitting ? "Đang tạo đơn..." : "Tạo đơn hàng"}
          </Button>
        </div>

        {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      </section>
    </section>
  );
}
