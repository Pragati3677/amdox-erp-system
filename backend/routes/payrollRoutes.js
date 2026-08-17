const express = require("express");
const router = express.Router();

const {
  addPayroll,
  getPayrolls,
  getPayrollById,
  updatePayroll,
  deletePayroll,
} = require("../controllers/payrollController");

const protect = require("../middleware/authMiddleware");



// Add Payroll
router.post("/", protect, addPayroll);

// Get All Payrolls
router.get("/", protect, getPayrolls);

// Get Payroll By ID
router.get("/:id", protect, getPayrollById);

// Update Payroll
router.put("/:id", protect, updatePayroll);

// Delete Payroll
router.delete("/:id", protect, deletePayroll);

module.exports = router;