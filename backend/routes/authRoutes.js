const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

// Public Routes
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

// Protected Route
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

module.exports = router;