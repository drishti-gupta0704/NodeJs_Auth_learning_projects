
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const users = require("../models/userStore");
const refreshTokens = require("../utils/refreshTokenStore");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    id: users.length + 1,
    email,
    password: hashedPassword
  });

  res.json({ message: "Registered successfully" });
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) return res.sendStatus(404);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.sendStatus(401);

  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  refreshTokens.add(refreshToken);

  res.json({
    accessToken,
    refreshToken
  });
});

/* ================= REFRESH TOKEN ================= */
router.post("/token", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken || !refreshTokens.has(refreshToken)) {
    return res.sendStatus(403);
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  });
});

/* ================= LOGOUT ================= */
router.post("/logout", (req, res) => {
  const { refreshToken } = req.body;
  refreshTokens.delete(refreshToken);
  res.json({ message: "Logged out successfully" });
});

/* ================= PROTECTED ================= */
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Protected profile", user: req.user });
});

module.exports = router;
