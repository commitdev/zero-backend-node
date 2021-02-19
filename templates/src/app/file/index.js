var { Router } = require("express");
var aws = require("aws-sdk");
var cfsign = require("aws-cloudfront-sign");

var router = Router();
var s3 = new aws.S3();

router.get("/presigned/:key", (req, res) => {
  var params = {
    Bucket: process.env.S3_BUCKET,
    Fields: {
      key: req.params.key,
    },
  };

  s3.createPresignedPost(params, (err, data) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      console.log(data);
      res.send(data);
    }
  });
});

router.get("/:key", (req, res) => {
  var params = {
    keypairId: process.env.CF_KEYPAIR_ID,
    privateKeyString: process.env.CF_KEYPAIR_SECRET_KEY,
    expireTime: new Date().getTime() + 30000, // defaults to 30s
  };

  var url = cfsign.getSignedUrl(
    `https://files.${process.env.DOMAIN}/${req.params.key}`,
    params
  );

  console.log(url);
  res.redirect(url);
});

module.exports = router;
