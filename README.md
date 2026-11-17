# ಕಲಿ ಕನ್ನಡ, ನಲಿ ಕನ್ನಡದಿ (Kali Kannada) 🌺

An expert, friendly, and culturally grounded AI companion dedicated to helping users learn, translate, and interact with the Kannada language.

Built with **Google Gemini**, **Node.js/Express (Vercel Serverless)**, and **React + Vite**.

---

## 🌟 Core Features

1. **Bilingual Translation (Kannada ⇄ English):**
   - High-fidelity natural translations.
   - Every Kannada response includes **Kannada script**, **Romanized transliteration (IAST)**, and **English translation**.
   - Contextual and cultural nuance explanations for idioms and proverbs (*ಗಾದೆ ಮಾತುಗಳು*).

2. **Interactive Kannada Learning:**
   - Sentence structure breakdowns (SOV vs SVO).
   - Verb conjugations and case suffixes (*ವಿಭಕ್ತಿ ಪ್ರತ್ಯಯಗಳು - Vibhakti Pratyayagalu*).
   - Everyday conversational phrases for shopping, auto rickshaws, and greetings.

3. **Kannada Language Games:**
   - **ಪದ ಜೋಡಣೆ (Word Unscramble):** Solve jumbled letters to test vocabulary.
   - **ಗಾದೆ ಮಾತು (Guess the Proverb / Idiom):** Discover traditional wisdom.
   - **ಖಾಲಿ ಜಾಗ ತುಂಬಿ (Fill in the Blanks):** Interactive grammar practice with dynamic scoring and confetti celebration!

4. **Multimodal Inputs (Images & Voice):**
   - **Image OCR & Translation:** Upload street signboards, restaurant menus, book pages, or newspaper clippings for instant transcription and explanation.
   - **Voice Input:** Built-in Speech-to-Text with one-click toggling between Kannada (`kn-IN`) and English (`en-IN`).
   - **Text-to-Speech:** Listen to spoken pronunciation directly in the chat.

---

## 📁 Project Structure

```text
kali-kannada/
├── api/
│   └── index.js              # Express backend entry point for Vercel serverless
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── ChatInterface.jsx   # Interactive chat, voice & image component
│   │   ├── App.jsx
│   │   └── main.jsx
│   │   └── index.css         # Karnataka-themed responsive styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js        # Vite build & development proxy setup
├── .env.example              # Environment variables template
├── .gitignore
├── package.json              # Root package.json for build orchestration & backend
├── vercel.json               # Serverless routing configuration for Vercel
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js (v18+)
- A Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### 2. Setup Environment
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Add your Gemini API Key in `.env`:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=5000
GEMINI_MODEL=gemini-2.5-flash
```

### 3. Install Dependencies
```bash
npm run install:all
```

### 4. Run Development Servers
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## ☁️ Deploy to Vercel

1. Push this repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. In **Settings -> Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Gemini API key
   - `GEMINI_MODEL`: `gemini-2.5-flash`
4. Deploy!

---

## 📜 License
MIT License • "ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ"
