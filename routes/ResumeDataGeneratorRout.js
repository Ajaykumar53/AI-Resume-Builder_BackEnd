const express = require('express');
const { GenerateJobDescription,GenerateProfessionalSummary,GenerateProjectDescription } = require('../controller/resumeDataGenrator');
const ResumeDataGeneratorRout = express.Router()

ResumeDataGeneratorRout.post('/generate-job-description',GenerateJobDescription)
ResumeDataGeneratorRout.post('/generate-professional-summary',GenerateProfessionalSummary)
ResumeDataGeneratorRout.post('/generate-project-description',GenerateProjectDescription)


module.exports = ResumeDataGeneratorRout;