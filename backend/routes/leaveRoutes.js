const express = require("express");
const router = express.Router();

const {
  addLeave,
  getLeaves,
  getLeaveById,
  updateLeave,
  deleteLeave,
} = require("../controllers/leaveController");

const protect = require("../middleware/authMiddleware");

console.log("Leave Routes File Loaded");

// Add Leave
router.post("/", protect, addLeave);

// Get All Leaves
router.get("/", protect, getLeaves);

// Get Leave By ID
router.get("/:id", protect, getLeaveById);

// Update Leave
router.put("/:id", protect, updateLeave);

// Delete Leave
router.delete("/:id", protect, deleteLeave);

module.exports = router;