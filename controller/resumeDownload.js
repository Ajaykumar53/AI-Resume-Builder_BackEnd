
const puppeteer = require("puppeteer");

exports.ResumeDownload = async (req, res) => {

  (async () => {
  console.log("Chromium executable path:", puppeteer.executablePath());
})();
  console.log("pdf Download Request Received");
  try {
    const { htmlContent } = req.body;

    if (!htmlContent) {
      return res.status(400).json({ error: "❗HTML content is required!" });
    }

  const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
  executablePath: puppeteer.executablePath(), // Force use puppeteer's downloaded chrome
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