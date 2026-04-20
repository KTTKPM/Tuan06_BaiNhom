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
      <p className="mt-1 text-sm text-muted-foreground">Danh mục: {food.category}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Trạng thái: {food.available ? "Còn bán" : "Hết hàng"}
      </p>
      <p className="mt-3 font-semibold text-primary">{formatCurrency(food.price)}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" onClick={() => onAddToCart(food)} disabled={!food.available}>
          Thêm vào giỏ
        </Button>

        {canManage ? (
          <>
            <Button type="button" variant="outline" onClick={() => onEdit(food)}>
              Sửa
            </Button>
            <Button type="button" variant="destructive" onClick={() => onDelete(food.id)}>
              Xóa
            </Button>
          </>
        ) : null}
      </div>
    </article>
  );
}
