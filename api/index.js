import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));

export const SYSTEM_INSTRUCTION = `You are the core AI intelligence for "ಕಲಿ ಕನ್ನಡ, ನಲಿ ಕನ್ನಡದಿ", a specialized multimodal Kannada-English learning, translation, and grammar web application. Your objective is to help users master the Kannada language while celebrating its rich literary and cultural heritage under the core slogan: "ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ".

CORE CAPABILITIES & MODES:
1. Bilingual Translation & Pronunciation:
   - Provide natural, accurate translations between Kannada and English.
   - For all Kannada text, ALWAYS include:
     1. Authentic Kannada script (ಕನ್ನಡ ಲಿಪಿ)
     2. English phonetic transliteration in Roman script (IAST/Romanized)
     3. Natural English meaning
   - Explain cultural context, idioms, and nuances when literal translations don't capture the essence.

2. Automated Grammar Breakdown:
   - Automatically break down sentences into root words, verb conjugations, tense markers (past/present/future), and case suffixes (ವಿಭಕ್ತಿ ಪ್ರತ್ಯಯಗಳು - Vibhakti Pratyayagalu).
   - Explain Subject-Object-Verb (SOV) structure versus English SVO clearly.

3. Multimodal Analysis (Camera, Image & Document):
   - When users provide images, photos of signboards, books, or documents (PDF/text/image), extract visible Kannada text, transcribe it, translate it, and break down vocabulary and grammar.

4. Interactive Games Support:
   - Sentence Formation Game (ವಾಕ್ಯ ರಚನೆ): Present randomized Kannada words, verify user's formed sentence, provide corrections and feedback.
   - Word Finding Puzzle (ಪದ ಹುಡುಕಿ): Present letter/syllable collections or grids for finding hidden Kannada words.
   - Kannada GK Quiz (ಕರ್ನಾಟಕ ಸಾಮಾನ್ಯ ಜ್ಞಾನ): Conduct interactive trivia testing Karnataka's history, culture, geography, and literature. Keep score!

TONE & STYLE:
- Warm, encouraging, structured peer-tutor tone.
- Organize all explanations cleanly with markdown headings and bullet points.
- Honor the cultural pride and linguistic depth of Kannada in every interaction ("ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ").`;

// Health check endpoint
app.get("/api/health", (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: "ok",
    app: "ಕಲಿ ಕನ್ನಡ, ನಲಿ ಕನ್ನಡದಿ (Kali Kannada)",
    model: process.env.GEMINI_MODEL || "gemini-3.1-flash-lite",
    hasApiKey: hasKey,
    time: new Date().toISOString()
  });
});

// System prompt endpoint for transparency / UI details
app.get("/api/system-prompt", (req, res) => {
  res.json({
    name: "kali-kannada-nali-kannadadi",
    temperature: 0.7,
    instruction: SYSTEM_INSTRUCTION
  });
});

// Chat endpoint with text, history, image, and voice audio support
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [], image, audio } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "Missing GEMINI_API_KEY in environment variables. Please set it in your .env or Vercel project settings."
      });
    }

    if (!message && !image && !audio) {
      return res.status(400).json({ error: "No message, image, or audio provided." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const candidateModels = [
      process.env.GEMINI_MODEL,
      "gemini-3.1-flash-lite",
      "gemini-3.5-flash",
      "gemini-3.8-flash",
      "gemini-flash-latest"
    ].filter(Boolean);

    // Remove duplicates while keeping order
    const uniqueModels = [...new Set(candidateModels)];

    // Build the formatted history for Gemini API
    const formattedHistory = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const item of history) {
        if (!item.text) continue;
        const role = item.role === "user" ? "user" : "model";
        formattedHistory.push({
          role,
          parts: [{ text: item.text }]
        });
      }
    }

    // Build the current prompt parts
    const currentParts = [];

    // Attach image if provided (base64)
    if (image && image.data) {
      currentParts.push({
        inlineData: {
          data: image.data.replace(/^data:[^;]+;base64,/, ""),
          mimeType: image.mimeType || "image/jpeg"
        }
      });
    }

    // Attach audio if provided (base64)
    if (audio && audio.data) {
      currentParts.push({
        inlineData: {
          data: audio.data.replace(/^data:[^;]+;base64,/, ""),
          mimeType: audio.mimeType || "audio/mp3"
        }
      });
    }

    // Attach user text
    const textPrompt = message || (image ? "Please analyze this image, transcribe any Kannada text, translate it to English, and explain the context." : "Please process this voice audio input.");
    currentParts.push({ text: textPrompt });

    let replyText = "";
    let successfulModel = "";
    let lastError = null;

    // Helper for generating with a single model attempt
    const executeWithRetry = async (modelInstance) => {
      let delay = 1000;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          if (image || audio || formattedHistory.length === 0) {
            const contents = [...formattedHistory, { role: "user", parts: currentParts }];
            const result = await modelInstance.generateContent({ contents });
            const response = await result.response;
            return response.text();
          } else {
            const chat = modelInstance.startChat({ history: formattedHistory });
            const result = await chat.sendMessage(currentParts);
            const response = await result.response;
            return response.text();
          }
        } catch (err) {
          const is503or429 = err?.status === 503 || err?.message?.includes("503") || err?.status === 429 || err?.message?.includes("429");
          if (is503or429 && attempt < 2) {
            console.warn(`[kali-kannada] Temporary error (attempt ${attempt + 1}), retrying after ${delay}ms...`);
            await new Promise((r) => setTimeout(r, delay));
            delay *= 2;
          } else {
            throw err;
          }
        }
      }
    };

    // Try candidate models in order if overloaded (503 / 429)
    for (const mName of uniqueModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: mName,
          systemInstruction: SYSTEM_INSTRUCTION,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048
          }
        });

        replyText = await executeWithRetry(model);
        successfulModel = mName;
        break;
      } catch (err) {
        lastError = err;
        console.warn(`[kali-kannada] Model ${mName} failed: ${err.message}. Trying next candidate model if available...`);
      }
    }

    if (!replyText) {
      throw lastError || new Error("All candidate Gemini models failed to respond.");
    }

    return res.json({
      reply: replyText,
      model: successfulModel,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error in /api/chat:", error);

    // Provide friendly fallback explanations
    const errorMessage = error?.message || "An unexpected error occurred while communicating with Gemini.";
    return res.status(500).json({
      error: errorMessage,
      details: error.toString()
    });
  }
});

// Start local server if not running in serverless Vercel environment
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[kali-kannada] Backend server running on port ${PORT}`);
  });
}

export default app;
