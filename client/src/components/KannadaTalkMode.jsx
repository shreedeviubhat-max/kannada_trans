import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  Send,
  Mic,
  MicOff,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  MessageCircle,
  Bot,
  User,
  Headphones,
  Radio,
  Globe
} from "lucide-react";

const STARTER_TOPICS = [
  {
    label: "ಕನ್ನಡದಲ್ಲಿ ಪರಿಚಯ",
    en: "Kannada Intro",
    prompt: "ನಮಸ್ಕಾರ! ನನ್ನ ಹೆಸರು ನೀವು. ನಾನು ನಿಮ್ಮೊಂದಿಗೆ ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಲು ಬಯಸುತ್ತೇನೆ.",
  },
  {
    label: "English Chat",
    en: "Speak English",
    prompt: "Hello! Let's have a conversation in English about travel and learning languages.",
  },
  {
    label: "हिंदी में बात करें",
    en: "Hindi Chat",
    prompt: "नमस्ते! आप कैसे हैं? चलिए आज थोड़ी हिंदी में बातचीत करते हैं।",
  },
  {
    label: "Mixed / Kanglish",
    en: "Code-Switching",
    prompt: "Namaskara! How was your day? Nimage yavudu favorite place in Karnataka?",
  },
];

// Helper to determine language family from text
const detectLanguageFromText = (text) => {
  if (!text) return "kn-IN";
  // Kannada Unicode range: 0C80 - 0CFF
  const hasKannada = /[\u0C80-\u0CFF]/.test(text);
  // Devanagari (Hindi) Unicode range: 0900 - 097F
  const hasDevanagari = /[\u0900-\u097F]/.test(text);

  if (hasKannada) return "kn-IN";
  if (hasDevanagari) return "hi-IN";
  return "en-IN";
};

