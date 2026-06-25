const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required!"],
      minlength: [3, "First name must be at least 3 characters!"],
      trim: true,
    },

    lastName: {
      type: String,
      required: [true, "Last name is required!"],
      minlength: [3, "Last name must be at least 3 characters!"],
      trim: true,
    },

    age: {
      type: Number,
      required: [true, "Age is required!"],
      min: [18, "Must be at least 18 to be a member!"],
    },

    email: {
      type: String,
      required: [true, "Email is required!"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address!"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required!"],
      trim: true,
      minlength: [10, "Phone number must be at least 10 characters!"],
    },

    position: {
      type: String,
      required: [true, "Position is required!"],
      minlength: [2, "Position must be at least 2 characters!"],
      trim: true,
    },

    department: {
      type: String,
      required: [true, "Department is required!"],
      enum: {
        values: [
          "Engineering",
          "Sales",
          "Marketing",
          "Operations",
          "Human Resources",
          "Finance",
          "Customer Support",
          "Management",
        ],
        message: "Please select a valid department!",
      },
    },

    salary: {
      type: Number,
      required: [true, "Salary is required!"],
      min: [0, "Salary cannot be negative!"],
    },

    status: {
      type: String,
      enum: ["Active", "On Leave", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Member", MemberSchema);