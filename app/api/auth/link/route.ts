import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { userId, deviceId } = await req.json();

  if (!userId || !deviceId)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  // Set userId = deviceId for subscription linking
  await supabase
    .from("stripe_users")
    .update({ id: userId })  // rewrite deviceId → userId
    .eq("id", deviceId);

  return NextResponse.json({ success: true });
}
