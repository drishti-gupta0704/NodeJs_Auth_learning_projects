
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();

// middleware
app.use(express.json());

// database
connectDB();

// routes
app.use("/auth", require("./routes/authRoutes"));

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
