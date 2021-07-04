const stripe = require("stripe");

const Stripe = stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

const createCheckoutSession = async (customerID, price) => {
  console.log("Checkout session");
  const session = await Stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer: customerID,
    line_items: [
      {
        price,
        quantity: 1,
      },
    ],
    subscription_date: {
      trial_period_days: process.env.TRIAL_DAYS,
    },
    success_url: `${process.env.DOMAIN}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.DOMAIN}`,
  });
  return session;
};

// const createBillingSession = async (customer) =>{
//     const session = await Stripe.billingPortal.sessions
// }
