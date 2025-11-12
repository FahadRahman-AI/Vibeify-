import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;
const priceId = process.env.STRIPE_PRICE_ID!;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

if (!stripeSecretKey || !priceId || !siteUrl) {
  console.error("❌ Missing Stripe environment variables.");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-06-20",
} as any);

export async function POST() {
  try {
    console.log("🟢 Creating Stripe session...");

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      success_url: `${siteUrl}/pro?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/?canceled=1`,
    });

    console.log("✅ Session created:", session.url);
    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    console.error("❌ Stripe checkout error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
