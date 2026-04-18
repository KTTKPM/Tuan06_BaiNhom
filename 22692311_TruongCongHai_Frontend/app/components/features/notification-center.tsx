import { useNotification } from "~/hooks/use-notification";
import { cn } from "~/lib/utils";

const toneByType = {
  success: "border-emerald-300 bg-emerald-50 text-emerald-900",
  error: "border-rose-300 bg-rose-50 text-rose-900",
  info: "border-sky-300 bg-sky-50 text-sky-900",
};

export function NotificationCenter() {
  const { toasts, remove } = useNotification();

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto rounded-md border p-3 text-sm shadow-sm",
            toneByType[toast.type],
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <p>{toast.message}</p>
            <button
              type="button"
              className="font-semibold opacity-80 hover:opacity-100"
              onClick={() => remove(toast.id)}
              aria-label="Dismiss notification"
            >
              x
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
