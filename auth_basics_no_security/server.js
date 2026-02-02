
const express = require("express");
const app = express();

app.use(express.json());

//  TEMPORARY storage (plain passwords)
const users = [];

// REGISTER USER

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  // basic validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  // check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // ❌ Storing password as plain text (BAD PRACTICE)
  users.push({ email, password });

  res.json({ message: "User registered successfully" });
});

// LOGIN USER


app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    user => user.email === email && user.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({ message: "Login successful" });
});


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
