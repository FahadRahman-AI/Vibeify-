"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const usr = data.user;
      setUser(usr);

      if (usr?.id) {
        const { data: row } = await supabase
          .from("stripe_users")
          .select("stripe_customer_id")
          .eq("id", usr.id)
          .single();

        setStripeCustomerId(row?.stripe_customer_id || null);
      }

      setLoading(false);
    });
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  async function manageBilling() {
    if (!stripeCustomerId) {
      alert("No subscription found.");
      return;
    }

    const res = await fetch("/api/stripe/portal", {
      method: "POST",
      body: JSON.stringify({ customerId: stripeCustomerId }),
    });

    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </main>
    );

  if (!user)
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        <a href="/signin" className="underline">
          Please sign in to view your account.
        </a>
      </main>
    );

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-blue-600 text-white px-4">
      <div className="w-full max-w-md p-8 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 shadow-xl">

        <h1 className="text-3xl font-bold text-center mb-6">My Account</h1>

        <p className="text-white/90 mb-4">
          <strong>Email:</strong> {user.email}
        </p>

        <p className="text-white/90 mb-4">
          <strong>Subscription:</strong>{" "}
          {stripeCustomerId ? (
            <span className="text-green-300">Pro</span>
          ) : (
            <span className="text-yellow-300">Free</span>
          )}
        </p>

        {stripeCustomerId && (
          <button
            onClick={manageBilling}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-700 to-purple-900 text-white font-semibold shadow-lg hover:opacity-90 transition active:scale-95 cursor-pointer mt-4"
          >
            Manage Billing
          </button>
        )}

        <button
          onClick={logout}
          className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold mt-6 transition active:scale-95 cursor-pointer"
        >
          Log Out
        </button>
      </div>
    </main>
  );
}
