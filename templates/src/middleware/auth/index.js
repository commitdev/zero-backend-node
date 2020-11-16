const authMiddleware = (req, res, next) => {
  /** Expecting oathkeeper to pass on user identity in headers
   *  (note nodejs converts all headers to lowercase)
   *  1. X-User-Id
   *  2. X-User-Email
   * */
  const hasKratosCookie = req.headers.cookie.match(/ory_kratos_session/);
  const hasUserData = req.headers["x-user-id"] && req.headers["x-user-email"];
  if (!hasKratosCookie || !hasUserData) {
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
};

module.exports = {
  authMiddleware,
};
