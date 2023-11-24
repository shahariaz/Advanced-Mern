const catchAsync = require("../utils/catchAsync");
const Teacher = require("../models/teacher.model");
const Student = require("../models/student");
exports.loginhandler = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Check if the user is a student
  const student = await Student.findOne({ email, password });
  if (student) {
    // Return a JSON response for the student
    return res.status(200).json({
      status: "success",
      role: "student",
      data: student,
    });
  }

  // Check if the user is a teacher
  const teacher = await Teacher.findOne({ email, password });
  if (teacher) {
    // Return a JSON response for the teacher
    return res.status(200).json({
      status: "success",
      role: "teacher",
      data: teacher,
    });
  }

  // If no matching user found, return a JSON response with an error
  res.status(404).json({
    status: "error",
    message: "User not found",
  });
});
// Handler to find a user by ID
exports.findById = catchAsync(async (req, res) => {
  // Check if the user is a student
  const student = await Student.findById(req.params.id);
  if (student) {
    // Return a JSON response for the student
    return res.status(200).json({
      status: "success",
      role: "student",
      data: student,
    });
  }

  // Check if the user is a teacher
  const teacher = await Teacher.findById(req.params.id);
  if (teacher) {
    // Return a JSON response for the teacher
    return res.status(200).json({
      status: "success",
      role: "teacher",
      data: teacher,
    });
  }

  // If no matching user found, return a JSON response with an error
  res.status(404).json({
    status: "error",
    message: "User not found",
  });
});
