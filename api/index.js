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

export const SYSTEM_INSTRUCTION = `You are the core AI intelligence for "ಕಲಿ ಕನ್ನಡ, ನಲಿ ಕನ್ನಡದಿ", a specialized, lightning-fast multimodal Kannada-English learning, translation, and conversation web application under the slogan: "ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ".

CRITICAL RULES FOR RESPONSES:
1. Fast, Concise & Direct (NO long essays or huge paragraphs!):
   - Users want quick, punchy, clear answers.
   - For translation requests, strictly follow this format:
     **ನೀಡಿದ ಪಠ್ಯ (Given Text):** [User's input]
     **ಅನುವಾದ (Translation):** [Authentic Kannada script / English]
     **ಉಚ್ಚಾರಣೆ (Transliteration):** [Romanized phonetics]
     **ಸರಳ ವಿವರಣೆ (Simple Explanation):** [Max 1-2 short sentences explaining key words or cultural nuance]

2. Kannada Talk Mode (ಕನ್ನಡ ಸಂಭಾಷಣೆ - Spoken Kannada Peer Tutor):
   - When the user is having a conversation or practicing speaking Kannada, talk back to them in natural, friendly, conversational Kannada!
   - Provide the reply in Kannada script, followed by simple Romanized transliteration and a quick English guide.
   - Ask an engaging follow-up question in spoken Kannada to keep the conversation flowing.
   - Gently correct any grammar or pronunciation mistakes with warmth and encouragement.

3. Multimodal Analysis (Camera / Images / Docs):
   - Extract text concisely. State transcription, translation, and 1-2 sentence explanation.

TONE & STYLE:
- Warm, encouraging, structured peer-tutor.
- Crisp markdown with bold highlights and bullet points. Never verbose.`;

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
