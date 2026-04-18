import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useAuth } from "~/hooks/use-auth";
import { useNotification } from "~/hooks/use-notification";
import { useRedirectIfAuthenticated } from "~/hooks/use-route-guards";
import { APP_ROUTES } from "~/lib/constants";
import type { LoginPayload } from "~/services/auth.service";

export default function LoginPage() {
  useRedirectIfAuthenticated();

  const { login, isSubmitting, isReady } = useAuth();
  const notification = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [payload, setPayload] = useState<LoginPayload>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  function handlePayloadChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === "username" || name === "password") {
      setPayload((previous) => ({ ...previous, [name]: value }));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      await login({
        username: payload.username.trim(),
        password: payload.password,
      });
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
          <label htmlFor="username" className="text-sm font-medium">
            Username
          </label>
          <Input
            id="username"
            name="username"
            value={payload.username}
            onChange={handlePayloadChange}
            placeholder="Nhap username"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Mat khau
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            value={payload.password}
            onChange={handlePayloadChange}
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
