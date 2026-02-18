"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AUTH_KEY = "pulsai-auth";
const PUBLIC_ROUTES = ["/login"];

export function AuthGate({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const isPublic = PUBLIC_ROUTES.includes(pathname);
    const isAuthed = window.localStorage.getItem(AUTH_KEY) === "true";

    if (!isAuthed && !isPublic) {
      router.replace("/login");
      setReady(true);
      return;
    }

    if (isAuthed && pathname === "/login") {
      router.replace("/");
      setReady(true);
      return;
    }

    setReady(true);
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Chargement...
      </div>
    );
  }

  return children;
}
