const express = require("express");
const router = express.Router();

const {
  addEmployee,
  getEmployees,
} = require("../controllers/employeeController");

const protect = require("../middleware/authMiddleware");

// Get All Employees
router.get("/", protect, getEmployees);

// Add Employee
router.post("/", protect, addEmployee);

module.exports = router;