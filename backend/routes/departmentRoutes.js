const express = require("express");
const router = express.Router();

const { addDepartment,
        getDepartments,
 } = require("../controllers/departmentController");
const protect = require("../middleware/authMiddleware");

console.log("Department Routes File Loaded");

// Add Department
router.post("/",protect ,addDepartment);

// get all department
router.get("/", protect, getDepartments);

module.exports = router;