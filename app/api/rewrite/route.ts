import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text, tone } = await req.json();

    const prompt = `Rewrite the following text in a ${tone} tone:\n\n"${text}"`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const result = completion.choices[0].message?.content ?? "No result.";

    return NextResponse.json({ result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ result: "Error processing request." }, { status: 500 });
  }
}
