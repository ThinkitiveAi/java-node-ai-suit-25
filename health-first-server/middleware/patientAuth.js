const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

function authenticatePatientToken(req, res, next) {
  let token = null;
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
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

module.exports = { authenticatePatientToken };
