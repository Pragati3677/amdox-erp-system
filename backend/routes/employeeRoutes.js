const express = require("express");
const router = express.Router();

const {
  addEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

const protect = require("../middleware/authMiddleware");

// Get All Employees
router.get("/", protect, getEmployees);

// Get Employee By ID
router.get("/:id", protect, getEmployeeById);

// Add Employee
router.post("/", protect, addEmployee);

// Update Employee
router.put("/:id", protect, updateEmployee);

// Delete Employee
router.delete("/:id", protect, deleteEmployee);

module.exports = router;