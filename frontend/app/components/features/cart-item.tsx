import { Button } from "~/components/ui/button";
import { formatCurrency } from "~/lib/format";
import type { CartItem as CartItemModel } from "~/types/models";

interface CartItemProps {
  item: CartItemModel;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export function CartItem({ item, onIncrease, onDecrease, onRemove }: CartItemProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold">{item.food.name}</p>
        <p className="text-sm text-muted-foreground">{formatCurrency(item.food.price)}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" onClick={onDecrease}>
          -
        </Button>
        <span className="min-w-8 text-center font-medium">{item.quantity}</span>
        <Button type="button" variant="outline" onClick={onIncrease}>
          +
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <p className="font-semibold">{formatCurrency(item.food.price * item.quantity)}</p>
        <Button type="button" variant="destructive" onClick={onRemove}>
          Xóa
        </Button>
      </div>
    </div>
  );
}
