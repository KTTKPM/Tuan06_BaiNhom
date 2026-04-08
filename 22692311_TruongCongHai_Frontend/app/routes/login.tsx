import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useAuth } from "~/hooks/use-auth";
import { useNotification } from "~/hooks/use-notification";
import { useRedirectIfAuthenticated } from "~/hooks/use-route-guards";
import { APP_ROUTES } from "~/lib/constants";

export default function LoginPage() {
  useRedirectIfAuthenticated();

  const { login, isSubmitting, isReady } = useAuth();
  const notification = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      await login({ usernameOrEmail, password });
      notification.success("Dang nhap thanh cong");

      const redirectTo =
        (location.state as { from?: string } | undefined)?.from || APP_ROUTES.foods;

      navigate(redirectTo, { replace: true });
    } catch (loginError) {
      const message =
        loginError && typeof loginError === "object" && "message" in loginError
          ? String(loginError.message)
          : "Dang nhap that bai";
      setError(message);
      notification.error(message);
    }
  }

  if (!isReady) {
    return <p>Dang khoi tao phien dang nhap...</p>;
  }

  return (
    <section className="mx-auto w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">Dang nhap</h1>
      <p className="mt-1 text-sm text-muted-foreground">Su dung tai khoan noi bo de dat mon</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="usernameOrEmail" className="text-sm font-medium">
            Username hoặc Email
          </label>
          <Input
            id="usernameOrEmail"
            value={usernameOrEmail}
            onChange={(event) => setUsernameOrEmail(event.target.value)}
            placeholder="Nhap username hoac email"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Mat khau
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Nhap mat khau"
            required
          />
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Dang dang nhap..." : "Dang nhap"}
        </Button>
      </form>

      <p className="mt-4 text-sm text-center text-muted-foreground">
        Chua co tai khoan? <Link to={APP_ROUTES.register} className="font-medium text-primary">Dang ky</Link>
      </p>
    </section>
  );
}
