var express = require("express");
const {
  signUp,
  login,
  createProject,
  saveProject,
  getProjects,
  getProject,
  logout,
  deleteProject,
  editProject,
  verifyUser,
} = require("../controllers/userController");
const userAuth = require("../controllers/auth");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/signUp", signUp);
router.post("/login", login);
router.post("/createproject", userAuth, createProject);
router.post("/saveproject", userAuth, saveProject);
router.get("/getprojects", userAuth, getProjects);
router.get("/getproject/:projectId", userAuth, getProject);
router.post("/logout", logout);
router.delete("/deleteproject/:projectId", userAuth, deleteProject);
router.post("/editproject/:projectId", userAuth, editProject);
router.get("/verifyuser",userAuth,verifyUser)

module.exports = router;
