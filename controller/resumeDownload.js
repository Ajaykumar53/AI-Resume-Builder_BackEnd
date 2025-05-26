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

const puppeteer = require('puppeteer');

exports.ResumeDownload = async (req, res) => {
  console.log('PDF Download Request Received');

  try {
    const { htmlContent } = req.body;

    if (!htmlContent) {
      return res.status(400).json({ error: '❗HTML content is required!' });
    }
const browser = await puppeteer.launch({
  executablePath: '/opt/render/.cache/puppeteer/chrome/linux-133.0.6943.98/chrome-linux64/chrome',
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});


    const page = await browser.newPage();
    await page.setContent(htmlContent, {
      waitUntil: ['domcontentloaded', 'networkidle0'],
    });

    await page.evaluateHandle('document.fonts.ready');
    await new Promise(resolve => setTimeout(resolve, 2000));
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
