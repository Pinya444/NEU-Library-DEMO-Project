"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types/user";

interface AuthGuardProps {
  children:      React.ReactNode;
  requiredRole?: UserRole;
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { status, neuUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") { router.replace("/login"); return; }
    if (neuUser && !neuUser.isSetupComplete) { router.replace("/onboarding"); return; }
    if (requiredRole && neuUser?.role !== requiredRole) {
      router.replace(neuUser?.role === "admin" ? "/dashboard/admin" : "/checkin");
    }
  }, [status, neuUser, requiredRole, router]);

  if (status === "loading" || !neuUser) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: "linear-gradient(145deg, #1A0A0F, #3D0A14)" }}>
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">📖</div>
          <p className="text-white/50 text-sm tracking-wider uppercase">Loading NEU Library…</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || !neuUser.isSetupComplete) return null;
  if (requiredRole && neuUser.role !== requiredRole) return null;

  return <>{children}</>;
}
