import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { text, tone, deviceId } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    // Check if the user is PRO
    const { data: proRow } = await supabase
      .from("stripe_users")
      .select("*")
      .eq("id", deviceId)
      .single();

    const isPro = !!proRow;

    // Block premium tones if not Pro
    const premiumTones = ["Poetic (Pro)", "Ultra Professional (Pro)"];
    if (!isPro && premiumTones.includes(tone)) {
      return NextResponse.json(
        { error: "This tone requires a Pro subscription." },
        { status: 403 }
      );
    }

    // Run rewrite
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Rewrite the text in a ${tone} tone.`,
        },
        { role: "user", content: text },
      ],
    });

    const output = completion.choices[0].message.content;

    return NextResponse.json({ output });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
