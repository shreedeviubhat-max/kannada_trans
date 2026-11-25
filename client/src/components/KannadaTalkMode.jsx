import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  MessageCircle,
  HelpCircle,
  Check,
  Copy
} from "lucide-react";

const STARTER_TOPICS = [
  {
    label: "ಪರಿಚಯ ಮಾಡಿಕೊಳ್ಳಿ (Introduce Yourself)",
    prompt: "ನಮಸ್ಕಾರ! ನನ್ನ ಹೆಸರು ನೀವು. ನಾನು ನಿಮ್ಮೊಂದಿಗೆ ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಲು ಬಯಸುತ್ತೇನೆ. (Hello! I want to introduce myself in Kannada)",
  },
  {
    label: "ಆಟೋ ಅಥವಾ ಮಾರುಕಟ್ಟೆ (Auto / Market)",
    prompt: "ಆಟೋ ಚಾಲಕರೊಂದಿಗೆ ಎಲ್ಲಿಗೆ ಹೋಗಬೇಕು, ಬಾಡಿಗೆ ಎಷ್ಟು ಎಂದು ಹೇಗೆ ಕೇಳಬೇಕು? ಸಂಭಾಷಣೆ ಆರಂಭಿಸಿ. (Start an auto ride dialogue)",
  },
  {
    label: "ಹೋಟೆಲ್‌ನಲ್ಲಿ ಊಟ (Ordering Food)",
    prompt: "ಹೋಟೆಲ್‌ನಲ್ಲಿ ಮಸಾಲೆ ದೋಸೆ ಮತ್ತು ಫಿಲ್ಟರ್ ಕಾಫಿ ಆರ್ಡರ್ ಮಾಡಲು ಸಂಭಾಷಣೆ ಆರಂಭಿಸಿ. (Let's order food in Kannada)",
  },
  {
    label: "ಹವಾಮಾನ & ದಿನಚರಿ (Weather & Routine)",
    prompt: "ಇಂದಿನ ಹವಾಮಾನ ಮತ್ತು ನಿಮ್ಮ ದಿನಚರಿ ಬಗ್ಗೆ ಕನ್ನಡದಲ್ಲಿ ನನ್ನೊಂದಿಗೆ ಮಾತನಾಡಿ. (Chat about weather & day)",
  },
];

