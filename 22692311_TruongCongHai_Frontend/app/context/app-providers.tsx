import { AuthProvider } from "~/context/auth-context";
import { CartProvider } from "~/context/cart-context";
import { NotificationProvider } from "~/context/notification-context";
import { OrderProvider } from "~/context/order-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>{children}</OrderProvider>
        </CartProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}
