var aws = require("aws-sdk");
var cfsign = require("aws-cloudfront-sign");
var express = require("express");
var morgan = require("morgan");

var { connect } = require("./db");

var app = express();
app.use(morgan("combined"));
var s3 = new aws.S3();

app.get("/presigned/:key", (req, res) => {
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

app.get("/:key", (req, res) => {
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

app.get("/status/ready", (req, res) => {
  res.send("OK");
});

app.get("/status/alive", (req, res) => {
  res.send("OK");
});

app.get("/status/about", (req, res) => {
  res.send({
    podName: process.env.POD_NAME,
  });
});

<%if eq (index .Params `userAuth`) "yes" %>
app.get('/auth-data', (req, res) => {
  /** Expecting oathkeeper to pass on user identity in headers
   *  (note nodejs converts all headers to lowercase)
   *  1. X-User-Id
   *  2. X-User-Email
  * */
  const hasKratosCookie = req.headers.cookie.match(/ory_kratos_session/);
  const hasUserData = req.headers["x-user-id"] && req.headers["x-user-email"];
  if (hasKratosCookie && hasUserData) {
    res.json({
      user_id: req.headers["x-user-id"],
      email: req.headers["x-user-email"],
    });
  } else {
    res.status(401);
    res.json({
      success: false,
      message: "unauthenticated",
    });
  }
});<% end %>

var port = process.env.SERVER_PORT;
if (!port) {
  port = 3000;
}

async function main() {
  const database = await connect();

  // remove this block for development, just for verifying DB
  try {
    const res = await database.query("SELECT 1");
    console.log(`Query successful, returned ${res[0].length} rows.`);
  } catch (e) {
    console.error(e);
  }

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
}

main();
