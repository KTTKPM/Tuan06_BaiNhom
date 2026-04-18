import { useEffect, useMemo, useState } from "react";

import { FoodList } from "~/components/features/food-list";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useAuth } from "~/hooks/use-auth";
import { useCart } from "~/hooks/use-cart";
import { useNotification } from "~/hooks/use-notification";
import { useRequireAuth } from "~/hooks/use-route-guards";
import {
  createFood,
  deleteFood,
  getFoods,
  updateFood,
  type UpsertFoodPayload,
} from "~/services/food.service";
import type { Food } from "~/types/models";

const defaultFoodForm = {
  name: "",
  category: "",
  price: "",
  available: "true",
};

export default function FoodsPage() {
  useRequireAuth();

  const { isReady, isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const notification = useNotification();

  const [foods, setFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmittingFood, setIsSubmittingFood] = useState(false);
  const [editingFoodId, setEditingFoodId] = useState<number | string | null>(null);
  const [foodForm, setFoodForm] = useState(defaultFoodForm);

  const canManageFood = useMemo(() => user?.role === "ADMIN", [user?.role]);

  async function loadFoods() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getFoods();
      setFoods(response);
    } catch (foodsError) {
      const message =
        foodsError && typeof foodsError === "object" && "message" in foodsError
          ? String(foodsError.message)
          : "Khong the tai mon an";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isReady || !isAuthenticated) {
      return;
    }

    void loadFoods();
  }, [isReady, isAuthenticated]);

  function handleAddToCart(food: Food) {
    addToCart(food);
    notification.success(`Da them ${food.name} vao gio hang`);
  }

  function startEdit(food: Food) {
    setEditingFoodId(food.id);
    setFoodForm({
      name: food.name,
      category: food.category,
      price: String(food.price),
      available: String(food.available),
    });
  }

  function resetFoodForm() {
    setEditingFoodId(null);
    setFoodForm(defaultFoodForm);
  }

  async function handleUpsertFood(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: UpsertFoodPayload = {
      name: foodForm.name.trim(),
      category: foodForm.category.trim(),
      price: Number(foodForm.price),
      available: foodForm.available === "true",
    };

    if (!payload.name || payload.name.length > 120) {
      notification.error("Ten mon khong hop le (toi da 120 ky tu)");
      return;
    }

    if (!payload.category || payload.category.length > 60) {
      notification.error("Danh muc khong hop le (toi da 60 ky tu)");
      return;
    }

    if (Number.isNaN(payload.price) || payload.price <= 0) {
      notification.error("Gia mon phai lon hon 0");
      return;
    }

    setIsSubmittingFood(true);

    try {
      if (editingFoodId) {
        const updated = await updateFood(editingFoodId, payload);
        setFoods((current) =>
          current.map((food) => (food.id === updated.id ? updated : food)),
        );
        notification.success("Cap nhat mon an thanh cong");
      } else {
        const created = await createFood(payload);
        setFoods((current) => [created, ...current]);
        notification.success("Them mon an thanh cong");
      }

      resetFoodForm();
    } catch (upsertError) {
      const message =
        upsertError && typeof upsertError === "object" && "message" in upsertError
          ? String(upsertError.message)
          : "Khong the luu mon an";
      notification.error(message);
    } finally {
      setIsSubmittingFood(false);
    }
  }

  async function handleDeleteFood(foodId: number | string) {
    const shouldDelete = window.confirm("Ban co chac muon xoa mon an nay?");
    if (!shouldDelete) {
      return;
    }

    try {
      await deleteFood(foodId);
      setFoods((current) => current.filter((food) => food.id !== foodId));
      notification.success("Xoa mon an thanh cong");
    } catch (deleteError) {
      const message =
        deleteError && typeof deleteError === "object" && "message" in deleteError
          ? String(deleteError.message)
          : "Khong the xoa mon an";
      notification.error(message);
    }
  }

  if (!isReady) {
    return <p>Dang khoi tao...</p>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Danh sach mon an</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Chon mon, them vao gio, va dat hang trong vai buoc.
        </p>
      </header>

      {canManageFood ? (
        <section className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-lg font-semibold">
            {editingFoodId ? "Cap nhat mon an" : "Them mon an"}
          </h2>
          <form className="mt-4 grid gap-3 md:grid-cols-3" onSubmit={handleUpsertFood}>
            <Input
              placeholder="Ten mon"
              value={foodForm.name}
              onChange={(event) =>
                setFoodForm((current) => ({ ...current, name: event.target.value }))
              }
            />
            <Input
              placeholder="Danh muc"
              value={foodForm.category}
              onChange={(event) =>
                setFoodForm((current) => ({ ...current, category: event.target.value }))
              }
            />
            <Input
              type="number"
              min={0.01}
              step="0.01"
              placeholder="Gia"
              value={foodForm.price}
              onChange={(event) =>
                setFoodForm((current) => ({ ...current, price: event.target.value }))
              }
            />

            <select
              className="h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={foodForm.available}
              onChange={(event) =>
                setFoodForm((current) => ({ ...current, available: event.target.value }))
              }
            >
              <option value="true">Con ban</option>
              <option value="false">Het hang</option>
            </select>

            <div className="md:col-span-3 flex flex-wrap gap-2">
              <Button type="submit" disabled={isSubmittingFood}>
                {isSubmittingFood
                  ? "Dang xu ly..."
                  : editingFoodId
                    ? "Luu thay doi"
                    : "Them mon"}
              </Button>
              {editingFoodId ? (
                <Button type="button" variant="outline" onClick={resetFoodForm}>
                  Huy
                </Button>
              ) : null}
            </div>
          </form>
        </section>
      ) : null}

      <FoodList
        foods={foods}
        isLoading={isLoading}
        errorMessage={errorMessage}
        onReload={loadFoods}
        onAddToCart={handleAddToCart}
        canManage={canManageFood}
        onEdit={startEdit}
        onDelete={handleDeleteFood}
      />
    </section>
  );
}
