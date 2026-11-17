import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import confetti from "canvas-confetti";
import {
  Send,
  Mic,
  MicOff,
  Image as ImageIcon,
  Volume2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Trophy,
  BookOpen,
  Gamepad2,
  Languages,
  X,
  AlertCircle
} from "lucide-react";

const QUICK_PROMPTS = [
  {
    icon: Gamepad2,
    label: "ಪದ ಜೋಡಣೆ (Word Scramble)",
    prompt: "ನನಗೆ ಒಂದು ಕನ್ನಡ ಪದ ಜೋಡಣೆ (Word Unscramble) ಆಟ ಕೊಡಿ. Jumbled letters ಕೊಟ್ಟು ನನ್ನನ್ನು ಬಿಡಿಸಲು ಹೇಳಿ!",
  },
  {
    icon: Sparkles,
    label: "ಇಂದಿನ ಪದ (Word of the Day)",
    prompt: "ಇಂದಿನ ಕನ್ನಡ ಪದ ತಿಳಿಸಿ (Word of the Day). ಕನ್ನಡ ಲಿಪಿ, transliteration, ಅರ್ಥ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಮಹತ್ವ ನೀಡಿ.",
  },
  {
    icon: BookOpen,
    label: "ಗಾದೆ ಮಾತು (Guess the Proverb)",
    prompt: "ಒಂದು ಜನಪ್ರಿಯ ಕನ್ನಡ ಗಾದೆ ಮಾತು ಕೊಟ್ಟು (Guess the Proverb), ಅದರ ಅರ್ಥವನ್ನು ನಾನು ಊಹಿಸಲು ಒಂದು ಆಟ ಆಡಿಸಿ!",
  },
  {
    icon: Languages,
    label: "ದೈನಂದಿನ ಸಂಭಾಷಣೆ (Daily Phrases)",
    prompt: "ಬೆಂಗಳೂರಿನಲ್ಲಿ ಆಟೋ ಚಾಲಕರೊಂದಿಗೆ ಅಥವಾ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಮಾತನಾಡಲು 5 ಪ್ರಮುಖ ಕನ್ನಡ ವಾಕ್ಯಗಳನ್ನು transliteration ಜೊತೆ ಕಲಿಸಿ.",
  },
];

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: `**ನಮಸ್ಕಾರ! ಸುಸ್ವಾಗತ!** 🙏 (*Namaskāra! Susvāgata!* - "Hello and welcome!")

ನಾನು ನಿಮ್ಮ **"ಕಲಿ ಕನ್ನಡ, ನಲಿ ಕನ್ನಡದಿ"** (*Kali Kannaḍa, Nali Kannaḍadi*). 

I am your friendly AI companion for learning, exploring, and translating Kannada.
- 🔄 **Bilingual Translation:** Kannada ⇄ English with script, transliteration & context.
- 📚 **Interactive Learning:** Grammar, verb conjugations & vibhakti case endings.
- 🎮 **Learning Games:** Word scrambles, guess the proverb & quizzes.
- 📸 **Signboards & Images:** Upload a photo of Kannada text for instant reading & translation.

*ಹಾಗಾದರೆ, ಇವತ್ತು ಏನು ಕಲಿಯೋಣ?* (What shall we learn today?)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // { data: base64, preview: url, name: string, mimeType: string }
  const [isRecording, setIsRecording] = useState(false);
  const [voiceLang, setVoiceLang] = useState("kn-IN"); // 'kn-IN' or 'en-IN'
  const [score, setScore] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [errorBanner, setErrorBanner] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Check backend health on mount
  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (!data.hasApiKey) {
          setErrorBanner("GEMINI_API_KEY is not configured yet. Add it to your .env file or Vercel environment variables.");
        }
      })
      .catch(() => {
        // Local server might not be running yet or path differs
      });
  }, []);

  // Initialize Web Speech API for voice input
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = voiceLang;

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = (e) => {
        console.error("Speech recognition error:", e);
        setIsRecording(false);
      };
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognitionRef.current = recognition;
    }
  }, [voiceLang]);

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.lang = voiceLang;
      recognitionRef.current.start();
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage({
        data: reader.result,
        preview: URL.createObjectURL(file),
        name: file.name,
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const playPronunciation = (text) => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown symbols to read cleanly
    const cleanText = text
      .replace(/[*#_`~>]/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "kn-IN"; // Try Kannada voice
    utterance.rate = 0.9; // Slightly slower for language learners

    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSendMessage = async (textToSend = input) => {
    const trimmed = textToSend.trim();
    if (!trimmed && !selectedImage) return;

    const userMessage = {
      role: "user",
      text: trimmed,
      imagePreview: selectedImage?.preview,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentImage = selectedImage;
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setLoading(true);
    setErrorBanner(null);

    try {
      // Build conversation history for API (excluding the greeting to keep token usage clean)
      const historyPayload = messages
        .filter((m, idx) => idx > 0)
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: historyPayload,
          image: currentImage ? { data: currentImage.data, mimeType: currentImage.mimeType } : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to receive response from server.");
      }

      const botReply = data.reply;

      // Celebrate if positive praise / game victory is detected
      if (
        botReply.toLowerCase().includes("correct") ||
        botReply.includes("ಸರಿ") ||
        botReply.includes("ಅದ್ಭುತ") ||
        botReply.includes("ಶಾಬಾಶ್") ||
        botReply.includes("ಉತ್ತಮ")
      ) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#b91c1c", "#f59e0b", "#10b981"],
        });
        setScore((s) => s + 10);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setErrorBanner(err.message);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: `⚠️ **ದೋಷ (Error):** ${err.message}\n\nPlease check your server configuration and Gemini API Key.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    if (window.confirm("ಹೊಸ ಸಂಭಾಷಣೆ ಆರಂಭಿಸಬೇಕೇ? (Start a fresh new conversation?)")) {
      setMessages([
        {
          role: "model",
          text: `**ನಮಸ್ಕಾರ!** ನಾನು ನಿಮ್ಮ **"ಕಲಿ ಕನ್ನಡ, ನಲಿ ಕನ್ನಡದಿ"**.\n\nಹೊಸ ಸಂಭಾಷಣೆಗೆ ಸ್ವಾಗತ! Let's continue learning, translating, or playing a fun Kannada word game!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setScore(0);
      setErrorBanner(null);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", maxWidth: "1050px", margin: "0 auto", padding: "12px", width: "100%" }}>
      {/* Top Header Card */}
      <header
        style={{
          background: "linear-gradient(90deg, #991b1b 0%, #b91c1c 60%, #d97706 100%)",
          color: "white",
          borderRadius: "16px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 15px rgba(185, 28, 28, 0.2)",
          marginBottom: "12px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "#fef3c7",
              color: "#b91c1c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            🌺
          </div>
          <div>
            <h1 style={{ fontSize: "1.28rem", fontWeight: "800", letterSpacing: "0.2px", lineHeight: "1.2" }}>
              ಕಲಿ ಕನ್ನಡ, ನಲಿ ಕನ್ನಡದಿ
            </h1>
            <p style={{ fontSize: "0.82rem", opacity: 0.92, marginTop: "2px" }}>
              Kali Kannada AI Companion • Learn, Translate & Play
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Game Score Pill */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(4px)",
              padding: "6px 14px",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.86rem",
              fontWeight: "600",
            }}
          >
            <Trophy size={16} color="#fef08a" />
            <span>ಅಂಕಗಳು (Score): {score}</span>
          </div>

          {/* Reset Chat Button */}
          <button
            onClick={resetChat}
            title="Reset conversation"
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              color: "white",
              padding: "8px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
          >
            <RotateCcw size={17} />
          </button>
        </div>
      </header>

      {/* Error / Notification Banner if API key is missing */}
      {errorBanner && (
        <div
          style={{
            background: "#fee2e2",
            border: "1px solid #f87171",
            color: "#991b1b",
            padding: "10px 14px",
            borderRadius: "10px",
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "10px",
          }}
        >
          <AlertCircle size={18} />
          <span style={{ flex: 1 }}>{errorBanner}</span>
          <button
            onClick={() => setErrorBanner(null)}
            style={{ background: "transparent", border: "none", color: "#991b1b", cursor: "pointer" }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Quick Action Suggestion Chips */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "8px",
          marginBottom: "6px",
        }}
      >
        {QUICK_PROMPTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.prompt)}
              disabled={loading}
              style={{
                background: "#ffffff",
                border: "1px solid #fed7aa",
                borderRadius: "20px",
                padding: "6px 12px",
                fontSize: "0.82rem",
                color: "#78350f",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                cursor: loading ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#fff7ed";
                e.currentTarget.style.borderColor = "#f97316";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.borderColor = "#fed7aa";
              }}
            >
              <Icon size={14} color="#ea580c" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Messages Container */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(6px)",
          borderRadius: "16px",
          padding: "16px",
          boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.02)",
          border: "1px solid #f3e8d2",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isUser ? "flex-end" : "flex-start",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                  maxWidth: isUser ? "85%" : "92%",
                  flexDirection: isUser ? "row-reverse" : "row",
                }}
              >
                {/* Avatar Icon */}
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    flexShrink: 0,
                    marginTop: "4px",
                    background: isUser
                      ? "linear-gradient(135deg, #f59e0b, #d97706)"
                      : "linear-gradient(135deg, #b91c1c, #991b1b)",
                    color: "white",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  }}
                >
                  {isUser ? "ನೀವು" : "ಕಲಿ"}
                </div>

                {/* Message Bubble */}
                <div
                  style={{
                    background: isUser ? "#fef3c7" : "#ffffff",
                    border: isUser ? "1px solid #fde68a" : "1px solid #f1f5f9",
                    padding: "12px 16px",
                    borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                    boxShadow: isUser
                      ? "0 2px 6px rgba(217, 119, 6, 0.08)"
                      : "0 2px 10px rgba(0, 0, 0, 0.04)",
                    color: "#1f2937",
                  }}
                >
                  {/* Attached user image thumbnail if present */}
                  {msg.imagePreview && (
                    <div style={{ marginBottom: "8px" }}>
                      <img
                        src={msg.imagePreview}
                        alt="Uploaded preview"
                        style={{
                          maxHeight: "180px",
                          maxWidth: "100%",
                          borderRadius: "8px",
                          border: "1px solid #e5e7eb",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  )}

                  {/* Message Markdown Body */}
                  <div className="prose-kannada">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>

                  {/* Bottom Message Actions (Audio pronunciation, Copy, Timestamp) */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: "10px",
                      marginTop: "8px",
                      paddingTop: "4px",
                      borderTop: "1px dashed rgba(0,0,0,0.06)",
                      fontSize: "0.74rem",
                      color: "#9ca3af",
                    }}
                  >
                    <span>{msg.timestamp}</span>

                    {!isUser && (
                      <button
                        onClick={() => playPronunciation(msg.text)}
                        title="ಉಚ್ಚಾರಣೆ ಆಲಿಸಿ (Listen to pronunciation)"
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "#b45309",
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                          padding: "2px 4px",
                          borderRadius: "4px",
                        }}
                      >
                        <Volume2 size={13} />
                        <span>ಆಲಿಸಿ</span>
                      </button>
                    )}

                    <button
                      onClick={() => copyToClipboard(msg.text, index)}
                      title="ಪಠ್ಯ ನಕಲಿಸಿ (Copy text)"
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: copiedIndex === index ? "#10b981" : "#9ca3af",
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",
                      }}
                    >
                      {copiedIndex === index ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Spinner / Thinking state */}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#b91c1c",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
              }}
            >
              ಕಲಿ
            </div>
            <div
              style={{
                background: "#ffffff",
                padding: "10px 16px",
                borderRadius: "4px 14px 14px 14px",
                border: "1px solid #fee2e2",
                color: "#991b1b",
                fontSize: "0.88rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span className="kannada-text">ಕಲಿ ಕನ್ನಡ ಯೋಚಿಸುತ್ತಿದೆ...</span>
              <span style={{ fontSize: "1.1rem", animation: "pulse 1s infinite" }}>✨</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Selected Image Thumbnail preview bar before sending */}
      {selectedImage && (
        <div
          style={{
            marginTop: "8px",
            background: "#ffffff",
            border: "1px solid #fcd34d",
            borderRadius: "10px",
            padding: "8px 12px",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            alignSelf: "flex-start",
          }}
        >
          <img
            src={selectedImage.preview}
            alt="Preview"
            style={{ width: "42px", height: "42px", borderRadius: "6px", objectFit: "cover" }}
          />
          <div style={{ fontSize: "0.82rem" }}>
            <span style={{ fontWeight: 600, color: "#92400e" }}>{selectedImage.name}</span>
            <span style={{ display: "block", color: "#6b7280", fontSize: "0.74rem" }}>
              Ready for OCR & translation analysis
            </span>
          </div>
          <button
            onClick={removeSelectedImage}
            style={{
              background: "#fee2e2",
              border: "none",
              borderRadius: "50%",
              width: "22px",
              height: "22px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#b91c1c",
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Bottom Input Area */}
      <div
        style={{
          marginTop: "10px",
          background: "#ffffff",
          borderRadius: "18px",
          padding: "8px 12px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
          border: "1px solid #fde68a",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {/* Hidden File Input for images */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/*"
          style={{ display: "none" }}
        />

        {/* Image Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ (Upload signboard, newspaper, book image)"
          style={{
            background: "#fffbeb",
            border: "1px solid #fef08a",
            color: "#b45309",
            borderRadius: "50%",
            width: "38px",
            height: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            transition: "all 0.2s",
          }}
        >
          <ImageIcon size={19} />
        </button>

        {/* Voice Language Toggle (Kannada vs English speech recognition) */}
        <button
          type="button"
          onClick={() => setVoiceLang((prev) => (prev === "kn-IN" ? "en-IN" : "kn-IN"))}
          title={`Speech Recognition Language: ${voiceLang === "kn-IN" ? "Kannada (ಕನ್ನಡ)" : "English (Indian)"}`}
          style={{
            background: "#fef3c7",
            border: "1px solid #fcd34d",
            color: "#78350f",
            borderRadius: "12px",
            padding: "4px 8px",
            fontSize: "0.75rem",
            fontWeight: 700,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {voiceLang === "kn-IN" ? "ಕನ್ನಡ" : "EN"}
        </button>

        {/* Voice Mic Record Button */}
        <button
          type="button"
          onClick={toggleVoiceRecording}
          title={isRecording ? "Stop recording voice" : "Speak your message in Kannada or English"}
          className={isRecording ? "mic-recording" : ""}
          style={{
            background: isRecording ? "#dc2626" : "#fffbeb",
            border: "1px solid #fef08a",
            color: isRecording ? "white" : "#b45309",
            borderRadius: "50%",
            width: "38px",
            height: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            transition: "all 0.2s",
          }}
        >
          {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        {/* Text Input Area */}
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="ಕನ್ನಡದಲ್ಲಿ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ... (Ask anything, translate, or play a game)"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            resize: "none",
            fontSize: "0.95rem",
            padding: "8px 4px",
            fontFamily: "inherit",
            maxHeight: "90px",
          }}
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={() => handleSendMessage()}
          disabled={loading || (!input.trim() && !selectedImage)}
          title="Send message (Enter)"
          style={{
            background: !loading && (input.trim() || selectedImage)
              ? "linear-gradient(135deg, #b91c1c, #991b1b)"
              : "#e5e7eb",
            color: !loading && (input.trim() || selectedImage) ? "white" : "#9ca3af",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: !loading && (input.trim() || selectedImage) ? "pointer" : "not-allowed",
            flexShrink: 0,
            transition: "all 0.2s",
            boxShadow: !loading && (input.trim() || selectedImage) ? "0 2px 8px rgba(185, 28, 28, 0.25)" : "none",
          }}
        >
          <Send size={18} />
        </button>
      </div>

      {/* Footer credits / cultural touch */}
      <footer
        style={{
          textAlign: "center",
          fontSize: "0.75rem",
          color: "#92400e",
          marginTop: "6px",
          opacity: 0.85,
        }}
      >
        "ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ" • Powered by Google Gemini & Vercel
      </footer>
    </div>
  );
}
