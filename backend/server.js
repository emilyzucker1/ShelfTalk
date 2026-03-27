import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
dotenv.config();

console.log("Starting server…");
const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/generatePrompt", async (req, res) => {
  try {
    const { book } = req.body;

    if (!book) {
      return res.status(400).json({ error: "Book title is required" });
    }

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a short, one-sentence journaling prompt inspired by the book "${book}".
        Keep it under 80 characters.
        Do NOT include explanations, introductions, or extra text.
        Return ONLY the prompt no introduction like 'here's the prompt' also dont uses any special characters except for ones necessary for proper grammar`,
    });

    const text =
      result?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No prompt generated";

    res.json({ prompt: text });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate prompt" });
  }
});


app.listen(3000, () => console.log("Backend running on port 3000"));