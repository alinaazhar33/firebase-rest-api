// controllers/stripeController.js
import { createPaymentIntentService } from "../services/stripeService.js";

// ✅ Create Payment Intent
export const createPaymentIntent = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const clientSecret = await createPaymentIntentService(userId, amount);

    return res.status(200).json({
      clientSecret,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Payment Intent creation error",
    });
  }
};