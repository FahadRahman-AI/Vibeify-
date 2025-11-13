import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
} as any);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const deviceId = body.deviceId;

    if (!deviceId) {
      return NextResponse.json(
        { error: "No deviceId provided" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      metadata: {
        deviceId,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pro?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?canceled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("❌ Stripe checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
