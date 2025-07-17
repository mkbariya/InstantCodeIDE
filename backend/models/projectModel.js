const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  projLanguage: {
    type: String,
    required: [true, "Project language is required"],
    enum: {
      values: ["JavaScript", "Python", "Java", "C++", "C", "Go", "Bash"],
      message: "{VALUE} is not a supported programming language",
    },
  },
  code: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  version: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Project", projectSchema);
