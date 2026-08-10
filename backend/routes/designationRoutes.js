const express = require("express");
const router = express.Router();

const {
  addDesignation,
  getDesignations,
  getDesignationById,
  updateDesignation,
} = require("../controllers/designationController");

const protect = require("../middleware/authMiddleware");

console.log("Designation Routes File Loaded");

// Add Designation
router.post("/", protect, addDesignation);

// Get All Designations
router.get("/", protect, getDesignations);

// Get Designation By ID
router.get("/:id", protect, getDesignationById);

// Update Designation
router.put("/:id", protect, updateDesignation);

module.exports = router;