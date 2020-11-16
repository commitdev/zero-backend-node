var { Router } = require("express");

var { authMiddleware } = require("../../middleware/auth");

var router = Router()

router.get("/auth-data", authMiddleware, (req, res) => {
  res.json(req.user);
});

module.exports = router;
