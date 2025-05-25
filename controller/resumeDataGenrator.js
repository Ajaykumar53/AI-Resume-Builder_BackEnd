require("dotenv").config(); // Load environment variables
const fetch = require("node-fetch");

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Use .env file for security
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-1.5-flash"; // Use free model
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent`;

exports.GenerateProjectDescription = async (req, res) => {
    
  const { roughDescription } = req.body;


  // Validate input
  if (!roughDescription || typeof roughDescription !== "string") {
    return res.status(400).json({ error: "Invalid input: roughProjectDescription is required and must be a string." });
  }

  try {
    // Call Gemini API using fetch
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
//         contents: [
//           {
//             role: "user",
//              parts: [{ text: `Craft a highly professional and engaging project description based on the given rough details.  
// The description should be clear, concise, and aligned with industry standards, making it suitable for presentations, portfolios, or proposals.  
// Ensure the output is a well-structured, only 3 points around 1 to 1.5 lines each, that effectively highlights the project's purpose, key features, and impact.  and give one line break after each point.
// Do not include any labels or headings.

// Here is the rough project description:  
// ${roughProjectDescription}` }] }]
contents: [
  {
    role: "user",
    parts: [{
      text: `ROLE: You are a world-class project strategist and AI writing assistant. Your task is to generate a **highly polished, concise, and impactful 3-point project description** suitable for resumes, portfolios, or proposals.  

**INPUT ANALYSIS**:  
- Analyze the user’s rough project description for **purpose**, **key features/technologies**, and **measurable outcomes**.  
- Infer missing details (e.g., industry, tools, quantified impact) to create a cohesive narrative.  

**OUTPUT STRUCTURE**:  
1. **Purpose & Scope**:  
   - Start with the project’s goal + target audience/problem solved.  
   - Use active verbs (e.g., "Developed," "Designed," "Optimized").  

2. **Key Features & Technologies**:  
   - List 2–3 standout features or tools used (e.g., "Python, React, REST APIs").  
   - Highlight innovation or uniqueness (e.g., "AI-powered recommendation engine").  

3. **Impact & Results**:  
   - Quantify outcomes (e.g., "Improved performance by 40%").  
   - Link to broader business/technical value (e.g., "Reduced manual work by 30%").  

**CONSTRAINTS**:  
- Output **only** 3 points (1–1.5 lines each), separated by **one line break** ("\n\n").  
- Avoid vague phrases like "worked on" or "helped with."  
- Ensure **ATS compatibility** (use keywords from the user’s input).  
- Fix text-splitting issues (e.g., "AI l igence" → "Artificial Intelligence").  

**EXAMPLE INPUT**:  
"Built a task management app for remote teams. Used React and Firebase. Added AI-based priority suggestions. Improved team productivity by 25%."  

**OUTPUT**:  
Developed a task management app for remote teams to streamline workflow efficiency and collaboration.  
Integrated React and Firebase for real-time updates, with an AI-powered priority suggestion system.  
Boosted team productivity by 25% through automated task prioritization and centralized communication.  

**NOW PROCESS THE USER’S INPUT**:  
${roughDescription} `
    }]
  }
]


        }),
      });
      

       // Check if the API response is successful
       const responseData = await response.json();
       if (!response.ok) {
         return res.status(response.status).json({ error: responseData.error.message || "Gemini API error" });
       }
   
       // Extract optimized data from the response
       const optimizedData = responseData.candidates?.[0]?.content?.parts?.[0]?.text || "No optimized data available";
   
       // Send response to frontend
       res.json({ optimizedData });
     } catch (error) {
       res.status(500).json({ error: "Failed to optimize job description. Please try again later." });
     }
}






