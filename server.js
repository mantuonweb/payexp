//https://github.com/stripe-samples/accept-a-card-payment
const express = require("express");
const Stripe = require("stripe");
var cors = require('cors')
const app = express();
const { resolve } = require("path");
// const PATH = "D:/2020/accept-a-card-payment-master/accept-a-card-payment-master/using-webhooks/client/web";
const SECRET_KEY = "sk_test_51HYw38JstFBsrnbnhm5VFygxy5p8typ9Mwvi9099o1VRJASQCnNm95MKUQSyZVsSYbzfCVch6u9YcWTseAxG3AGY004JdgQeSw";

const PUBLISHABLE_KEY ="pk_test_51HYw38JstFBsrnbnVOkoWkvgntT8Bid13GNj1qIP4cvGZAvnfWgKHjeCYc0Y9HpZFL8d9Mi4AlzjBQ7HcsVnDWhi00Z4K7Q7Qr"
// Replace if using a different env file or config
// const env = require("dotenv").config({ path: "./.env" });
const stripe = Stripe(SECRET_KEY);
app.use(cors());
// app.use(express.static(PATH));
app.use(
  express.json({
    // We need the raw body to verify webhook signatures.
    // Let's compute it only when hitting the Stripe webhook endpoint.
    verify: function(req, res, buf) {
      if (req.originalUrl.startsWith("/webhook")) {
        req.rawBody = buf.toString();
      }
    }
  })
);

// app.get("/checkout", (req, res) => {
//   // Display checkout page
//   const path = resolve(PATH + "/index.html");
//   res.sendFile(path);
// });

const calculateOrderAmount = items => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1500;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items, currency } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: currency,
    description: 'Software development services',
    shipping: {
      name: 'Jenny Rosen',
      address: {
        line1: '510 Townsend St',
        postal_code: '98140',
        city: 'San Francisco',
        state: 'CA',
        country: 'US',
      },
    },
  });

  // Send publishable key and PaymentIntent details to client
  res.send({
    publishableKey:PUBLISHABLE_KEY,
    clientSecret: paymentIntent.client_secret
  });
});

// Expose a endpoint as a webhook handler for asynchronous events.
// Configure your webhook in the stripe developer dashboard
// https://dashboard.stripe.com/test/webhooks
app.post("/webhook", async (req, res) => {
  let data, eventType;

  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // we can retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  if (eventType === "payment_intent.succeeded") {
    // Funds have been captured
    // Fulfill any orders, e-mail receipts, etc
    // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
    console.log("💰 Payment captured!");
  } else if (eventType === "payment_intent.payment_failed") {
    console.log("❌ Payment failed.");
  }
  res.sendStatus(200);
});

app.listen(443, () => console.log(`Node server listening on port ${443}!`));test.js
