const express = require("express");
const resumeRoutes = express.Router();


// Middleware for authentication
// const authMiddleware = require("../middleware/auth.middleware");
const { createResume, getUserResumes, deleteResume } = require("../controller/Get&SetResume");
const { authenticateUser } = require("../Middleware/userAuthentication");

resumeRoutes.post("/resumes",authenticateUser, createResume);
resumeRoutes.get("/resumes", authenticateUser,getUserResumes);
resumeRoutes.delete("/resumes/:id", authenticateUser,deleteResume);

module.exports = resumeRoutes;