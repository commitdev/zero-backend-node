const aws = require("aws-sdk");
const conf = require("../conf");

const s3 = new aws.S3();

class FileService {
    constructor(){}

    getUploadPresignedUrl(key){
        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: key,
            Expires: conf.s3PresignedExpires,
        };
        const url = s3.getSignedUrl('putObject',params);
        return {
            url: url,
            method: "put"
        };
    }

    getDownloadPresignedUrl(key){
        const cloudfrontAccessKeyId = process.env.CF_KEYPAIR_ID;
        const cloudFrontPrivateKey = process.env.CF_KEYPAIR_SECRET_KEY;
        const cloudFrontDomain = process.env.CF_DOMAIN;
        const signer = new aws.CloudFront.Signer(cloudfrontAccessKeyId, cloudFrontPrivateKey);
        key = (key.substring(0,1)=='/') ? key : "/"+key

        const url = signer.getSignedUrl({
            url: cloudFrontDomain+key,
            expires: new Date().getTime() + conf.cfSignerExpires
        });

        return {
            url: url,
            method: "get"
        };
    }
}

module.exports = FileService;