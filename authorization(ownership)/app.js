
/*

🔐 Status Codes (Interview Gold)

401 → Not logged in

403 → Logged in but NOT owner

“Ownership authorization ensures users can access only their own resources.”

“Even authenticated users are restricted by ownership checks.”

“Ownership checks are critical to prevent data misuse.”

*/

const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();
app.use(express.json());

app.use("/", userRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});