exports.GenerateProfessionalSummary = async (req, res) => {

  const { roughDescription } = req.body;
  // Validate input
  if (!roughDescription || typeof roughDescription !== "string") {
    return res.status(400).json({ error: "Invalid input: roughDescription is required and must be a string." });
  }

  try {
    // Call Gemini API using fetch
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
//         contents: [
//           {
//             role: "user",
//              parts: [{ text: `Craft a highly professional and polished summary that highlights the user's key skills, achievements, and career goals.  
// Ensure the summary is clear, engaging, and aligned with industry standards, making it suitable for the experience section of a resume.  
// The output should be ONLY a 3-3.5 line paragraph without any bullet points or headings.   
// x
//       ${roughDescription}` }] }]
contents: [
  {
    role: "user",
    parts: [{
      text: `ROLE: You are a world-class resume strategist and AI writing assistant. Your task is to generate a **highly polished, ATS-friendly, and human-engaging 3–3.5 line professional summary** for a resume's experience section.  

**INPUT ANALYSIS**:  
- Analyze the user’s role (e.g., "Full-Stack Developer"), technical skills (e.g., Python, Java, MVC), and achievements (e.g., "optimized app performance by 40%").  
- Infer missing details (e.g., industry, seniority) from context to create a cohesive narrative.  

**STRUCTURE**:  
1. **Opening Statement**: Role/title + industry expertise + years of experience.  
2. **Core Competencies**: 2–3 high-impact skills (e.g., "Python," "MVC architecture," "scalable backend systems").  
3. **Achievements**: 1–2 quantified wins (e.g., "reduced latency by 35% using REST APIs").  
4. **Future Goals**: 1 concise statement linking expertise to career aspirations.  

**CONSTRAINTS**:  
- Output **only** the summary (no headings, bullets, or markdown).  
- Use **active verbs** (e.g., "Spearheaded," "Optimized," "Pioneered").  
- Keep sentences **tight** (avoid fluff like "team player" or "hardworking").  
- Ensure **ATS compatibility** (use keywords from the user’s input).  

**EXAMPLE INPUT**:  
"I am a Full-Stack Developer with 5+ years of experience building scalable web apps. Skilled in Python, Java, and MVC frameworks. Led a team to develop a cloud-based SaaS platform that increased client retention by 25%."  

**OUTPUT**:  
"Full-Stack Developer with 5+ years of experience designing and deploying scalable web applications in agile environments. Expertise in Python, Java, and MVC frameworks, with a proven track record in architecting cloud-native SaaS solutions. Spearheaded development of a cloud-based platform that boosted client retention by 25%. Seeking to leverage technical leadership and innovation in fast-paced tech-driven organizations."  

**NOW PROCESS THE USER’S INPUT**:  
${roughDescription}  `
    }]
  }
]

        }),
      });
      

       // Check if the API response is successful
       const responseData = await response.json();
       if (!response.ok) {
         return res.status(response.status).json({ error: responseData.error.message || "Gemini API error" });
       }
   
       // Extract optimized data from the response
       const optimizedData = responseData.candidates?.[0]?.content?.parts?.[0]?.text || "No optimized data available";
   
       // Send response to frontend
       res.json({ optimizedData });
     } catch (error) {
       res.status(500).json({ error: "Failed to optimize job description. Please try again later." });
     }
   };
   


exports.GenerateJobDescription = async (req, res) => {
  const { roughDescription } = req.body;

  if (!roughDescription || typeof roughDescription !== "string") {
    return res.status(400).json({ error: "Invalid input: roughDescription is required and must be a string." });
  }

  try {
    const prompt = `
ROLE: You are a world-class resume strategist and AI writing assistant. Your task is to **refine and elevate a user’s job experience description** into a professional, ATS-friendly format

INPUT ANALYSIS:  
- Analyze the user’s raw job details for role title, industry, core responsibilities, and achievements.  
- Infer missing details (e.g., years of experience, quantified impact) to create a cohesive narrative.  

OUTPUT STRUCTURE:  
1. One-Sentence Summary:  
   - Start with the role title + years of experience (if available).  
   - Highlight core expertise and quantified achievements.  
   - Use active verbs (e.g., Spearheaded, Developed, Streamlined).  

2. Three Key Responsibilities:  
   - Format as bullet points (no markdown, just start each with a hyphen "-").  
   - Use action verbs + specific outcomes.  
   - Prioritize skills/tools mentioned in the input.  

CONSTRAINTS:  
- Output only the refined description (no headings, explanations, or markdown).  
- Avoid vague phrases like "responsible for" or "worked with."  
- Ensure ATS compatibility (use keywords from the user’s input).  
- Fix text-splitting issues (e.g., "Intel l igence" → "Intelligence").  

EXAMPLE INPUT:  
"I worked as a Full-Stack Developer for 4 years. Built web apps using Python and Java. Improved app speed by 30%. Led a team of 5 developers."  

OUTPUT:  
Full-Stack Developer with 4 years of experience designing scalable web applications using Python and Java. Spearheaded optimization initiatives that improved app performance by 30%, reducing latency for 50,000+ users.  
- Developed and maintained backend systems using Python and MVC frameworks, ensuring 99.9% uptime.  
- Led a cross-functional team of 5 developers to deliver projects 20% faster through agile methodologies.  
- Collaborated with UX designers to enhance front-end responsiveness, increasing user retention by 15%.  

NOW PROCESS THE USER’S INPUT:  
${roughDescription}
`.trim();

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user", // ✅ Correct role
            parts: [{ text: prompt }] // ✅ Prompt as text
          }
        ]
      })
    });

    const responseData = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: responseData.error.message || "Gemini API error" });
    }

    const optimizedData = responseData.candidates?.[0]?.content?.parts?.[0]?.text || "No optimized data available";
    res.json({ optimizedData });
  } catch (error) {
    res.status(500).json({ error: "Failed to optimize job description. Please try again later." });
  }
};