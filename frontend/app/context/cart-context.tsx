import { createContext, useEffect, useMemo, useReducer } from "react";

import { STORAGE_KEYS } from "~/lib/constants";
import type { CartItem, Food } from "~/types/models";

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "HYDRATE"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: Food }
  | { type: "UPDATE_QUANTITY"; payload: { foodId: number | string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: number | string }
  | { type: "CLEAR" };

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addToCart: (food: Food) => void;
  updateQuantity: (foodId: number | string, quantity: number) => void;
  removeFromCart: (foodId: number | string) => void;
  clearCart: () => void;
}

const initialState: CartState = {
  items: [],
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return {
        items: action.payload,
      };
    case "ADD_ITEM": {
      const existing = state.items.find((item) => item.food.id === action.payload.id);

      if (existing) {
        return {
          items: state.items.map((item) =>
            item.food.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }

      return {
        items: [...state.items, { food: action.payload, quantity: 1 }],
      };
    }
    case "UPDATE_QUANTITY": {
      const nextItems = state.items
        .map((item) =>
          item.food.id === action.payload.foodId
            ? { ...item, quantity: action.payload.quantity }
            : item,
        )
        .filter((item) => item.quantity > 0);

      return { items: nextItems };
    }
    case "REMOVE_ITEM":
      return {
        items: state.items.filter((item) => item.food.id !== action.payload),
      };
    case "CLEAR":
      return initialState;
    default:
      return state;
  }
}

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const cartRaw = window.localStorage.getItem(STORAGE_KEYS.cart);

  if (!cartRaw) {
    return [];
  }

  try {
    const parsed = JSON.parse(cartRaw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    dispatch({ type: "HYDRATE", payload: readStoredCart() });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(state.items));
    }
  }, [state.items]);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = state.items.reduce(
      (sum, item) => sum + item.food.price * item.quantity,
      0,
    );

    return {
      items: state.items,
      totalItems,
      totalAmount,
      addToCart: (food) => dispatch({ type: "ADD_ITEM", payload: food }),
      updateQuantity: (foodId, quantity) =>
        dispatch({ type: "UPDATE_QUANTITY", payload: { foodId, quantity } }),
      removeFromCart: (foodId) => dispatch({ type: "REMOVE_ITEM", payload: foodId }),
      clearCart: () => dispatch({ type: "CLEAR" }),
    };
  }, [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
