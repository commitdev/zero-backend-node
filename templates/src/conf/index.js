const conf = {
    jwtSecret: "SecretfromIdentityProvider",
    s3PresignedExpires: 60 * 5, //5 minutes 
    cfSignerExpires: 1000 * 60 * 5 //5 minutes
}

module.exports = conf;