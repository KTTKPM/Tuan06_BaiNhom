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
  price: number;
  description: string;
}

export interface CartItem {
  food: Food;
  quantity: number;
}

export interface CreateOrderItem {
  foodId: number | string;
  quantity: number;
}

export type OrderStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
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
  userId: number | string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt?: string;
}

export interface CreateOrderPayload {
  userId: number | string;
  items: CreateOrderItem[];
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
