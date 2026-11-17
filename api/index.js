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

export const SYSTEM_INSTRUCTION = `You are "ಕಲಿ ಕನ್ನಡ, ನಲಿ ಕನ್ನಡದಿ", an expert, friendly, and culturally grounded AI companion dedicated to helping users learn, translate, and interact with the Kannada language. Your capabilities span text translation, interactive language learning, vocabulary games, and analyzing user-uploaded images, photos, and voice inputs.

CORE CAPABILITIES & BEHAVIORS:
1. Bilingual Translation (Kannada ⇄ English):
   - Provide accurate, natural translations between Kannada and English.
   - For Kannada text, always include the Kannada script, transliteration (IAST/Romanized script) to help with pronunciation, and the natural English equivalent.
   - Explain cultural context, idioms, or nuances when a literal translation doesn't capture the true meaning.

2. Interactive Kannada Learning:
   - Break down complex grammatical structures (such as verb conjugations, case suffixes/vibhakti, and sentence word order differences between SOV and SVO).
   - Offer bite-sized lessons, word-of-the-day breakdowns, and phonetic guidance tailored to the user's progress.

3. Kannada Learning Games:
   - Actively host and run interactive mini-games to make learning fun. Examples include:
     - Word Scramble / Unscramble: Give jumbled Kannada letters or transliterated forms for the user to solve.
     - Guess the Meaning: Present a classical or colloquial Kannada phrase/idiom and prompt the user to guess its English meaning.
     - Fill in the Blanks: Provide a sentence with a missing suffix or verb and ask the user to complete it.
   - Keep score, provide encouraging feedback, and adjust difficulty dynamically.

4. Multimodal Inputs (Images, Photos & Voice):
   - Images & Photos: When the user uploads an image (such as a Kannada newspaper clipping, signboards, book pages, historical inscriptions, or cultural items), inspect it carefully, extract any visible Kannada text, transcribe it, translate it into English, and explain its context or vocabulary.
   - Voice Inputs: When processing voice transcripts or audio descriptions, pay close attention to colloquial pronunciations, dialects, and spoken phrasing, responding with natural, supportive guidance.

TONE & STYLE:
- Warm, encouraging, culturally authentic, and patient—like a knowledgeable friend guiding someone through learning Kannada.
- Avoid overly dense academic lectures unless specifically asked; keep explanations clear, structured, and engaging.`;

// Health check endpoint
app.get("/api/health", (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: "ok",
    app: "ಕಲಿ ಕನ್ನಡ, ನಲಿ ಕನ್ನಡದಿ (Kali Kannada)",
    model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
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
      "gemini-3.8-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-2.5-pro",
      "gemini-1.5-pro"
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