export default function KannadaTalkMode({ onBackToHome }) {
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: `**ನಮಸ್ಕಾರ ಗೆಳೆಯರೇ!** 🙏 (*Namaskāra geḷeyarē!* - "Hello my friend!")

ನಾನು ನಿಮ್ಮ **ಕನ್ನಡ ಮಾತುಕತೆ ಸ್ನೇಹಿತ** (Your Spoken Kannada Partner). 

ಇಲ್ಲಿ ನಾವು ಕನ್ನಡದಲ್ಲೇ ಸರಳವಾಗಿ ಮಾತನಾಡೋಣ!
- ನೀವು ಕನ್ನಡದಲ್ಲಿ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಮಾತನಾಡಬಹುದು ಅಥವಾ ಟೈಪ್ ಮಾಡಬಹುದು.
- ನಾನು ನಿಮಗೆ ಕನ್ನಡದಲ್ಲೇ ಉತ್ತರಿಸಿ, ಜತೆಗೆ ಸರಳ ಉಚ್ಚಾರಣೆ (transliteration) ಮತ್ತು ಅರ್ಥವನ್ನು ಹೇಳಿಕೊಡುತ್ತೇನೆ.
- ಯಾವುದೇ ತಪ್ಪುಗಳಿದ್ದರೂ ನಾನು ಸ್ನೇಹದಿಂದ ಸರಿಪಡಿಸುತ್ತೇನೆ.

**ಹಾಗಾದರೆ, ಇವತ್ತು ನಿಮ್ಮ ದಿನ ಹೇಗಿತ್ತು? ನೀವು ಏನು ಮಾಡುತ್ತಿದ್ದೀರಿ?**
*(Hāgādare, ivattu nimma dina hēgittu? Nīvu ēnu māḍuttiddīri? — So, how was your day today? What are you up to?)*`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Voice speech-to-text configured for Kannada
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "kn-IN";

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome/Edge.");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const playPronunciation = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`~>]/g, "").trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "kn-IN";
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend = input) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    const userMessage = {
      role: "user",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const historyPayload = messages
        .filter((_, idx) => idx > 0)
        .map((m) => ({ role: m.role, text: m.text }));

      // Prompt instructs the AI to converse in spoken Kannada
      const conversationPrompt = `[Kannada Talk Mode]: The user is practicing spoken Kannada. Reply naturally in conversational Kannada, provide Romanized transliteration and a brief English meaning, correct any language mistakes gently, and ask an engaging question to keep the chat going. User says: "${trimmed}"`;

      const apiBase = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${apiBase}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: conversationPrompt,
          history: historyPayload,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to receive response.");

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: `⚠️ **ದೋಷ (Error):** ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#000000",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "960px",
        margin: "0 auto",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      {/* Top Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "14px",
          borderBottom: "1px solid #1f1f23",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={onBackToHome}
            style={{
              background: "#18181b",
              border: "1px solid #27272a",
              color: "#d4d4d8",
              padding: "8px 12px",
              borderRadius: "10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.85rem",
            }}
          >
            <ArrowLeft size={16} />
            <span>ಹಿಂದೆ (Home)</span>
          </button>

          <div>
            <h1 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#ffffff" }}>
              ಕನ್ನಡ ಟಾಕ್ (Kannada Talk)
            </h1>
            <p style={{ fontSize: "0.76rem", color: "#facc15" }}>
              Practice Spoken Kannada with AI • Conversational Peer Tutor
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          title="Restart Conversation"
          style={{
            background: "#18181b",
            border: "1px solid #27272a",
            color: "#a1a1aa",
            padding: "8px",
            borderRadius: "50%",
            cursor: "pointer",
          }}
        >
          <RotateCcw size={16} />
        </button>
      </header>

      {/* Starter Topic Chips */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "8px",
          marginBottom: "8px",
        }}
      >
        {STARTER_TOPICS.map((topic, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(topic.prompt)}
            disabled={loading}
            style={{
              background: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: "20px",
              padding: "6px 14px",
              fontSize: "0.82rem",
              color: "#fef08a",
              whiteSpace: "nowrap",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <MessageCircle size={14} color="#facc15" />
            <span>{topic.label}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "8px 4px",
        }}
      >
        {messages.map((msg, idx) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={idx}
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
                  flexDirection: isUser ? "row-reverse" : "row",
                  alignItems: "flex-start",
                  gap: "10px",
                  maxWidth: isUser ? "85%" : "92%",
                }}
              >
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "bold",
                    flexShrink: 0,
                    marginTop: "4px",
                    background: isUser ? "#eab308" : "#2563eb",
                    color: "#ffffff",
                  }}
                >
                  {isUser ? "ನೀವು" : "ಮಾತು"}
                </div>

                <div
                  style={{
                    background: isUser ? "#18181b" : "#0f172a",
                    border: isUser ? "1px solid #3f3f46" : "1px solid #1e293b",
                    padding: "14px 18px",
                    borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                    color: "#ffffff",
                  }}
                >
                  <div className="prose-dark">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: "10px",
                      marginTop: "8px",
                      fontSize: "0.72rem",
                      color: "#64748b",
                    }}
                  >
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => playPronunciation(msg.text)}
                        title="Listen to Spoken Kannada"
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "#facc15",
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        <Volume2 size={13} />
                        <span>ಧ್ವನಿ ಆಲಿಸಿ</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "#2563eb",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
              }}
            >
              ಮಾತು
            </div>
            <div
              style={{
                background: "#18181b",
                border: "1px solid #27272a",
                padding: "8px 16px",
                borderRadius: "16px",
                fontSize: "0.85rem",
                color: "#60a5fa",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>ಕನ್ನಡದಲ್ಲಿ ಯೋಚಿಸುತ್ತಿದೆ...</span>
              <Sparkles size={14} color="#60a5fa" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div
        style={{
          marginTop: "10px",
          background: "#121215",
          border: "1px solid #27272a",
          borderRadius: "24px",
          padding: "8px 14px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <button
          type="button"
          onClick={toggleRecording}
          title={isRecording ? "Stop voice recording" : "Speak in Kannada"}
          className={isRecording ? "mic-recording" : ""}
          style={{
            background: isRecording ? "#ef4444" : "#1f1f23",
            border: "1px solid #3f3f46",
            color: isRecording ? "#ffffff" : "#facc15",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ (Talk in Kannada)..."
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#ffffff",
            fontSize: "0.95rem",
            padding: "6px 2px",
            resize: "none",
            fontFamily: "inherit",
          }}
        />

        <button
          type="button"
          onClick={() => handleSendMessage()}
          disabled={loading || !input.trim()}
          style={{
            background: !loading && input.trim() ? "#2563eb" : "#27272a",
            color: !loading && input.trim() ? "#ffffff" : "#71717a",
            border: "none",
            borderRadius: "50%",
            width: "38px",
            height: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: !loading && input.trim() ? "pointer" : "not-allowed",
            flexShrink: 0,
          }}
        >
          <Send size={17} />
        </button>
      </div>
    </div>
  );
}
