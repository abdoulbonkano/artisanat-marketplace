import Stripe from "stripe";

// Falls back to a placeholder so the client can be constructed at build/module
// load time even without real keys configured; actual API calls will then
// fail at runtime (handled by callers) until STRIPE_SECRET_KEY is set.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");
