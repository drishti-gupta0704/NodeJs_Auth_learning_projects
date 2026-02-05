
const express = require("express");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* ================= LOGIN ================= */
router.post("/login", (req, res) => {
  // Normally: verify email & password from DB
  const user = {
    id: 1,
    email: "user@gmail.com"
  };

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Login successful",
    token
  });
});

/* ================= PROTECTED PROFILE ================= */
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to profile",
    user: req.user
  });
});

module.exports = router;
