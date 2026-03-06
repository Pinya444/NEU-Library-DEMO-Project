"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { completeOnboarding } from "@/lib/userService";

const COLLEGES = [
  "College of Arts and Sciences",
  "College of Business and Accountancy",
  "College of Computer Studies",
  "College of Education",
  "College of Engineering",
  "College of Law",
  "College of Medical Technology",
  "College of Nursing",
  "College of Pharmacy",
  "College of Physical Therapy",
  "Senior High School",
  "Graduate School",
  "Office of the Registrar",
  "Library Administration",
  "Other Administrative Office",
];

export default function OnboardingPage() {
  const { neuUser, refreshUser } = useAuth();
  const router  = useRouter();
  const [selected,    setSelected]    = useState("");
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState<string|null>(null);

  const handleSubmit = async () => {
    if (!selected || !neuUser) return;
    setSubmitting(true); setError(null);
    try {
      await completeOnboarding(neuUser.uid, selected);
      await refreshUser();
      router.replace(neuUser.role==="admin" ? "/dashboard/admin" : "/checkin");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally { setSubmitting(false); }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10"
          style={{ background:"linear-gradient(160deg,#FAF6F0,#F5EDE4)" }}>
      <div className="w-full max-w-md" style={{ animation:"fadeUp 0.5s ease both" }}>
        <div className="mb-8 text-center">
          <div className="text-5xl mb-4">👋</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily:"'Playfair Display',serif" }}>
            Welcome, {neuUser?.fullName?.split(" ")[0]}!
          </h1>
          <p className="text-gray-500 text-sm">Tell us your college or office to get started.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <label className="text-xs font-semibold uppercase tracking-widest text-gray-400 block mb-3">
            College / Office
          </label>
          <select value={selected} onChange={(e)=>setSelected(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700
                             bg-white focus:outline-none focus:border-neu-maroon mb-4">
            <option value="">Select your college or office…</option>
            {COLLEGES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <button onClick={handleSubmit} disabled={!selected||submitting}
                  className="w-full py-3.5 rounded-xl font-semibold text-white text-sm
                             transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background:"linear-gradient(135deg,#7B1C2E,#A32238)" }}>
            {submitting ? "Saving…" : "Continue →"}
          </button>
        </div>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </main>
  );
}
