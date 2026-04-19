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

  function handlePayloadChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;

    if (name === "username" || name === "password" || name === "role") {
      setPayload((previous) => ({ ...previous, [name]: value }));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (payload.password !== confirmPassword) {
      const message = "Mật khẩu xác nhận không khớp";
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
      notification.success("Đăng ký thành công");

      if (hasSession) {
        navigate(APP_ROUTES.foods, { replace: true });
      } else {
        navigate(APP_ROUTES.login, { replace: true });
      }
    } catch (registerError) {
      const message =
        registerError && typeof registerError === "object" && "message" in registerError
          ? String(registerError.message)
          : "Đăng ký thất bại";
      setError(message);
      notification.error(message);
    }
  }

  if (!isReady) {
    return <p>Đang khởi tạo phiên...</p>;
  }

  return (
    <section className="mx-auto w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">Đăng ký</h1>
      <p className="mt-1 text-sm text-muted-foreground">Tạo tài khoản để bắt đầu đặt món</p>

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
            placeholder="Nhập tên đăng nhập"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Mật khẩu
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            value={payload.password}
            onChange={handlePayloadChange}
            placeholder="Nhập mật khẩu"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium">
            Vai trò
          </label>
          <select
            id="role"
            name="role"
            value={payload.role ?? "USER"}
            onChange={handlePayloadChange}
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Xác nhận mật khẩu
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Nhập lại mật khẩu"
            required
          />
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Đang tạo tài khoản..." : "Đăng ký"}
        </Button>
      </form>

      <p className="mt-4 text-sm text-center text-muted-foreground">
        Đã có tài khoản? <Link to={APP_ROUTES.login} className="font-medium text-primary">Đăng nhập</Link>
      </p>
    </section>
  );
}
