var aws = require('aws-sdk');
var cfsign = require('aws-cloudfront-sign');
var express = require('express');
var morgan = require('morgan');

var app = express();
app.use(morgan('combined'));
var s3 = new aws.S3();

app.get('/presigned/:key', (req, res) => {
    var params = {
        Bucket: process.env.S3_BUCKET,
        Fields: {
            key: req.params.key
        }
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

app.get('/:key', (req, res) => {
    var params = {
        keypairId: process.env.CF_KEYPAIR_ID,
        privateKeyString: process.env.CF_KEYPAIR_SECRET_KEY,
        expireTime: new Date().getTime() + 30000 // defaults to 30s
    };

    var url = cfsign.getSignedUrl(
        `https://files.<% DOMAIN_HERE %>/${req.params.key}`,
        params
    );

    console.log(url);
    res.redirect(url);
});

app.get('/status/ready', (req, res) => {
    res.send("OK");
});

app.get('/status/alive', (req, res) => {
    res.send("OK");
});

app.get('/status/about', (req, res) => {
    res.send({
        podName: process.env.POD_NAME
    });
});

var port = process.env.SERVER_PORT;
if (!port) {
    port = 3000;
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
