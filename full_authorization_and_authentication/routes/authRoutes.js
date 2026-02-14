
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const users = require("../models/userStore");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const blacklistedTokens = require("../utils/tokenBlacklist");

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  const { email, password, role } = req.body;

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: users.length + 1,
    email,
    password: hashedPassword,
    role: role || "user"
  };

  users.push(newUser);

  res.json({ message: "User registered successfully" });
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ message: "Login successful", token });
});

/* ================= LOGOUT ================= */
router.post("/logout", authMiddleware, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  blacklistedTokens.add(token);

  res.json({ message: "Logged out successfully" });
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
