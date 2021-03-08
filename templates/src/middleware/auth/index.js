const authMiddleware = (req, res, next) => {
  /** Expecting oathkeeper to pass on user identity in headers
   *  (note nodejs converts all headers to lowercase)
   *  1. X-User-Id
   *  2. X-User-Email
   * */
  if (inAllowlist(req.path)) {
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

//authAllowlist defines the paths that will not pass the authentication middleware
const authAllowlist = ["/status/ready", "/status/alive", "/status/about"];

const inAllowlist = (path) => {
  return authAllowlist.find(element => element === path);
}

module.exports = {
  authMiddleware,
};
