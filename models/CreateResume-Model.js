// const mongoose = require("mongoose");

// const resumeSchema = new mongoose.Schema({
//   userId: {
//     type: String,
//     required: true 
//   },
//   fileName: {
//     type: String,
//     required: true
//   },
//   Template:{
//     type: String,
//     required: true
//   },
//   layout: {
//     type: String,
//     enum: ["single", "double"], 
//     required: true
//   },
//   personal: {
//     name: { type: String, required: true }, 
//     jobTitle: { type: String, required: true },
//     phone: { type: String },
//     email: { type: String, required: true },
//     linkedin: { type: String }
//   },
//   summary: { type: String },
//   experience: [{ 
//     companyName: String,
//     jobTitle: String,
//     location: String,
//     workType: String,
//     remote: Boolean,
//     startDate: String,
//     endDate: String,
//     description: String
//   }],
//   education: [{ 
//     institution: String,
//     degree: String,
//     gpa: String,
//     educationStartDate: String,
//     educationEndDate: String
//   }],
//   projects: [{
//     projectTitle: String,
//     projectDescription: String,
//     technologies: String
//   }],
//   skills: [String],
//   certifications: [String], 
// });
const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true 
  },
  fileName: {
    type: String,
    required: true
  },
  Template: {
    type: String,
    required: true
  },
  layout: {
    type: String,
    enum: ["single", "double"], 
    required: true
  },
  personal: {
    name: { type: String, required: true }, 
    jobTitle: { type: String, required: true },
    phone: { type: String },
    email: { type: String, required: true },
    linkedin: { type: String }
  },
  summary: { type: String },
  experience: [{ 
    companyName: String,
    jobTitle: String,
    location: String,
    workType: String,
    remote: Boolean,
    startDate: String,
    endDate: String,
    description: String
  }],
  education: [{ 
    institution: String,
    degree: String,
    gpa: String,
    educationStartDate: String,
    educationEndDate: String
  }],
  projects: [{
    projectTitle: String,
    projectDescription: String,
    technologies: String
  }],
  skills: [String],
  certifications: [String], 
}, { timestamps: true });  // 👈 Add this line


module.exports = mongoose.model("Resume", resumeSchema);