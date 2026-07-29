const express = require("express");
const router = express.Router();

const { addDepartment } = require("../controllers/departmentController");
const protect = require("../middleware/authMiddleware");

console.log("Department Routes File Loaded");

// Add Department
router.post("/",protect ,addDepartment);

module.exports = router;