import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
} as any);

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature error:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      /* 🔥 User successfully checked out */
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const deviceId = session.metadata?.deviceId;

        if (deviceId) {
          await supabaseAdmin
            .from("users")
            .update({ is_pro: true })
            .eq("device_id", deviceId);

          console.log("🔥 User upgraded to Pro:", deviceId);
        }
        break;
      }

      /* 🔃 Subscription created/updated */
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        const deviceId = subscription.metadata?.deviceId;

        if (deviceId) {
          const active =
            subscription.status === "active" ||
            subscription.status === "trialing";

          await supabaseAdmin
            .from("users")
            .update({ is_pro: active })
            .eq("device_id", deviceId);

          console.log("✨ Subscription status updated:", deviceId, active);
        }
        break;
      }

      /* ❌ Subscription canceled */
      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        const deviceId = subscription.metadata?.deviceId;

        if (deviceId) {
          await supabaseAdmin
            .from("users")
            .update({ is_pro: false })
            .eq("device_id", deviceId);

          console.log("⚠️ Subscription canceled:", deviceId);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("❌ Error handling webhook:", err);
    return new NextResponse("Webhook handler error", { status: 400 });
  }

  return new NextResponse("Webhook received", { status: 200 });
}