export default function KannadaTalkMode({ onBackToHome }) {
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: `**ನಮಸ್ಕಾರ! Welcome! नमस्ते!** 🙏

ನಾನು ನಿಮ್ಮ **Multilingual Voice Partner**. 

Speak freely in **Kannada, English, Hindi**, or mix them naturally (Kanglish):
- 🎙️ Click **"Start Hands-Free Session"** to talk without pressing any buttons.
- 🌐 The AI will automatically detect your language and reply in the same language!
- 🎧 Audio speech synthesis plays automatically in the matched accent.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLiveSessionActive, setIsLiveSessionActive] = useState(false);
  const [sessionStatus, setSessionStatus] = useState("idle"); // 'idle' | 'listening' | 'user_speaking' | 'ai_thinking' | 'ai_speaking'
  const [liveTranscript, setLiveTranscript] = useState("");
  const [activeSpeechLang, setActiveSpeechLang] = useState("kn-IN"); // 'kn-IN' | 'en-IN' | 'hi-IN'

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const isAiSpeakingRef = useRef(false);
  const isSessionActiveRef = useRef(false);
  const activeSpeechLangRef = useRef(activeSpeechLang);
  activeSpeechLangRef.current = activeSpeechLang;
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, liveTranscript]);

  // Clean markdown symbols to feed SpeechSynthesis smoothly
  const cleanMarkdownForAudio = (text) => {
    return text
      .replace(/[*#_`~>]/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .trim();
  };

  // Stop any active AI speech immediately (Barge-in / Interrupt)
  const interruptAiSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    isAiSpeakingRef.current = false;
  };

  // Dynamic voice synthesizer that matches the detected language
  const speakAiResponse = (text) => {
    if (!window.speechSynthesis) return;

    interruptAiSpeech();
    const cleanText = cleanMarkdownForAudio(text);
    if (!cleanText) return;

    const detectedLang = detectLanguageFromText(cleanText);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = detectedLang;
    utterance.rate = detectedLang === "kn-IN" ? 0.95 : 1.0;

    // Pick best available matching voice if present
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((v) => v.lang.startsWith(detectedLang.slice(0, 2)));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      isAiSpeakingRef.current = true;
      setSessionStatus("ai_speaking");
    };

    utterance.onend = () => {
      isAiSpeakingRef.current = false;
      if (isSessionActiveRef.current) {
        setSessionStatus("listening");
        try {
          recognitionRef.current?.start();
        } catch (_) {}
      } else {
        setSessionStatus("idle");
      }
    };

    utterance.onerror = () => {
      isAiSpeakingRef.current = false;
      if (isSessionActiveRef.current) {
        setSessionStatus("listening");
        try {
          recognitionRef.current?.start();
        } catch (_) {}
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  // Initialize Speech Recognition with continuous VAD & auto silence detection
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    // Set to user's selected primary listening language (defaults to kn-IN, can toggle to en-IN or hi-IN)
    recognition.lang = activeSpeechLang;

    recognition.onstart = () => {
      if (isSessionActiveRef.current && !isAiSpeakingRef.current) {
        setSessionStatus("listening");
      }
    };

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          final += item[0].transcript;
        } else {
          interim += item[0].transcript;
        }
      }

      const activeText = (final || interim).trim();

      if (activeText) {
        // User interruption: if AI is speaking, user's speech cuts off AI immediately
        if (isAiSpeakingRef.current) {
          interruptAiSpeech();
        }

        setSessionStatus("user_speaking");
        setLiveTranscript(activeText);

        // Reset silence detection timer (1.3 seconds of silence = user finished speaking)
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

        silenceTimerRef.current = setTimeout(() => {
          if (activeText && isSessionActiveRef.current) {
            handleAutoSendTurn(activeText);
          }
        }, 1300);
      }
    };

    recognition.onerror = (e) => {
      if (e.error !== "no-speech" && isSessionActiveRef.current) {
        console.warn("Speech recognition notice:", e.error);
      }
    };

    recognition.onend = () => {
      if (isSessionActiveRef.current && !isAiSpeakingRef.current) {
        try {
          recognition.start();
        } catch (_) {}
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      interruptAiSpeech();
      try {
        recognition.stop();
      } catch (_) {}
    };
  }, [activeSpeechLang]);

  // Update recognition language when user switches preference
  const handleLanguageSwitch = (langCode) => {
    setActiveSpeechLang(langCode);
    if (recognitionRef.current) {
      const wasActive = isSessionActiveRef.current;
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      recognitionRef.current.lang = langCode;
      if (wasActive) {
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch (_) {}
        }, 150);
      }
    }
  };

  // Hands-Free Auto-Send Turn when silence is detected
  const handleAutoSendTurn = async (spokenText) => {
    if (!spokenText.trim()) return;

    setLiveTranscript("");
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

    try {
      recognitionRef.current?.stop();
    } catch (_) {}

    setSessionStatus("ai_thinking");
    setLoading(true);

    const userMessage = {
      role: "user",
      text: spokenText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const historyPayload = messagesRef.current
        .filter((_, idx) => idx > 0)
        .map((m) => ({ role: m.role, text: m.text }));

      // Prompt enforcing automatic language detection without forced Kannada translation
      const conversationPrompt = `[Talk with AI Voice Session - Automatic Language Detection]:
The user said: "${spokenText}"

CRITICAL INSTRUCTIONS:
1. Automatically detect the language the user is speaking in (Kannada, English, Hindi, or mixed Kanglish).
2. If the user speaks Kannada, reply naturally in Kannada.
3. If the user speaks English, reply naturally in English.
4. If the user speaks Hindi, reply naturally in Hindi.
5. If the user uses code-switching or mixed language (e.g., Kannada + English), match their natural conversational flow.
6. DO NOT translate the user's message into Kannada before answering.
7. DO NOT unnecessarily translate your response into another language unless requested.
8. Understand the user's meaning and respond directly, naturally, and conversationally in 2-3 concise sentences.`;

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

      const aiReply = data.reply;
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: aiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);

      speakAiResponse(aiReply);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: `⚠️ **Error / ದೋಷ:** ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setSessionStatus(isSessionActiveRef.current ? "listening" : "idle");
      if (isSessionActiveRef.current) {
        try {
          recognitionRef.current?.start();
        } catch (_) {}
      }
    } finally {
      setLoading(false);
    }
  };

  // Toggle Hands-Free Session
  const toggleHandsFreeSession = () => {
    const nextState = !isLiveSessionActive;
    setIsLiveSessionActive(nextState);
    isSessionActiveRef.current = nextState;

    if (nextState) {
      interruptAiSpeech();
      setSessionStatus("listening");
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.warn("Recognition already started or error:", err);
      }
    } else {
      interruptAiSpeech();
      setSessionStatus("idle");
      setLiveTranscript("");
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      try {
        recognitionRef.current?.stop();
      } catch (_) {}
    }
  };

  // Fallback manual send via text box
  const handleManualSend = () => {
    if (!input.trim()) return;
    const text = input;
    setInput("");
    handleAutoSendTurn(text);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#faf7fd",
        color: "#1e1b4b",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Top Navigation */}
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #ede9fe",
          padding: "16px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => {
              isSessionActiveRef.current = false;
              interruptAiSpeech();
              try {
                recognitionRef.current?.stop();
              } catch (_) {}
              onBackToHome();
            }}
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              color: "#64748b",
              padding: "8px 14px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.85rem",
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h1 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#1e1b4b", margin: 0 }}>
                Talk with AI (ಕನ್ನಡ • English • हिंदी)
              </h1>
              <span
                style={{
                  fontSize: "0.72rem",
                  color: "#6b21a8",
                  background: "#f3e8ff",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontWeight: 600,
                }}
              >
                Auto Language Detection
              </span>
            </div>
            <p style={{ fontSize: "0.76rem", color: "#64748b", margin: 0 }}>
              Hands-free voice with continuous language detection and natural spoken reply
            </p>
          </div>
        </div>

        {/* Action Controls & Language Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Speech Mic Listening Priority Selector */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#f5f3ff",
              border: "1px solid #ede9fe",
              borderRadius: "8px",
              padding: "2px",
              fontSize: "0.78rem",
            }}
          >
            {[
              { code: "kn-IN", label: "ಕನ್ನಡ" },
              { code: "en-IN", label: "English" },
              { code: "hi-IN", label: "हिंदी" },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSwitch(lang.code)}
                style={{
                  background: activeSpeechLang === lang.code ? "#7c3aed" : "transparent",
                  color: activeSpeechLang === lang.code ? "#ffffff" : "#6b21a8",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 10px",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <button
            onClick={toggleHandsFreeSession}
            style={{
              background: isLiveSessionActive ? "#ef4444" : "#7c3aed",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              padding: "9px 18px",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: isLiveSessionActive
                ? "0 4px 12px rgba(239, 68, 68, 0.25)"
                : "0 4px 12px rgba(124, 58, 237, 0.2)",
              transition: "all 0.15s ease",
            }}
          >
            {isLiveSessionActive ? (
              <>
                <Radio size={16} />
                <span>Stop Voice Session</span>
              </>
            ) : (
              <>
                <Mic size={16} />
                <span>Start Hands-Free Session</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              interruptAiSpeech();
              setMessages([messages[0]]);
            }}
            title="Clear & Restart"
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              color: "#64748b",
              padding: "9px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </header>

      {/* Live Voice Status Strip */}
      {isLiveSessionActive && (
        <div
          style={{
            background: "#f5f3ff",
            borderBottom: "1px solid #ddd6fe",
            padding: "9px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.82rem",
            color: "#5b21b6",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background:
                  sessionStatus === "user_speaking"
                    ? "#16a34a"
                    : sessionStatus === "ai_speaking"
                    ? "#7c3aed"
                    : "#d97706",
              }}
            />
            <span style={{ fontWeight: 600 }}>
              {sessionStatus === "listening" && `Listening actively (${activeSpeechLang})... Speak in Kannada, English, or Hindi!`}
              {sessionStatus === "user_speaking" && "Detecting speech & auto-detecting language..."}
              {sessionStatus === "ai_thinking" && "AI processing direct response in your language..."}
              {sessionStatus === "ai_speaking" && "AI speaking (you can interrupt anytime)..."}
            </span>
          </div>

          {liveTranscript && (
            <div style={{ fontStyle: "italic", color: "#6b21a8" }}>
              "{liveTranscript}"
            </div>
          )}
        </div>
      )}

      {/* Conversation Area */}
      <div
        style={{
          flex: 1,
          maxWidth: "860px",
          width: "100%",
          margin: "0 auto",
          padding: "24px 20px",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        {/* Topic Suggestion Chips */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            paddingBottom: "12px",
            marginBottom: "16px",
          }}
        >
          {STARTER_TOPICS.map((topic, i) => (
            <button
              key={i}
              onClick={() => handleAutoSendTurn(topic.prompt)}
              disabled={loading}
              style={{
                background: "#ffffff",
                border: "1px solid #ede9fe",
                borderRadius: "8px",
                padding: "7px 14px",
                fontSize: "0.82rem",
                color: "#5b21b6",
                whiteSpace: "nowrap",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#c4b5fd";
                e.currentTarget.style.background = "#f5f3ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#ede9fe";
                e.currentTarget.style.background = "#ffffff";
              }}
            >
              <MessageCircle size={14} color="#7c3aed" />
              <span>{topic.label}</span>
              <span style={{ fontSize: "0.72rem", color: "#8b5cf6" }}>({topic.en})</span>
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
                    gap: "10px",
                    maxWidth: isUser ? "85%" : "88%",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: "2px",
                      background: isUser ? "#7c3aed" : "#ede9fe",
                      color: isUser ? "#ffffff" : "#6b21a8",
                    }}
                  >
                    {isUser ? <User size={16} /> : <Bot size={16} />}
                  </div>

                  <div
                    style={{
                      background: isUser ? "#7c3aed" : "#ffffff",
                      border: isUser ? "none" : "1px solid #ede9fe",
                      padding: "14px 18px",
                      borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                      color: isUser ? "#ffffff" : "#1e1b4b",
                    }}
                  >
                    <div style={{ fontSize: "0.92rem", lineHeight: 1.6 }}>
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
                        color: isUser ? "rgba(255,255,255,0.7)" : "#94a3b8",
                      }}
                    >
                      <span>{msg.timestamp}</span>

                      {!isUser && (
                        <button
                          onClick={() => speakAiResponse(msg.text)}
                          title="Listen Voice Output"
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "#7c3aed",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontWeight: 600,
                            padding: 0,
                          }}
                        >
                          <Headphones size={13} />
                          <span>Play</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "4px 0" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "#ede9fe",
                  color: "#6b21a8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bot size={16} />
              </div>
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #ede9fe",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  color: "#6b21a8",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>Understanding & formulating response...</span>
                <Sparkles size={14} color="#7c3aed" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #ddd6fe",
            borderRadius: "12px",
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 4px 12px rgba(124, 58, 237, 0.05)",
          }}
        >
          <button
            type="button"
            onClick={toggleHandsFreeSession}
            title={isLiveSessionActive ? "Stop voice listening" : "Start hands-free voice mode"}
            style={{
              background: isLiveSessionActive ? "#fee2e2" : "#f5f3ff",
              border: `1px solid ${isLiveSessionActive ? "#fca5a5" : "#ddd6fe"}`,
              color: isLiveSessionActive ? "#dc2626" : "#7c3aed",
              borderRadius: "8px",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            {isLiveSessionActive ? <MicOff size={16} /> : <Mic size={16} />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleManualSend();
              }
            }}
            placeholder={
              isLiveSessionActive
                ? "🎙️ Voice active — speak freely in Kannada, English, or Hindi..."
                : "Type message in any language or click Start Hands-Free above..."
            }
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#1e1b4b",
              fontSize: "0.92rem",
              padding: "6px 4px",
              fontFamily: "inherit",
            }}
          />

          <button
            type="button"
            onClick={handleManualSend}
            disabled={loading || !input.trim()}
            style={{
              background: !loading && input.trim() ? "#7c3aed" : "#f1f5f9",
              color: !loading && input.trim() ? "#ffffff" : "#94a3b8",
              border: "none",
              borderRadius: "8px",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: !loading && input.trim() ? "pointer" : "not-allowed",
              flexShrink: 0,
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
