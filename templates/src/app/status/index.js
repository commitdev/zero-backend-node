var { Router } = require("express");

var router = Router()

router.get("/ready", (req, res) => {
  res.send("OK");
});

router.get("/alive", (req, res) => {
  res.send("OK");
});

router.get("/about", (req, res) => {
  res.send({
    podName: process.env.POD_NAME,
  });
});

module.exports = router;
