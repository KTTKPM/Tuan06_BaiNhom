import { Button } from "~/components/ui/button";
import { formatCurrency } from "~/lib/format";
import type { Food } from "~/types/models";

interface FoodItemProps {
  food: Food;
  onAddToCart: (food: Food) => void;
  canManage: boolean;
  onEdit: (food: Food) => void;
  onDelete: (foodId: number | string) => void;
}

export function FoodItem({
  food,
  onAddToCart,
  canManage,
  onEdit,
  onDelete,
}: FoodItemProps) {
  return (
    <article className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <h3 className="text-base font-semibold">{food.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{food.description}</p>
      <p className="mt-3 font-semibold text-primary">{formatCurrency(food.price)}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" onClick={() => onAddToCart(food)}>
          Add to Cart
        </Button>

        {canManage ? (
          <>
            <Button type="button" variant="outline" onClick={() => onEdit(food)}>
              Edit
            </Button>
            <Button type="button" variant="destructive" onClick={() => onDelete(food.id)}>
              Delete
            </Button>
          </>
        ) : null}
      </div>
    </article>
  );
}
