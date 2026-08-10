const express = require("express");
const router = express.Router();

const {
  addDesignation,
  getDesignations,
  getDesignationById,
} = require("../controllers/designationController");

const protect = require("../middleware/authMiddleware");

console.log("Designation Routes File Loaded");

// Add Designation
router.post("/", protect, addDesignation);

// Get All Designations
router.get("/", protect, getDesignations);

// Get Designation By ID
router.get("/:id", protect, getDesignationById);

module.exports = router;