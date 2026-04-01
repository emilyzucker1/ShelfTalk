import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
dotenv.config();

console.log("Starting server…");
const app = express();
const upload=multer({storage:multer.memoryStorage()});
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
app.post("/analyzeBookImage", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const imageBytes = req.file.buffer;

    //Identify book title
    const visionResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        `Identify if there is a book cover in the image. 
         Return ONLY the exact book title with no punctuation, no quotes, no extra words. 
         If no book cover is visible, return "NONE".`,
        {
          inlineData: {
            data: imageBytes.toString("base64"),
            mimeType: req.file.mimetype,
          },
        },
      ],
    });

    let bookTitle =
      visionResponse?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "NONE";

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

    //Generate journaling prompt if possible
    const promptResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a short, one-sentence journaling prompt inspired by the book "${bookTitle}". Keep it under 80 characters. Return ONLY the prompt.`,
    });

    const prompt =
      promptResponse?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No prompt generated";

    res.json({
      book: bookTitle,
      prompt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze image" });
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