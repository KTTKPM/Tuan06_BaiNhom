import { Outlet } from "react-router";

import { Navbar } from "~/components/layout/navbar";
import { NotificationCenter } from "~/components/features/notification-center";

export function AppShell() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <Outlet />
      </main>
      <NotificationCenter />
    </>
  );
}
