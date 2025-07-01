import { GoogleGenAI } from "@google/genai";
import { resultGeneratedPrompt } from "../utils/prompt.util.js";

import dotenv from "dotenv";
dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not defined in environment variables");
  throw new Error("GEMINI_API_KEY is required");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Description: Generate website cybersecurity result from AI
// Route: POST /api/ai/generate/website/security
// Access: Public
export const generateSecurity = async (req, res) => {
  try {
    const { website } = req.body;

    if (!website) {
      return res.status(400).json({ message: "website url is required" });
    }

    const prompt = resultGeneratedPrompt(website);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    // Extract the raw text 
    const rawText = response.candidates[0].content.parts[0].text;

    // Use regex to extract the JSON inside the triple backticks ```json ... ```
    const match = rawText.match(/```json\s*([\s\S]*?)```/);
    if (!match) {
      // If no JSON block found, return entire raw text or error
      return res.status(400).json({ message: "Could not extract JSON from AI response" });
    }

    // Parse the extracted JSON string
    const jsonStr = match[1];
    const jsonData = JSON.parse(jsonStr);

    // Return the parsed JSON only
    res.status(200).json(jsonData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

