"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useProStatus(userId: string | null) {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    if (!userId) return;

    async function load() {
      const { data } = await supabase
        .from("stripe_users")
        .select("stripe_customer_id")
        .eq("id", userId)
        .single();

      setIsPro(!!data);
    }

    load();
  }, [userId]);

  return isPro;
}
