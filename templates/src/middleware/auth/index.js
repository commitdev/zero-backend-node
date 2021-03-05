const authMiddleware = (req, res, next) => {
  /** Expecting oathkeeper to pass on user identity in headers
   *  (note nodejs converts all headers to lowercase)
   *  1. X-User-Id
   *  2. X-User-Email
   * */
  if (inWhitelist(req.path)) {
    next();
  } else {
    const hasUserData = req.headers["x-user-id"] && req.headers["x-user-email"];
    if (!hasUserData) {
      res.status(401);
      res.json({
        success: false,
        message: "unauthenticated",
      });
    } else {
      req.user = {
        id: req.headers["x-user-id"],
        email: req.headers["x-user-email"],
      };
      next();
    }
  }

};

//whitelist defines the paths that will not pass the authentication middleware
const auth_whitelist = ["/status/ready", "/status/alive", "/status/about"];

const inWhitelist = (path) => {
  return auth_whitelist.find(element => element === path);
}

module.exports = {
  authMiddleware,
};
