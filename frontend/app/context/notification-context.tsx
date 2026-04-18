import { createContext, useCallback, useMemo, useState } from "react";

export type NotificationType = "success" | "error" | "info";

export interface ToastMessage {
  id: number;
  message: string;
  type: NotificationType;
}

interface NotificationContextValue {
  toasts: ToastMessage[];
  notify: (type: NotificationType, message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  remove: (id: number) => void;
}

export const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined,
);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback(
    (type: NotificationType, message: string) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      const nextToast: ToastMessage = { id, type, message };

      setToasts((current) => [nextToast, ...current]);

      window.setTimeout(() => {
        remove(id);
      }, 3500);
    },
    [remove],
  );

  const value = useMemo<NotificationContextValue>(
    () => ({
      toasts,
      notify,
      success: (message) => notify("success", message),
      error: (message) => notify("error", message),
      info: (message) => notify("info", message),
      remove,
    }),
    [toasts, notify, remove],
  );

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
}
