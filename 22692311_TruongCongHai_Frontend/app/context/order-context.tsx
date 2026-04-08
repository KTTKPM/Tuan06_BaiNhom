import { createContext, useCallback, useMemo, useState } from "react";

import { createOrder, getOrders } from "~/services/order.service";
import type { CreateOrderPayload, Order } from "~/types/models";

interface OrderContextValue {
  orders: Order[];
  isLoading: boolean;
  isSubmitting: boolean;
  refreshOrders: (userId?: string | number) => Promise<void>;
  placeOrder: (payload: CreateOrderPayload) => Promise<Order>;
  upsertOrder: (order: Order) => void;
}

export const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshOrders = useCallback(async (userId?: string | number) => {
    setIsLoading(true);

    try {
      const response = await getOrders(userId);
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

  const upsertOrder = useCallback((order: Order) => {
    setOrders((current) => {
      const index = current.findIndex((item) => item.id === order.id);

      if (index === -1) {
        return [order, ...current];
      }

      const cloned = [...current];
      cloned[index] = order;
      return cloned;
    });
  }, []);

  const value = useMemo(
    () => ({
      orders,
      isLoading,
      isSubmitting,
      refreshOrders,
      placeOrder,
      upsertOrder,
    }),
    [orders, isLoading, isSubmitting, refreshOrders, placeOrder, upsertOrder],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}
