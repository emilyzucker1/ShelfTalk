import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();

const ai = new GoogleGenerativeAI(process.env.GOOGLE_CLOUD_API_KEY);

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.post("/analyzeBookImage", async (req, res) => {
  try {
    const { image, mimeType } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    const imageBuffer = Buffer.from(image, "base64");

    const model = ai.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // Step 1 — Identify book title
    const visionResponse = await model.generateContent([
      {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType: mimeType || "image/jpeg",
        },
      },
      `Identify the book in this image. 
       Return ONLY the exact book title. 
       If no book is visible, return "NONE".`
    ]);

    let bookTitle = visionResponse.response.text().trim();

    if (bookTitle === "NONE") {
      return res.json({
        book: null,
        prompt: null,
        error: "NO_BOOK_FOUND",
      });
    }

    // Clean title
    bookTitle = bookTitle
      .replace(/by .*/i, "")
      .replace(/[^a-zA-Z0-9 ':-]/g, "")
      .split(",")[0]
      .trim();

    // Step 2 — Generate journaling prompt
    const promptResponse = await model.generateContent([
      `Generate a short, one-sentence journaling prompt inspired by the book "${bookTitle}". 
       Keep it under 80 characters. 
       Return ONLY the prompt.`
    ]);

    const prompt = promptResponse.response.text().trim();

    res.json({
      book: bookTitle,
      prompt,
    });

  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: err.message || "Failed to analyze image" });
  }
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