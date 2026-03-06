// src/app/page.tsx
// Root route: immediately redirect to /login.
// The AuthGuard on each protected page handles the rest.

import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/login");
}
