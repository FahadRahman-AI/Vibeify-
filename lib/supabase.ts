import { createClient } from "@supabase/supabase-js";

// PUBLIC CLIENT (browser safe)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ADMIN CLIENT (server-only)
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!, // NOT THE PUBLIC URL
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // SECRET KEY
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
