
const jwt = require("jsonwebtoken");
const blacklistedTokens = require("../utils/tokenBlacklist");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  // Logout check
  if (blacklistedTokens.has(token)) {
    return res.status(401).json({ message: "Token is invalid (logged out)" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
