const express = require("express");
const router = express.Router();

const { addEmployee } = require("../controllers/employeeController");
const protect = require("../middleware/authMiddleware");

console.log("protect =", protect);
console.log("typeof protect =", typeof protect);

console.log("addEmployee =", addEmployee);
console.log("typeof addEmployee =", typeof addEmployee);

router.post("/", protect, addEmployee);

module.exports = router;