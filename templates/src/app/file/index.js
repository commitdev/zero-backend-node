var { Router } = require("express");
var aws = require("aws-sdk");
var cfsign = require("aws-cloudfront-sign");

var router = Router();
var s3 = new aws.S3();

router.get("/presigned", (req, res) => {
  var params = {
    Bucket: process.env.AWS_S3_DEFAULT_BUCKET,
    Key: req.query.key,
    Expires: 60 * 60, // 60 minutes
  };
  const url = s3.getSignedUrl('putObject',params);
  console.log(url);
  res.send({
    "url":url,
    "method":"put"
  });
});

router.get("/",(req, res) => {
  var params = {
    Bucket: process.env.AWS_S3_DEFAULT_BUCKET,
    Key: req.query.key,
    Expires: 60 * 60, // 60 minutes
  };
  const url = s3.getSignedUrl('getObject',params);
  console.log(url);
  res.send({
    "url":url,
    "method":"get"
  });
});

module.exports = router;
