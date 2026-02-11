
const express = require("express");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const ownershipMiddleware = require("../middleware/ownershipMiddleware");

const router = express.Router();

/* ================= LOGIN ================= */
router.post("/login", (req, res) => {
  const { email } = req.body;

  // Fake DB users
  const users = {
    "user1@gmail.com": { id: 1, email },
    "user2@gmail.com": { id: 2, email }
  };

  const user = users[email];

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

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

/* ================= UPDATE OWN PROFILE ================= */
router.put(
  "/users/:id",
  authMiddleware,
  ownershipMiddleware,
  (req, res) => {
    res.json({
      message: "Profile updated successfully",
      updatedBy: req.user
    });
  }
);

module.exports = router;
