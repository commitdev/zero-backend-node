var { Router } = require("express");

var router = Router();

router.get("/ready", (req, res) => {
  res.json({ ready: "OK" });
});

router.get("/alive", (req, res) => {
  res.json( {alive: "OK"} );
});

router.get("/about", (req, res) => {
  var podName = (process.env.POD_NAME)?process.env.POD_NAME:"zero-node-backend";
  res.json({
    podName: podName,
  });
});

module.exports = router;
