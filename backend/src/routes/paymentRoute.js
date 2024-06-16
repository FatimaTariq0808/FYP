require("dotenv").config();
const express = require("express");
const Stripe = require("stripe");
const requireAuth = require("../middlewares/requireAuth");
const mongoose = require("mongoose");
const Constructor = mongoose.model("Constructor");

const router = express.Router();

router.post("/payment", requireAuth, async (req, res) => {
  try {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    const { amount, workerId } = req.body;
    // id = workerId._id;
    // console.log(process.env.STRIPE_SECRET_KEY, amount);

    const worker = await Constructor.findById(workerId);
    // worker = worker._id;
    // console.log(worker._id);
    const payment = {
      user: req.user.id,
      amount,
    };
    // console.log(payment.user);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",

      metadata: { integration_check: "accept_a_payment" },
    });

    worker.money.push(payment);
    // console.log(worker);
    await worker.save();
    res.json({
      success: true,
      client_secret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error processing payment:", error.message);
    res
      .status(500)
      .json({ success: false, error: "Payment processing failed" });
  }
});

router.get("/getStripeApiKey", requireAuth, async (req, res) => {
  res.json({
    stripeApiKey: process.env.STRIPE_API_KEY,
  });
});

module.exports = router;
