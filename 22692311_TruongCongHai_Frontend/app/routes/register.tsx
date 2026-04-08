import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useAuth } from "~/hooks/use-auth";
import { useNotification } from "~/hooks/use-notification";
import { useRedirectIfAuthenticated } from "~/hooks/use-route-guards";
import { APP_ROUTES } from "~/lib/constants";

export default function RegisterPage() {
  useRedirectIfAuthenticated();

  const { register, isSubmitting, isReady } = useAuth();
  const notification = useNotification();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      const message = "Mat khau xac nhan khong khop";
      setError(message);
      notification.error(message);
      return;
    }

    try {
      const hasSession = await register({ username, email, password });
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
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
