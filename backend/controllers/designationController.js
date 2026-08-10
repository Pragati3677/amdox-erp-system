const Designation = require("../models/Designation");

// Add Designation
const addDesignation = async (req, res) => {
  try {
    const designation = await Designation.create(req.body);

    res.status(201).json({
      success: true,
      message: "Designation added successfully",
      designation,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Designations
const getDesignations = async (req, res) => {
  try {
    const designations = await Designation.find()
      .populate("department", "departmentName");

    res.status(200).json({
      success: true,
      count: designations.length,
      designations,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Designation By ID
const getDesignationById = async (req, res) => {
  try {
    const designation = await Designation.findById(req.params.id)
      .populate("department", "departmentName");

    if (!designation) {
      return res.status(404).json({
        success: false,
        message: "Designation not found",
      });
    }

    res.status(200).json({
      success: true,
      designation,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addDesignation,
  getDesignations,
  getDesignationById,
};