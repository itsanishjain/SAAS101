const router = require("express").Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const planToPrice = {
  BASIC: process.env.PRODUCT_BASIC,
  PRO: process.env.PRODUCT_PRO,
};

router.get("/", (req, res) => {
  res.render("pages/plan");
});

router.post("/create-checkout-session", async (req, res) => {
  console.log(req.body);
  const { plans } = req.body;
  //   console.log(plan, planToPrice[plan]);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: planToPrice[plans],
        // For metered billing, do not pass quantity
        quantity: 1,
      },
    ],

    subscription_data: {
        
      trial_period_days: process.env.TRIAL_DAYS,
    },

    // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
    // the actual Session ID is returned in the query parameter when your customer
    // is redirected to the success page.
    success_url:
      "http://localhost:8003/payments/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://localhost:8003/payments/cancel",
  });
  res.redirect(303, session.url);
});

router.get("/success/:session_id", (req, res) => {
  res.send(req.params.session_id);
});

router.get("/cancel", (req, res) => {
  res.send("Cancel");
});

module.exports = router;
