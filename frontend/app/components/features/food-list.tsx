import { FoodItem } from "~/components/features/food-item";
import type { Food } from "~/types/models";

interface FoodListProps {
  foods: Food[];
  isLoading: boolean;
  errorMessage: string | null;
  onReload: () => void;
  onAddToCart: (food: Food) => void;
  canManage: boolean;
  onEdit: (food: Food) => void;
  onDelete: (foodId: number | string) => void;
}

export function FoodList({
  foods,
  isLoading,
  errorMessage,
  onReload,
  onAddToCart,
  canManage,
  onEdit,
  onDelete,
}: FoodListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-40 animate-pulse rounded-lg border border-border bg-muted" />
        ))}
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
        <p className="font-medium">Khong the tai danh sach mon an.</p>
        <p className="mt-1 text-sm text-muted-foreground">{errorMessage}</p>
        <button
          type="button"
          className="mt-3 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
          onClick={onReload}
        >
          Thu lai
        </button>
      </div>
    );
  }

  if (foods.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        <p className="font-medium">Chua co mon an nao.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {foods.map((food) => (
        <FoodItem
          key={food.id}
          food={food}
          onAddToCart={onAddToCart}
          canManage={canManage}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
