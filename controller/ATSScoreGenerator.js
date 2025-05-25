const pdfParse = require("pdf-parse");
const fetch = require("node-fetch");
require("dotenv").config();

// Environment variables for Gemini API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-1.5-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Fallback scoring function
const calculateFallbackScore = (resumeText, jobDescription) => {
  const keywords = jobDescription
    ? jobDescription.toLowerCase().split(/\s+/).filter((w) => w.length > 3)
    : ["javascript", "python", "react", "node", "sql", "experience", "skills"];
  const resumeWords = resumeText.toLowerCase().split(/\s+/);
  const matches = keywords.filter((kw) => resumeWords.includes(kw)).length;
  const keywordMatch = Math.round((matches / keywords.length) * 100);
  const formattingScore = resumeText.includes("\n") ? 80 : 50;
  const structureScore = resumeText.includes("experience") && resumeText.includes("education") ? 85 : 60;
  const score = Math.round((keywordMatch + formattingScore + structureScore) / 3);
  return {
    score,
    keywordMatch,
    formattingScore,
    structureScore,
    suggestions: [
      "Include more job-specific keywords",
      "Use clear section headers like 'Experience' and 'Education'",
      "Avoid complex formatting or tables",
      "Ensure consistent font usage",
    ],
  };
};

exports.ScoreGenerator = async (req, res, next) => {
  try {
    const { jobRole, jobDescription } = req.body;
    const resumeFile = req.file;

    // Validate inputs
    if (!resumeFile) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    // Validate file type
    if (!["application/pdf"].includes(resumeFile.mimetype)) {
      return res.status(400).json({ message: "Only PDF files are allowed" });
    }

    // Extract text from PDF using pdf-parse
    let resumeText = "";
    try {
      const pdfData = await pdfParse(resumeFile.buffer, { max: 10 });
      resumeText = pdfData.text.trim();
    } catch (parseError) {
      return res.status(400).json({ message: "Failed to parse resume file" });
    }

    // Validate extracted text
    if (!resumeText || resumeText.length < 100) {
      return res.status(400).json({
        message: "Resume file is empty or unreadable. Please use a text-based PDF.",
      });
    }

    // Prepare prompt for Gemini API
    let prompt;
    if (jobRole && jobDescription) {
      prompt = `
        You are an expert ATS (Applicant Tracking System) analyzer. Analyze the resume below against the provided job role and job description. Return a JSON object with:
        - score: Overall ATS compatibility score (0-100), reflecting keyword alignment, formatting, and structure.
        - keywordMatch: Percentage of exact keyword matches with the job description (0-100).
        - formattingScore: Formatting quality (e.g., clear headers, no tables/images) (0-100).
        - structureScore: Structure quality (e.g., logical sections, consistency) (0-100).
        - suggestions: Array of 3–5 specific, actionable improvement suggestions.

        Scoring Instructions:
        - Scores MUST vary based on resume content. Do NOT return static scores (e.g., always 65%).
        - KeywordMatch: Calculate exact matches of job description keywords (case-insensitive).
        - Formatting: Reward simple, ATS-friendly formatting; penalize tables, images, or complex fonts.
        - Structure: Reward clear sections (e.g., Experience, Education, Skills); penalize disorganized layouts.
        - Provide unique suggestions tailored to the resume’s weaknesses.

        Job Role: ${jobRole}
        Job Description: ${jobDescription}
        Resume Text: ${resumeText.slice(0, 10000)}
      `;
    } else {
      prompt = `
        You are an expert ATS (Applicant Tracking System) analyzer. Analyze the resume below for general ATS compatibility, assuming a generic technical job role (e.g., software engineer). Return a JSON object with:
        - score: Overall ATS compatibility score (0-100), based on keyword relevance, formatting, and structure.
        - keywordMatch: Percentage of matches with common industry keywords (e.g., JavaScript, Python, SQL) (0-100).
        - formattingScore: Formatting quality (e.g., clear headers, no tables/images) (0-100).
        - structureScore: Structure quality (e.g., logical sections, consistency) (0-100).
        - suggestions: Array of 3–5 specific, actionable improvement suggestions.

        Scoring Instructions:
        - Scores MUST vary based on resume content. Do NOT return static scores (e.g., always 65%).
        - KeywordMatch: Use common technical keywords (e.g., skills, certifications, tools).
        - Formatting: Reward simple, ATS-friendly formatting; penalize tables, images, or complex fonts.
        - Structure: Reward clear sections (e.g., Experience, Education, Skills); penalize disorganized layouts.
        - Provide unique suggestions tailored to the resume’s weaknesses.

        Resume Text: ${resumeText.slice(0, 10000)}
      `;
    }

    // Call Gemini API
    let analysisResult;
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API request failed: ${response.statusText}`);
      }

      const geminiData = await response.json();
      const analysisText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Parse Gemini response
      const cleanText = analysisText.replace(/```json\n|\n```|```/g, "").trim();
      analysisResult = JSON.parse(cleanText);

      // Validate response structure
      const requiredFields = ["score", "keywordMatch", "formattingScore", "structureScore", "suggestions"];
      if (!requiredFields.every((field) => field in analysisResult)) {
        throw new Error("Invalid response structure from Gemini API");
      }

      // Normalize scores
      analysisResult.score = Math.max(0, Math.min(100, Number(analysisResult.score) || 0));
      analysisResult.keywordMatch = Math.max(0, Math.min(100, Number(analysisResult.keywordMatch) || 0));
      analysisResult.formattingScore = Math.max(0, Math.min(100, Number(analysisResult.formattingScore) || 0));
      analysisResult.structureScore = Math.max(0, Math.min(100, Number(analysisResult.structureScore) || 0));

      // Validate suggestions
      if (!Array.isArray(analysisResult.suggestions) || analysisResult.suggestions.length < 3) {
        analysisResult.suggestions = [
          "Use standard job titles to improve ATS parsing",
          "Incorporate more industry-specific keywords",
          "Simplify section headers for clarity",
          ...analysisResult.suggestions || [],
        ].slice(0, 5);
      }
    } catch (geminiError) {
      analysisResult = calculateFallbackScore(resumeText, jobDescription);
    }

    // Log final result

    // Send response
    return res.status(200).json(analysisResult);
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};