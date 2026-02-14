
const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();
app.use(express.json());

app.use("/", authRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});

/*

🔐 Status Codes (VERY IMPORTANT)

400 → Bad request

401 → Not authenticated

403 → Not authorized

404 → Resource not found


“This project implements a complete authentication system using bcrypt for secure password hashing, 
JWT for stateless authentication, middleware for protected routes, role-based authorization for
 admin access, and token invalidation logic
 to handle logout securely.”
*/