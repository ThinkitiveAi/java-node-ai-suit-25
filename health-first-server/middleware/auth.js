const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({
        success: false,
        message: "No token provided",
        error_code: "NO_TOKEN",
      });
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({
            success: false,
            message: "Token expired",
            error_code: "TOKEN_EXPIRED",
          });
      }
      return res
        .status(401)
        .json({
          success: false,
          message: "Invalid token",
          error_code: "INVALID_TOKEN",
        });
    }
    req.user = user;
    next();
  });
}

// Authorization middleware (provider must be active and verified)
function authorizeProvider(req, res, next) {
  const { verification_status } = req.user;
  if (verification_status !== "verified") {
    return res
      .status(403)
      .json({
        success: false,
        message: "Account not verified",
        error_code: "ACCOUNT_NOT_VERIFIED",
      });
  }
  next();
}

module.exports = { authenticateToken, authorizeProvider };
