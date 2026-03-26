require("dotenv").config(); // Load environment variables
const express = require("express");
const connectDB = require("./config/db"); // Database connection
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json()); // Use built-in body parser for JSON
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
const authRoutes = require("./routes/user"); // Import auth routes
const profileRoutes = require("./routes/profile");
const uploadRoutes = require("./routes/upload");


app.use("/api/auth", authRoutes); // Define routes before error handling
app.use("/api/profile", profileRoutes);
app.use("/api/upload", uploadRoutes);

const errorHandler = require("./middlewares/error");
app.use(errorHandler); // Error handler should be last

// Home route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
