const puppeteer = require('puppeteer');
require('dotenv').config();

exports.ResumeDownload = async (req, res) => {
  console.log('PDF Download Request Received');
  console.log('Chromium executable path:', puppeteer.executablePath());

  try {
    const { htmlContent } = req.body;

    if (!htmlContent) {
      return res.status(400).json({ error: '❗HTML content is required!' });
    }

    const browser = await puppeteer.launch({
      headless: 'new', // Use 'new' for Puppeteer >= 18
      args: ['--no-sandbox', '--disable-setuid-sandbox',"--single-process", "--no-zygon"],
      executablePath: process.env.NODE_ENV === "production" ?  process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath(),
    });

    const page = await browser.newPage();

    await page.setContent(htmlContent, {
      waitUntil: ['domcontentloaded', 'networkidle0'],
    });

    // Wait for fonts and icons to render
    await page.evaluateHandle('document.fonts.ready');
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second delay for stability

    await page.emulateMediaType('screen');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      height: '1123px',
      width: '794px',
      printBackground: true,
      pageRanges: '1',
      preferCSSPageSize: true,
      margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' },
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="resume.pdf"',
      'Content-Length': pdfBuffer.length,
      'Access-Control-Allow-Origin': req.headers.origin || 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
  }
};

// const puppeteer = require('puppeteer');
// const fs = require('fs');

// exports.ResumeDownload = async (req, res) => {
//   console.log('PDF Download Request Received');

//   try {
//     const { htmlContent } = req.body;

//     if (!htmlContent) {
//       return res.status(400).json({ error: '❗HTML content is required!' });
//     }

//     // Define Chrome executable path
//     const executablePath =
//       process.env.PUPPETEER_EXECUTABLE_PATH ||
//       '/opt/render/.cache/puppeteer/chrome/linux-133.0.6943.98/chrome-linux64/chrome';

//     // Debug: Check if Chrome executable exists
//     console.log('Checking Chrome executable at:', executablePath);
//     console.log('Chrome executable exists:', fs.existsSync(executablePath));

//     // Debug: Check Puppeteer cache directory
//     const puppeteerCacheDir = '/opt/render/.cache/puppeteer';
//     try {
//       const cacheFiles = fs.readdirSync(puppeteerCacheDir);
//       console.log('Files in Puppeteer cache directory:', cacheFiles);
//       if (fs.existsSync(executablePath)) {
//         const stats = fs.statSync(executablePath);
//         console.log('Chrome file permissions:', stats.mode.toString(8));
//       }
//     } catch (dirError) {
//       console.log('Error reading Puppeteer cache directory:', dirError.message);
//     }

//     const browser = await puppeteer.launch({
//       headless: true,
//       args: [
//         '--no-sandbox',
//         '--disable-setuid-sandbox',
//         '--disable-dev-shm-usage',
//         '--disable-gpu',
//       ],
//       executablePath: executablePath,
//     });

//     const page = await browser.newPage();
//     await page.setContent(htmlContent, {
//       waitUntil: ['domcontentloaded', 'networkidle0'],
//     });

//     await page.evaluateHandle('document.fonts.ready');
//     await new Promise((resolve) => setTimeout(resolve, 2000));
//     await page.emulateMediaType('screen');

//     const pdfBuffer = await page.pdf({
//       format: 'A4',
//       width: '794px',
//       height: '1123px',
//       printBackground: true,
//       pageRanges: '1',
//       preferCSSPageSize: true,
//       margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' },
//     });

//     await browser.close();

//     res.set({
//       'Content-Type': 'application/pdf',
//       'Content-Disposition': 'attachment; filename="resume.pdf"',
//       'Content-Length': pdfBuffer.length,
//       'Access-Control-Allow-Origin': req.headers.origin || 'http://localhost:3000',
//       'Access-Control-Allow-Methods': 'POST',
//       'Access-Control-Allow-Headers': 'Content-Type',
//     });

//     res.send(pdfBuffer);
//   } catch (error) {
//     console.error('PDF generation error:', error);
//     res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
//   }
// };