"use client";

import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { useProStatus } from "@/hooks/useProStatus";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const user = useUser();
  const isPro = useProStatus(user?.id || null); // ✅ FIXED

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <nav className="w-full flex justify-end gap-4 items-center p-4 text-white">
      {!user && (
        <>
          <Link href="/account" className="text-white/80 hover:text-white underline">
            My Account
          </Link>

          <Link href="/signin" className="text-white/80 hover:text-white underline">
            Sign In
          </Link>
        </>
      )}

      {user && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/90">{user.email}</span>

          {isPro ? (
            <span className="px-3 py-1 bg-yellow-400 text-black rounded-full text-xs font-bold">
              PRO
            </span>
          ) : (
            <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold">
              FREE
            </span>
          )}

          <button
            onClick={logout}
            className="text-white/70 underline hover:text-white cursor-pointer text-sm"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
