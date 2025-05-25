const express = require('express');
const { ResumeDownload } = require('../controller/resumeDownload');
const router = express.Router()


router.post('/download-resume',ResumeDownload)


module.exports = router;