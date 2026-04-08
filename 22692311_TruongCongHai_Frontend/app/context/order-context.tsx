import { createContext, useCallback, useMemo, useState } from "react";

import { createOrder, getOrders } from "~/services/order.service";
import type { CreateOrderPayload, Order } from "~/types/models";

interface OrderContextValue {
  orders: Order[];
  isLoading: boolean;
  isSubmitting: boolean;
  refreshOrders: () => Promise<void>;
  placeOrder: (payload: CreateOrderPayload) => Promise<Order>;
}

export const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshOrders = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await getOrders();
      setOrders(response);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const placeOrder = useCallback(async (payload: CreateOrderPayload) => {
    setIsSubmitting(true);

    try {
      const created = await createOrder(payload);
      setOrders((current) => [created, ...current]);
      return created;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      orders,
      isLoading,
      isSubmitting,
      refreshOrders,
      placeOrder,
    }),
    [orders, isLoading, isSubmitting, refreshOrders, placeOrder],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}
