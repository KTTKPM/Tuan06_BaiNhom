import { NavLink } from "react-router";

import { useAuth } from "~/hooks/use-auth";
import { useCart } from "~/hooks/use-cart";
import { APP_ROUTES } from "~/lib/constants";
import { cn } from "~/lib/utils";

const protectedLinks = [
  { to: APP_ROUTES.foods, label: "Món ăn" },
  { to: APP_ROUTES.cart, label: "Giỏ hàng" },
  { to: APP_ROUTES.orders, label: "Đơn hàng" },
];

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <NavLink to={isAuthenticated ? APP_ROUTES.foods : APP_ROUTES.login} className="text-lg font-semibold">
          Mini Food Ordering
        </NavLink>

        <nav className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {protectedLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      "rounded-md px-3 py-2 text-sm transition",
                      isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                    )
                  }
                >
                  {link.label}
                  {link.to === APP_ROUTES.cart ? ` (${totalItems})` : ""}
                </NavLink>
              ))}

              <span className="ml-2 text-sm text-muted-foreground">
                {user?.username} ({user?.role})
              </span>
              <button
                type="button"
                className="ml-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
                onClick={logout}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <NavLink
                to={APP_ROUTES.login}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2 text-sm transition",
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )
                }
              >
                Đăng nhập
              </NavLink>
              <NavLink
                to={APP_ROUTES.register}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2 text-sm transition",
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )
                }
              >
                Đăng ký
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
