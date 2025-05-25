
// const puppeteer = require("puppeteer");
// const fs = require("fs");
// const path = require("path");

// exports.ResumeDownload = async (req, res) => {

  
//   try {
//     const { htmlContent } = req.body;

//     if (!htmlContent) {
//       return res.status(400).json({ error: "❗HTML content is required!" });
//     }

//     const browser = await puppeteer.launch({
//       headless: "new",
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });

//     const page = await browser.newPage();
    

//     await page.setContent(htmlContent, {
//       waitUntil: ["domcontentloaded", "networkidle0"],
//     });

//     // ✅ Wait for fonts and icons to render fully
//     await page.evaluateHandle("document.fonts.ready");

//     // 🕐 Manual delay for icon rendering (older Puppeteer compatible)
//     await new Promise((r) => setTimeout(r, 1000));

//     await page.emulateMediaType("screen");

//     const pdfPath = path.join(__dirname, "resume.pdf");

//     const pdfBuffer = await page.pdf({
//             format: "A4", // this auto sets height/width correctly in mm
//             height: "1123px",
//             width: "794px", // A4 size in pixels at 96 DPI
//             path: pdfPath,
//             printBackground: true,
//             pageRanges: "1",
//             preferCSSPageSize: true, 
//             padding: { top: "0px", bottom: "0px", left: "0px", right: "0px" },
//           });

//     await browser.close();

//       // Set headers for PDF download
//     res.set({
//       "Content-Type": "application/pdf",
//       "Content-Disposition": 'attachment; filename="resume.pdf"',
//       "Content-Length": pdfBuffer.length,
//     });

//     // Send the PDF buffer
//     res.send(pdfBuffer);
//     res.download(pdfPath, "resume.pdf", (err) => {
//       if (err) {
//         res.status(500).json({ error: "Failed to send PDF" });
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to generate PDF" });
//   }
// };

const puppeteer = require("puppeteer");

exports.ResumeDownload = async (req, res) => {
  try {
    const { htmlContent } = req.body;

    if (!htmlContent) {
      return res.status(400).json({ error: "❗HTML content is required!" });
    }

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setContent(htmlContent, {
      waitUntil: ["domcontentloaded", "networkidle0"],
    });

    // ✅ Wait for fonts and icons to render fully
    await page.evaluateHandle("document.fonts.ready");

    // 🕐 Manual delay for icon rendering (increased for stability)
    await new Promise((r) => setTimeout(r, 2000));

    await page.emulateMediaType("screen");

    const pdfBuffer = await page.pdf({
      format: "A4",
      height: "1123px",
      width: "794px",
      printBackground: true,
      pageRanges: "1",
      preferCSSPageSize: true,
      margin: { top: "0px", bottom: "0px", left: "0px", right: "0px" },
    });

    await browser.close();

    // Set headers for PDF download
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="resume.pdf"',
      "Content-Length": pdfBuffer.length,
      "Access-Control-Allow-Origin": req.headers.origin || "http://localhost:3000", // Adjust for your frontend
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
    });

    // Send the PDF buffer
    res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ error: "Failed to generate PDF", details: error.message });
  }
};