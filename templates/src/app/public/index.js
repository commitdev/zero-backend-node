const { Router } = require("express");

const router = Router();

router.get("/status/ready", (req, res) => {
  res.json({ ready: "OK" });
});

router.get("/status/alive", (req, res) => {
  res.json( {alive: "OK"} );
});

router.get("/status/about", (req, res) => {
  var podName = (process.env.POD_NAME)?process.env.POD_NAME:"zero-node-backend";
  res.json({
    podName: podName,
  });
});
<% if eq (index .Params `billingEnabled`) "yes" %>
// Logging out webhooks for development purposes
router.use("/webhook", (req, res) => {
  res.json({ success:true });
});<% end %>
module.exports = router;
