import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useAuth } from "~/hooks/use-auth";
import { useNotification } from "~/hooks/use-notification";
import { useRedirectIfAuthenticated } from "~/hooks/use-route-guards";
import { APP_ROUTES } from "~/lib/constants";
import type { RegisterPayload } from "~/services/auth.service";

export default function RegisterPage() {
  useRedirectIfAuthenticated();

  const { register, isSubmitting, isReady } = useAuth();
  const notification = useNotification();
  const navigate = useNavigate();

  const [payload, setPayload] = useState<RegisterPayload>({
    username: "",
    password: "",
    role: "USER",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (payload.password !== confirmPassword) {
      const message = "Mat khau xac nhan khong khop";
      setError(message);
      notification.error(message);
      return;
    }

    try {
      const hasSession = await register({
        username: payload.username.trim(),
        password: payload.password,
        role: payload.role,
      });
      notification.success("Dang ky thanh cong");

      if (hasSession) {
        navigate(APP_ROUTES.foods, { replace: true });
      } else {
        navigate(APP_ROUTES.login, { replace: true });
      }
    } catch (registerError) {
      const message =
        registerError && typeof registerError === "object" && "message" in registerError
          ? String(registerError.message)
          : "Dang ky that bai";
      setError(message);
      notification.error(message);
    }
  }

  if (!isReady) {
    return <p>Dang khoi tao phien...</p>;
  }

  return (
    <section className="mx-auto w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">Dang ky</h1>
      <p className="mt-1 text-sm text-muted-foreground">Tao tai khoan de bat dau dat mon</p>

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

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Xac nhan mat khau
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Nhap lai mat khau"
            required
          />
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Dang tao tai khoan..." : "Dang ky"}
        </Button>
      </form>

      <p className="mt-4 text-sm text-muted-foreground">
        Da co tai khoan? <Link to={APP_ROUTES.login} className="font-medium text-primary">Dang nhap</Link>
      </p>
    </section>
  );
}
