const express = require('express');
const { ScoreGenerator } = require('../controller/ATSScoreGenerator');
const ATSScoreGenerator = express.Router()
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

ATSScoreGenerator.post("/api/ATS-Score", upload.single("resume"), ScoreGenerator);

module.exports = ATSScoreGenerator;