const { Router } = require("express");
const jwt = require("jsonwebtoken");
const {jwtSecret} = require("./conf")

const router = Router();

/* This endpoint help you generate access token for testing 
without the third party of Identity Provider*/
router.post("/token", (req, res, next) => {
  try{
    const user = req.body;
    if(!user || !user.id || !user.email){
      res.status(400).send("id and email are required");
    } else {
      const access_token = jwt.sign(user, jwtSecret, {expiresIn: "20m"});
      res.json({
        access_token
      })
    }
  } catch (err){
    next (err);
  }
});

module.exports = router;
