import { useState } from "react";

import { Button } from "~/components/ui/button";
import { useNotification } from "~/hooks/use-notification";
import { createPayment } from "~/services/payment.service";
import type { PaymentMethod, PaymentResult } from "~/types/models";

interface PaymentFormProps {
  orderId: number | string;
  userId?: number | string;
  disabled?: boolean;
  onPaid: (paymentResult: PaymentResult) => void;
}

export function PaymentForm({ orderId, userId, disabled, onPaid }: PaymentFormProps) {
  const [method, setMethod] = useState<PaymentMethod>("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const notification = useNotification();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const paymentResult = await createPayment({
        orderId,
        method,
        userId,
      });

      onPaid(paymentResult);
      notification.success(paymentResult.message || `Thanh toán đơn #${orderId} thành công`);
    } catch (paymentError) {
      const message =
        paymentError && typeof paymentError === "object" && "message" in paymentError
          ? String(paymentError.message)
          : "Thanh toán thất bại";
      setError(message);
      notification.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-2 rounded-md border border-border bg-muted/40 p-3" onSubmit={handleSubmit}>
      <label className="block text-sm font-medium" htmlFor={`payment-method-${orderId}`}>
        Phương thức thanh toán
      </label>
      <select
        id={`payment-method-${orderId}`}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        value={method}
        onChange={(event) => setMethod(event.target.value as PaymentMethod)}
        disabled={disabled || isSubmitting}
      >
        <option value="COD">COD</option>
        <option value="BANKING">Banking</option>
      </select>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" disabled={disabled || isSubmitting}>
        {isSubmitting ? "Đang thanh toán..." : "Thanh toán"}
      </Button>
    </form>
  );
}
