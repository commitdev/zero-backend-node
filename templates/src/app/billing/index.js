const dotenv = require("dotenv");
dotenv.config();

const Router = require("express").Router;
// the environment variable STRIPE_API_SECRET_KEY is set in your kubernetes secret
const stripe = require("stripe")(process.env.STRIPE_API_SECRET_KEY)
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080"
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"

const router = Router();

const mapToQueryString = (data) => Object.keys(data).map((key) => {
  return encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
}).join('&');

router.get("/products", (req, res) => {
  // TODO: should change the router to express-promise-router so dont need these `.then()` chains
  // these are for demo purposes, you will have to implement your own logic
  const priceDisplay = (i) => `${i.currency.toUpperCase()} $${i.unit_amount/100} /${i.recurring.interval}`;
  const extract = ({data}) => data
    .filter(p => p.active)
    .map(i => ({
      id: i.id,
      type: i.type,
      nickname: i.nickname,
      interval: i.recurring.interval,
      price: priceDisplay(i) //price display for frontend
    }));

  stripe.prices.list()
    .then(extract)
    .then(data => res.json(data));
});


router.use("/checkout", (req, res) => {
  // should throw if not available, since theres nothing to checkout
  const { price_id } = req.body;
  createCheckoutPayload = {
    mode: "subscription",
    payment_method_types: ["card"],
     // this would be your internal userID(if auth is enabled) or a random generated ID
    client_reference_id: req.user ? req.user.id : `internal-reference-${Math.random().toString(36).substr(7)}`,
    line_items: [{ price: price_id, quantity: 1 }],
    success_url: `${BACKEND_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BACKEND_URL}/billing/canceled`,
  }
  stripe.checkout.sessions.create(createCheckoutPayload).then((session) => res.json({
    sessionId: session.id,
  }))
});


router.use("/success", async (req, res) => {
  const { session_id } = req.query;

  const session = await stripe.checkout.sessions.retrieve(session_id)
  console.log(session)
  const data = {
    payment_status: session.payment_status,
    amount: session.amount_total/100,
    currency:  session.currency,
    customer: session.customer_details.email,
    reference: session.client_reference_id,
  }

  res.redirect(`${FRONTEND_URL}/billing/confirmation?&${mapToQueryString(data)}`)
});

router.use("/canceled", async (req, res) => {
  const data = {
    payment_status: "canceled",
  }
  res.redirect(`${FRONTEND_URL}/billing/confirmation?&${mapToQueryString(data)}`)
});

router.use("/webhook*", async (req, res) => {
  console.log("Stripe webhook received", req.query, req.body)
  res.send("ok");
});

module.exports = router