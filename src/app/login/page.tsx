"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { status, error, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.replace("/checkin");
  }, [status, router]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4"
          style={{ background:"linear-gradient(145deg, #1A0A0F 0%, #2D0A12 60%, #3D1A08 100%)" }}>
      <div className="w-full max-w-sm text-center" style={{ animation:"fadeUp 0.6s ease both" }}>
        <div className="mb-8">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6"
               style={{ background:"linear-gradient(135deg,#7B1C2E,#C9A84C)", boxShadow:"0 8px 32px rgba(123,28,46,0.4)" }}>
            📖
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily:"'Playfair Display',serif" }}>
            NEU Library
          </h1>
          <p className="text-white/50 text-sm">Visitor Management System</p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl text-sm text-red-300"
               style={{ background:"rgba(192,57,43,0.15)", border:"1px solid rgba(192,57,43,0.3)" }}>
            {error}
          </div>
        )}

        <button onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl
                           font-semibold text-gray-800 bg-white hover:bg-gray-50
                           transition-all duration-200 hover:scale-[1.02] hover:shadow-xl">
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Sign in with Google
        </button>

        <p className="mt-6 text-xs text-white/30 leading-relaxed">
          Only <span className="text-white/50">@neu.edu.ph</span> accounts are permitted.<br/>
          Use your institutional Google account to continue.
        </p>
      </div>
      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </main>
  );
}
