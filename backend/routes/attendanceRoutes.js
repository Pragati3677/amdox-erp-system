const express = require("express");
const router = express.Router();

const {
  addAttendance,
  getAttendances,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");

const protect = require("../middleware/authMiddleware");

console.log("Attendance Routes File Loaded");

// Add Attendance
router.post("/", protect, addAttendance);

// Get All Attendance
router.get("/", protect, getAttendances);

// Get Attendance By ID
router.get("/:id", protect, getAttendanceById);

// Update Attendance
router.put("/:id", protect, updateAttendance);

// Delete Attendance
router.delete("/:id", protect, deleteAttendance);

module.exports = router;