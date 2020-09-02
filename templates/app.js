const PORT = 3000;

const express = require('express');
const app = express();

const aws = require('aws-sdk');
aws.config.update({ accessKeyId: process.env.ACCESS_KEY_ID, secretAccessKey: process.env.SECRET_ACCESS_KEY });
const s3 = new aws.S3();

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
        Bucket: process.env.S3_BUCKET,
        Key: req.params.key
    };

    var url = s3.getSignedUrl('getObject', params);
    console.log(url);
    res.redirect(url);
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
