const { Router } = require("express");

const router = Router();

router.get("/userInfo", (req, res) => {
  res.json(req.user);
});

module.exports = router;
