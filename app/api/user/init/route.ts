import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  let deviceId = cookieStore.get("vibeify_device_id")?.value;

  let isNew = false;

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    isNew = true;
  }

  const { data: existingUser } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("device_id", deviceId)
    .maybeSingle();

  if (!existingUser) {
    await supabaseAdmin.from("users").insert({
      device_id: deviceId,
    });
  }

  const res = NextResponse.json({ ok: true, deviceId });

  if (isNew && deviceId) {
    res.cookies.set("vibeify_device_id", deviceId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }

  return res;
}
