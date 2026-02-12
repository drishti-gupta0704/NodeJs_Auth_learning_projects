/*
🔐 Status Codes Used (Interview Gold)

401 → Not authenticated (token missing/invalid)

403 → Authenticated but not authorized

*/
const express = require("express");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

/* ================= LOGIN ================= */
router.post("/login", (req, res) => {
  // Simulating DB users
  const { email } = req.body;

  let user;

  if (email === "admin@gmail.com") {
    user = { id: 1, email, role: "admin" };
  } else {
    user = { id: 2, email, role: "user" };
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Login successful",
    token
  });
});

/* ================= USER PROFILE ================= */
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "User profile",
    user: req.user
  });
});

/* ================= ADMIN ONLY ================= */
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin 👑",
      user: req.user
    });
  }
);

module.exports = router;
