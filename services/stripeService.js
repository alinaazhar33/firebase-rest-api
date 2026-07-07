// services/stripeService.js
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Create Payment Intent
export const createPaymentIntentService = async (userId, amount) => {
  if (!userId || !amount) {
    throw new Error("User ID and amount required");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // cents
    currency: "pkr",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: { userId },
  });

  return paymentIntent.client_secret;
};