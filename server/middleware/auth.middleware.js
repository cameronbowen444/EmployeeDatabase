const jwt = require("jsonwebtoken");

module.exports.authenticate = (request, response, next) => {
  const token = request.cookies.usertoken;

  if (!token) {
    return response.status(401).json({
      message: "You must be logged in to access this data.",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return response.status(401).json({
        message: "Invalid or expired login. Please log in again.",
      });
    }

    if (!payload.isApproved) {
      return response.status(403).json({
        message: "You do not have permission to access this data.",
      });
    }

    request.user = payload;
    next();
  });
};