// const puppeteer = require('puppeteer');

// exports.ResumeDownload = async (req, res) => {
//   console.log('PDF Download Request Received');
//   console.log('Chromium executable path:', puppeteer.executablePath());

//   try {
//     const { htmlContent } = req.body;

//     if (!htmlContent) {
//       return res.status(400).json({ error: '❗HTML content is required!' });
//     }

//     const browser = await puppeteer.launch({
//       headless: 'new', // Use 'new' for Puppeteer >= 18
//       args: ['--no-sandbox', '--disable-setuid-sandbox'],
//       // Remove executablePath to let Puppeteer find Chromium automatically
//     });

//     const page = await browser.newPage();

//     await page.setContent(htmlContent, {
//       waitUntil: ['domcontentloaded', 'networkidle0'],
//     });

//     // Wait for fonts and icons to render
//     await page.evaluateHandle('document.fonts.ready');
//     await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second delay for stability

//     await page.emulateMediaType('screen');

//     const pdfBuffer = await page.pdf({
//       format: 'A4',
//       height: '1123px',
//       width: '794px',
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
const puppeteer = require('puppeteer-core'); // Use puppeteer-core for explicit Chrome path
const fs = require('fs'); // For debugging Chrome path

exports.ResumeDownload = async (req, res) => {
  console.log('PDF Download Request Received');

  try {
    const { htmlContent } = req.body;

    if (!htmlContent) {
      return res.status(400).json({ error: '❗HTML content is required!' });
    }

    // Define Chrome executable path from deployment logs
    const executablePath = '/opt/render/.cache/puppeteer/chrome/linux-133.0.6943.98/chrome-linux64/chrome';

    // Debug: Check if Chrome executable exists
    console.log('Chrome executable exists:', fs.existsSync(executablePath));

    const browser = await puppeteer.launch({
      headless: true, // Use true instead of 'new' for broader compatibility
      args: [
        '--no-sandbox', // Required for Render
        '--disable-setuid-sandbox', // Required for Render
        '--disable-dev-shm-usage', // Prevent memory issues in containers
        '--disable-gpu', // Disable GPU for headless environments
      ],
      executablePath: executablePath, // Explicitly set Chrome path
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, {
      waitUntil: ['domcontentloaded', 'networkidle0'],
    });

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');
    // Add a small delay to ensure rendering stability
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await page.emulateMediaType('screen');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      width: '794px', // Explicit width for A4
      height: '1123px', // Explicit height for A4
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