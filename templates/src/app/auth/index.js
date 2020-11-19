var { Router } = require("express");

var { authMiddleware } = require("../../middleware/auth");

var router = Router()

router.get("/userInfo", authMiddleware, (req, res) => {
  res.json(req.user);
});

module.exports = router;
