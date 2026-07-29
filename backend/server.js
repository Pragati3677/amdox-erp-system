const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Amdox ERP Backend Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});