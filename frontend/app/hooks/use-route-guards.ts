import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

import { APP_ROUTES } from "~/lib/constants";
import { useAuth } from "~/hooks/use-auth";

export function useRequireAuth() {
  const { isAuthenticated, isReady } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!isAuthenticated) {
      navigate(APP_ROUTES.login, {
        replace: true,
        state: {
          from: location.pathname,
        },
      });
    }
  }, [isAuthenticated, isReady, navigate, location.pathname]);
}

export function useRedirectIfAuthenticated() {
  const { isAuthenticated, isReady } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (isAuthenticated) {
      navigate(APP_ROUTES.foods, { replace: true });
    }
  }, [isAuthenticated, isReady, navigate]);
}
