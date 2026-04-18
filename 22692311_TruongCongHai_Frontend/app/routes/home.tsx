import { Navigate } from "react-router";

import { useAuth } from "~/hooks/use-auth";
import { APP_ROUTES } from "~/lib/constants";

export function meta() {
  return [
    { title: "Mini Food Ordering" },
    { name: "description", content: "Mini Food Ordering System UI" },
  ];
}

export default function Home() {
  const { isReady, isAuthenticated } = useAuth();

  if (!isReady) {
    return <p>Dang khoi tao he thong...</p>;
  }

  return (
    <Navigate
      to={isAuthenticated ? APP_ROUTES.foods : APP_ROUTES.login}
      replace
    />
  );
}
