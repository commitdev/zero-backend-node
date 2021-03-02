const aws = require("aws-sdk");

const s3 = new aws.S3();

class FileService {
    constructor(){}

    getUploadPresignedUrl(key){
        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: key,
            Expires: 60 * 60, // 60 minutes
        };
        const url = s3.getSignedUrl('putObject',params);
        return {
            url: url,
            method: "put"
        };
    }

    getDownloadPresignedUrl(key){
        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: key,
            Expires: 60 * 60, // 60 minutes
        };
        const url = s3.getSignedUrl('getObject',params);
        console.log(url);
        return {
            url: url,
            method: "get"
        };
    }
}

module.exports = FileService;