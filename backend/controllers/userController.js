const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const project = require("../models/projectModel")
const defaultCodeSnippets = require("../utils/Validator");
const { normalizeLanguage } = require("../utils/LanguageMapper");
require("dotenv").config();
exports.signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const emailCheck = await User.findOne({ email: email });
    if (emailCheck) {
      res.status(400).json({ success: false, message: "Email already exists" });
    }

    bcrypt.genSalt(12, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        let user = await User.create({
          fullName: name,
          email: email,
          password: hash,
        });

        return res.status(201).json({
          success: true,
          message: "User created successfully",
          user: user,
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, pwd } = req.body;

    const user = await User.findOne({ email: email });
    console.log(user);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    bcrypt.compare(pwd, user.password, function (err, result) {
      if (result) {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        res.cookie("token", token, {
          expires: new Date(Date.now() + 10 * 3600000),
          httpOnly: true,
        });

        return res.status(200).json({
          success: true,
          message: "User Login successful",
          user: {
            fullName: user.fullName,
            email: user.email,
          },
          token: token,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.cookie("token", null, {
      httpOnly: true,
      expires: new Date(Date.now()),
      sameSite: "Lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong during logout",
    });
  }
};

exports.createProject = async (req, res) => {
  try {
    let { name, projLanguage, version } = req.body;
    const LoggedInUser = req.user;
    const normalizedLanguage = normalizeLanguage(projLanguage);

    if (!normalizedLanguage) {
      return res.status(400).json({
        success: false,
        message: `Unsupported project language: ${projLanguage}`,
      });
    }
    const projectCode = defaultCodeSnippets[normalizedLanguage];

    const newProject = new Project({
      name,
      projLanguage: normalizedLanguage,
      createdBy: LoggedInUser._id,
      code: projectCode,
      version: version,
    });

    const project = await newProject.save();

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.saveProject = async (req, res) => {
  try {
    const { projectId, code } = req.body;
    const project = await Project.findOne({
      _id: projectId,
      createdBy: req.user._id,
    });
    project.code = code;
    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project code saved successfully",
      project: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const userId = req.user._id;
    const projects = await Project.find({ createdBy: userId }).populate("createdBy", "fullName email") 
  .sort({ date: -1 });;
    return res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      projects: projects,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;
    const project = await Project.findOne({ _id: projectId });
    if (project) {
      return res.status(200).json({
        success: true,
        message: "Projects fetched successfully",
        project: project,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await Project.findByIdAndDelete(projectId);

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.editProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, projLanguage } = req.body;

    console.log("Incoming data:", { name, projLanguage });

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Update fields conditionally
    if (name) project.name = name;

    if (projLanguage) {
      const formattedLang =
        projLanguage.charAt(0).toUpperCase() +
        projLanguage.slice(1).toLowerCase();
      project.projLanguage = formattedLang;
    }

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "Something went wrong while updating the project",
    });
  }
};


exports.verifyUser = async(req,res)=>{
  return  res.status(200).json({
    success: true,
    message: "User is authenticated",
    user: {
      fullName: req.user.fullName,
      email: req.user.email,
    },
  });
}