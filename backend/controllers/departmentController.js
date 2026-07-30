const Department = require("../models/Department");

// Add Department
const addDepartment = async (req, res) => {
  console.log("Controller Reached");
  console.log(req.body);

  try {
    const department = await Department.create(req.body);

    res.status(201).json({
      success: true,
      message: "Department added successfully",
      department,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Departments
const getDepartments = async (req, res) => {

  try {
    const departments = await Department.find();

    res.status(200).json({
      success: true,
      count: departments.length,
      departments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addDepartment,
  getDepartments,
};