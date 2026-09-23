"use client";

import { useState, useEffect } from "react";
import { KeyRound, Lock } from "lucide-react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import type { ProductDTO, CategoryDTO } from "@/lib/types";
import type { Section } from "@/db/schema";

const ADMIN_KEY = "alian:admin";
const PASSWORD = "ALIAN";

type AdminPageClientProps = {
  initialProducts: ProductDTO[];
  categories: CategoryDTO[];
  initialOrders: {
    id: number;
    reference: string;
    customerName: string;
    phone: string;
    total: number;
    status: string;
    createdAt: string;
  }[];
  initialSections?: Section[];
};

export function AdminPageClient({
  initialProducts,
  categories,
  initialOrders,
  initialSections = [],
}: AdminPageClientProps) {
  const [access, setAccess] = useState(false);
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(ADMIN_KEY);
      if (stored === PASSWORD) setAccess(true);
    } catch {
      // ignore
    }
  }, []);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (pwd.trim() === PASSWORD) {
      try {
        window.localStorage.setItem(ADMIN_KEY, PASSWORD);
      } catch {
        // ignore
      }
      setAccess(true);
      setError("");
    } else {
      setError("Incorrect password");
      setPwd("");
    }
  };

  if (!access) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 flex items-center justify-center px-6">
        <form
          onSubmit={submit}
          className="w-full max-w-sm rounded-[28px] border border-white/15 bg-white/[0.06] backdrop-blur-xl p-8 shadow-2xl"
        >
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 shadow-lg shadow-sky-500/30">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h1 className="mt-5 text-center text-xl font-extrabold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="mt-2 text-center text-xs font-semibold text-slate-400">
            Enter the admin password to continue
          </p>

          <div className="mt-6 relative">
            <KeyRound className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-white/15 bg-white/8 pl-11 pr-4 py-3.5 text-sm font-semibold text-white outline-none transition-colors placeholder:text-slate-500 focus:border-sky-400"
              autoFocus
            />
          </div>

          {error ? (
            <p className="mt-3 text-xs font-bold text-rose-400">{error}</p>
          ) : null}

          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-white px-6 py-3.5 text-sm font-extrabold text-slate-950 transition-all hover:-translate-y-0.5 hover:bg-sky-50"
          >
            Unlock Dashboard
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] pt-28 sm:pt-32">
      <AdminDashboard
        initialProducts={initialProducts}
        categories={categories}
        initialOrders={initialOrders}
        initialSections={initialSections}
      />
    </main>
  );
}