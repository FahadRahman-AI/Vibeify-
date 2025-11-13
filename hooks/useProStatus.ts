"use client";

import { useEffect, useState } from "react";

export function useProStatus() {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    // Look for the cookie set during activation page redirect
    const value = document.cookie
      .split("; ")
      .find((row) => row.startsWith("vibeify_pro="));

    if (value && value.includes("1")) {
      setIsPro(true);
    }
  }, []);

  return isPro;
}
