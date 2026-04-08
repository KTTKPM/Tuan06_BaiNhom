export type UserRole = "USER" | "ADMIN";

export interface User {
  id: number | string;
  username: string;
  email?: string;
  role: UserRole;
}

export interface AuthSession {
  token: string;
  user: User;
}

export interface Food {
  id: number | string;
  name: string;
  category: string;
  price: number;
  available: boolean;
}

export interface CartItem {
  food: Food;
  quantity: number;
}

export type OrderStatus = string;
export type PaymentStatus = "UNPAID" | "PAID" | "FAILED";
export type PaymentMethod = "COD" | "BANKING";

export interface OrderItem {
  foodId: number | string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number | string;
  userId: string;
  totalAmount: number | string;
  status: OrderStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderPayload {
  userId: string;
  totalAmount: number;
}

export interface PaymentPayload {
  orderId: number | string;
  method: PaymentMethod;
  userId?: number | string;
}

export interface ApiError {
  message: string;
  status?: number;
}
