import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// ✅ Initialize Stripe safely for TypeScript
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
} as any);

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("session_id");

    if (!sessionId) {
      console.warn("⚠️ Missing session_id in activate request");
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/?missing_session=1`);
    }

    // ✅ Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      console.error("❌ No session found for session_id:", sessionId);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/?activate=notfound`);
    }

    // ✅ Confirm subscription is created/active
    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;

    if (!subscriptionId) {
      console.error("❌ No subscription found in session:", sessionId);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/?activate=failed`);
    }

    // ✅ Create redirect response to homepage after upgrade
    const res = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/?upgraded=1`
    );

    // ✅ Set "Pro user" cookie (valid 30 days)
    res.cookies.set("vibeify_pro", "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // (Optional) Clear any old free-plan counters here if you added them later

    console.log("✅ Activated Pro for session:", sessionId);
    return res;
  } catch (err: unknown) {
    console.error("❌ Activation error:", err);

    // Handle known Stripe errors
    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/?activate=error`;
    return NextResponse.redirect(redirectUrl);
  }
}

