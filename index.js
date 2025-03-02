require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("./config/db"); // Database connection
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
const authRoutes = require("./routes/user"); // Import auth routes
const errorHandler = require("./middlewares/error");

app.use(errorHandler);

app.use("/api/auth", authRoutes); // Use authentication routes

// Home route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
