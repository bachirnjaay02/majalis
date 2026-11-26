"use client";

import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { loginXamXamAdmin } from "../actions";
import { inputClass, labelClass, primaryButtonClass } from "@/components/xamxam/admin/formStyles";

export default function XamXamAdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginXamXamAdmin, {});

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white shadow-[0_2px_10px_rgba(36,29,20,0.12)]">
            <Image src="/xamxam-icons/logo-mark.png" alt="Majalis" width={48} height={48} className="h-full w-full object-cover" />
          </span>
          <h1 className="mt-4 font-[family-name:var(--font-xamxam-display)] text-xl font-semibold text-[#241d14] dark:text-[#f3e9d2]">
            Administration Majalis
          </h1>
          <p className="mt-1 text-sm text-[#241d14]/50 dark:text-[#f3e9d2]/50">
            Connectez-vous pour gérer les livres, playlists, vidéos et wirds.
          </p>
        </div>

        <form
          action={formAction}
          className="space-y-4 rounded-2xl border border-[#f3d27a]/12 bg-[#241d14]/[0.03] dark:bg-white/[0.03] p-6"
        >
          <div>
            <label className={labelClass} htmlFor="email">
              Adresse e-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={inputClass}
              placeholder="admin@xamxam.sn"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="password">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className={inputClass}
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
              {state.error}
            </p>
          )}

          <div className="rounded-xl border border-[#e8c87a]/20 bg-[#e8c87a]/5 p-3 text-center text-xs text-[#241d14]/70 dark:text-[#f3e9d2]/70">
            <p className="font-medium text-[#8a6420] dark:text-[#e8c87a]">Identifiants par défaut :</p>
            <p className="mt-1 font-mono text-[11px] select-all">admin@xamxam.sn / XamXam2026!</p>
          </div>

          <button type="submit" disabled={pending} className={`w-full ${primaryButtonClass} disabled:opacity-60`}>
            {pending ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#241d14]/40 dark:text-[#f3e9d2]/40">
          <Link href="/xamxam" className="hover:text-[#8a6420] dark:hover:text-[#f3d27a]">
            ← Retour à Majalis
          </Link>
        </p>
      </div>
    </div>
  );
}
