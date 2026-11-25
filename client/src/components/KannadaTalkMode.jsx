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
  MessageSquare,
  Bot,
  User,
  Headphones
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

ನಾನು ನಿಮ್ಮ **ಕನ್ನಡ ಮಾತುಕತೆ ಸ್ನೇಹಿತ (AI Conversational Partner)**. 

ಇಲ್ಲಿ ನಾವು ಕನ್ನಡದಲ್ಲೇ ಮುಕ್ತವಾಗಿ, ಸರಳವಾಗಿ ಮಾತನಾಡೋಣ!
- ನೀವು ಕನ್ನಡದಲ್ಲಿ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಮಾತನಾಡಬಹುದು ಅಥವಾ ಟೈಪ್ ಮಾಡಬಹುದು.
- ನಾನು ನಿಮಗೆ ಕನ್ನಡದಲ್ಲೇ ಉತ್ತರಿಸಿ, ಜತೆಗೆ ಸರಳ ಉಚ್ಚಾರಣೆ (transliteration) ಮತ್ತು ಅರ್ಥವನ್ನು ಹೇಳಿಕೊಡುತ್ತೇನೆ.
- ಯಾವುದೇ ತಪ್ಪುಗಳಿದ್ದರೂ ನಾನು ಸ್ನೇಹದಿಂದ ಸರಿಪಡಿಸುತ್ತೇನೆ.

**ಹಾಗಾದರೆ, ಇವತ್ತು ನಿಮ್ಮ ದಿನ ಹೇಗಿತ್ತು? ನೀವು ಏನು ಮಾಡುತ್ತಿದ್ದೀರಿ?**
*(Hāgādare, ivattu nimma dina hēgittu? Nīvu ēnu māḍuttiddīri?)*`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

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
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #2e1065 100%)",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Top Header */}
      <header
        style={{
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(168, 85, 247, 0.25)",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button
            onClick={onBackToHome}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              color: "#e9d5ff",
              padding: "8px 14px",
              borderRadius: "12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.88rem",
              fontWeight: "600",
            }}
          >
            <ArrowLeft size={16} />
            <span>ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ (Dashboard)</span>
          </button>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Bot size={22} color="#c084fc" />
              <h1 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#f3e8ff", margin: 0 }}>
                ಕನ್ನಡ ಟಾಕ್ (Talk with AI)
              </h1>
            </div>
            <p style={{ fontSize: "0.78rem", color: "#c084fc", margin: "2px 0 0" }}>
              Modern Purple & Blue Theme • Conversational Peer Tutor & Voice Guidance
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          title="Restart Conversation"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(168, 85, 247, 0.3)",
            color: "#e9d5ff",
            padding: "8px",
            borderRadius: "50%",
            cursor: "pointer",
          }}
        >
          <RotateCcw size={17} />
        </button>
      </header>

      {/* Main Chat Workspace */}
      <div
        style={{
          flex: 1,
          maxWidth: "960px",
          width: "100%",
          margin: "0 auto",
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Starter Topic Badges */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            overflowX: "auto",
            paddingBottom: "10px",
            marginBottom: "12px",
          }}
        >
          {STARTER_TOPICS.map((topic, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(topic.prompt)}
              disabled={loading}
              style={{
                background: "rgba(147, 51, 234, 0.15)",
                border: "1px solid rgba(192, 132, 252, 0.35)",
                borderRadius: "9999px",
                padding: "8px 16px",
                fontSize: "0.84rem",
                color: "#e9d5ff",
                whiteSpace: "nowrap",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.18s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(147, 51, 234, 0.3)";
                e.currentTarget.style.borderColor = "#c084fc";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(147, 51, 234, 0.15)";
                e.currentTarget.style.borderColor = "rgba(192, 132, 252, 0.35)";
              }}
            >
              <MessageCircle size={15} color="#c084fc" />
              <span>{topic.label}</span>
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            paddingBottom: "16px",
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
                    gap: "12px",
                    maxWidth: isUser ? "85%" : "92%",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      fontWeight: "700",
                      flexShrink: 0,
                      marginTop: "2px",
                      background: isUser ? "linear-gradient(135deg, #7c3aed, #6d28d9)" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                      color: "#ffffff",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    }}
                  >
                    {isUser ? <User size={18} /> : <Bot size={18} />}
                  </div>

                  <div
                    style={{
                      background: isUser ? "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)" : "rgba(30, 41, 59, 0.75)",
                      border: isUser ? "none" : "1px solid rgba(168, 85, 247, 0.25)",
                      padding: "16px 20px",
                      borderRadius: isUser ? "20px 4px 20px 20px" : "4px 20px 20px 20px",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
                      backdropFilter: "blur(10px)",
                      color: "#ffffff",
                    }}
                  >
                    <div className={isUser ? "" : "prose-purple"}>
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: "12px",
                        marginTop: "10px",
                        fontSize: "0.74rem",
                        color: isUser ? "rgba(255,255,255,0.7)" : "#94a3b8",
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
                            color: "#c084fc",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontWeight: "600",
                          }}
                        >
                          <Headphones size={14} />
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
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "12px",
                  background: "#2563eb",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bot size={18} />
              </div>
              <div
                style={{
                  background: "rgba(30, 41, 59, 0.75)",
                  border: "1px solid rgba(168, 85, 247, 0.25)",
                  padding: "10px 18px",
                  borderRadius: "16px",
                  fontSize: "0.9rem",
                  color: "#c084fc",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>ಕನ್ನಡದಲ್ಲಿ ಚಿಂತಿಸುತ್ತಿದೆ... (Thinking in Kannada)</span>
                <Sparkles size={16} color="#c084fc" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div
          style={{
            background: "rgba(30, 41, 59, 0.8)",
            border: "1.5px solid rgba(168, 85, 247, 0.35)",
            borderRadius: "28px",
            padding: "8px 14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
          }}
        >
          <button
            type="button"
            onClick={toggleRecording}
            title={isRecording ? "Stop voice recording" : "Speak in Kannada"}
            className={isRecording ? "mic-recording" : ""}
            style={{
              background: isRecording ? "#ef4444" : "rgba(147, 51, 234, 0.25)",
              border: "1px solid rgba(192, 132, 252, 0.4)",
              color: isRecording ? "#ffffff" : "#c084fc",
              borderRadius: "50%",
              width: "38px",
              height: "38px",
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
            placeholder="ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ (Talk with AI in Kannada)..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#ffffff",
              fontSize: "0.98rem",
              padding: "8px 4px",
              resize: "none",
              fontFamily: "inherit",
            }}
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={loading || !input.trim()}
            style={{
              background: !loading && input.trim()
                ? "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)"
                : "rgba(255, 255, 255, 0.1)",
              color: !loading && input.trim() ? "#ffffff" : "rgba(255,255,255,0.4)",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: !loading && input.trim() ? "pointer" : "not-allowed",
              flexShrink: 0,
              boxShadow: !loading && input.trim() ? "0 4px 14px rgba(124, 58, 237, 0.4)" : "none",
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
