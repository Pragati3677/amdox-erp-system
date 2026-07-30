const express = require("express");
const router = express.Router();

const { addDepartment,
        getDepartments,
        getDepartmentById,
        updateDepartment,
 } = require("../controllers/departmentController");
const protect = require("../middleware/authMiddleware");

console.log("Department Routes File Loaded");

// Add Department
router.post("/",protect ,addDepartment);

// get all department
router.get("/", protect, getDepartments);

//get department by id
router.get("/:id", protect, getDepartmentById);

// update departmment by id
router.put("/:id", protect, updateDepartment);

module.exports = router;