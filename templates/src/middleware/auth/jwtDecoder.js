const expressJWT = require("express-jwt");
const pathToRegexp = require('path-to-regexp');
const { jwtSecret } = require("../../conf");

/*the middleware to verify token and parse token to req.user, 
please visit https://github.com/auth0/express-jwt for the more details */
const jwtDecoder = expressJWT({
    secret: jwtSecret,
    algorithms: ['HS256']
    }).unless({
    path: [pathToRegexp('/mock/*'), pathToRegexp('/status/*')] 
  });

const unAuthErrorHandler = (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {   
      res.status(401).json('invalid token')
    }
}

module.exports = {jwtDecoder, unAuthErrorHandler};
