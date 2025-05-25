const Resume = require("../models/CreateResume-Model");

exports.getUserResumes = async (req, res) => {
  try {
    // Get resumes for the authenticated user
    const resumes = await Resume.find({ userId: req.user.userId });
    // Return success response
    res.status(200).json({
      message: "Resumes fetched successfully",
      resumes
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch resumes" });
  }
};
exports.createResume = async (req, res) => {
  try {
    const {
      fileName,
      layout,
      personal,
      summary,
      experience,
      education,
      projects,
      skills,
      certifications,
      Template,
    } = req.body;

    // Check for existing resume with the same fileName and userId
    const existingResume = await Resume.findOne({
      userId: req.user.userId,
      fileName: { $regex: `^${fileName}$`, $options: "i" }, // Case-insensitive match
    });

    if (existingResume) {
      // Update existing resume
      existingResume.Template = Template || existingResume.Template;
      existingResume.layout = layout || existingResume.layout;
      existingResume.personal = personal || existingResume.personal;
      existingResume.summary = summary || existingResume.summary;
      existingResume.experience = experience || existingResume.experience;
      existingResume.education = education || existingResume.education;
      existingResume.projects = projects || existingResume.projects;
      existingResume.skills = skills || existingResume.skills;
      existingResume.certifications = certifications || existingResume.certifications;
      existingResume.updatedAt = new Date(); // Update timestamp

      await existingResume.save();
      return res.status(200).json({
        message: "Resume updated successfully",
        resume: existingResume,
      });
    }

    // Create new resume if no existing resume is found
    const newResume = new Resume({
      userId: req.user.userId, // Extracted from authentication middleware
      Template,
      fileName,
      layout,
      personal,
      summary,
      experience: experience || [],
      education,
      projects: projects || [],
      skills: skills || [],
      certifications: certifications || [],
    });

    await newResume.save();
    res.status(201).json({
      message: "Resume created successfully",
      resume: newResume,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to process resume" });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; 

    const deletedResume = await Resume.findOneAndDelete({ _id: id, userId });

    if (!deletedResume) {
      return res.status(404).json({ error: "Resume not found or unauthorized" });
    }

    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete resume" });
  }
};