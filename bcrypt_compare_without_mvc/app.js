
// app.js (or wherever routes are)
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("./models/User");
connectDB();
const app = express();
app.use(express.json());


app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // check existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // save to DB
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            user
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1️⃣ Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // 2️⃣ Compare entered password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // 3️⃣ Login success
        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

/*
During login, the system retrieves the user from MongoDB and uses bcrypt.compare() to verify 
the entered password against the stored hash, ensuring secure authentication without exposing passwords.


*/