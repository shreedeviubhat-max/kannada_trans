import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  MessageCircle,
  Bot,
  User,
  Headphones,
  Radio,
  Power
} from "lucide-react";

const STARTER_TOPICS = [
  {
    label: "ಪರಿಚಯ ಮಾಡಿಕೊಳ್ಳಿ (Introduce Yourself)",
    prompt: "ನಮಸ್ಕಾರ! ನನ್ನ ಹೆಸರು ನೀವು. ನಾನು ನಿಮ್ಮೊಂದಿಗೆ ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಲು ಬಯಸುತ್ತೇನೆ.",
  },
  {
    label: "ಆಟೋ ಅಥವಾ ಮಾರುಕಟ್ಟೆ (Auto / Market)",
    prompt: "ಆಟೋ ಚಾಲಕರೊಂದಿಗೆ ಎಲ್ಲಿಗೆ ಹೋಗಬೇಕು, ಬಾಡಿಗೆ ಎಷ್ಟು ಎಂದು ಹೇಗೆ ಕೇಳಬೇಕು? ಸಂಭಾಷಣೆ ಆರಂಭಿಸಿ.",
  },
  {
    label: "ಹೋಟೆಲ್‌ನಲ್ಲಿ ಊಟ (Ordering Food)",
    prompt: "ಹೋಟೆಲ್‌ನಲ್ಲಿ ಮಸಾಲೆ ದೋಸೆ ಮತ್ತು ಫಿಲ್ಟರ್ ಕಾಫಿ ಆರ್ಡರ್ ಮಾಡಲು ಸಂಭಾಷಣೆ ಆರಂಭಿಸಿ.",
  },
  {
    label: "ಹವಾಮಾನ & ದಿನಚರಿ (Weather & Routine)",
    prompt: "ಇಂದಿನ ಹವಾಮಾನ ಮತ್ತು ನಿಮ್ಮ ದಿನಚರಿ ಬಗ್ಗೆ ಕನ್ನಡದಲ್ಲಿ ನನ್ನೊಂದಿಗೆ ಮಾತನಾಡಿ.",
  },
];

export default function KannadaTalkMode({ onBackToHome }) {
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: `**ನಮಸ್ಕಾರ ಗೆಳೆಯರೇ!** 🙏 (*Namaskāra geḷeyarē!* - "Hello my friend!")

ನಾನು ನಿಮ್ಮ **ಕನ್ನಡ ಮಾತುಕತೆ ಸ್ನೇಹಿತ (Hands-Free AI Voice Partner)**. 

ಇಲ್ಲಿ ಯಾವುದೇ ಬಟನ್ ಒತ್ತದೇ, ನೈಸರ್ಗಿಕವಾಗಿ ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಬಹುದು:
1. ಕೆಳಗಿರುವ **"ಧ್ವನಿ ಸಂಭಾಷಣೆ ಆರಂಭಿಸಿ (Start Hands-Free Session)"** ಕ್ಲಿಕ್ ಮಾಡಿ.
2. ನೀವು ಮಾತನಾಡಿದ ತಕ್ಷಣ ಸಿಸ್ಟಮ್ ತಾನಾಗಿಯೇ ಗುರುತಿಸಿ, ನೀವು ಮಾತು ನಿಲ್ಲಿಸಿದಾಗ (Silence Detection) AI ಕನ್ನಡದಲ್ಲೇ ಮಾತನಾಡುತ್ತದೆ!
3. AI ಮಾತನಾಡುತ್ತಿರುವಾಗ ನೀವು ಮಧ್ಯದಲ್ಲೇ ಮಾತನಾಡಿದರೆ (Barge-in / Interrupt) AI ಧ್ವನಿ ತಾನಾಗಿಯೇ ನಿಲ್ಲುತ್ತದೆ.

**ಹಾಗಾದರೆ, ಸಂಭಾಷಣೆ ಆರಂಭಿಸೋಣವೇ?**`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLiveSessionActive, setIsLiveSessionActive] = useState(false);
  const [sessionStatus, setSessionStatus] = useState("idle"); // 'idle' | 'listening' | 'user_speaking' | 'ai_thinking' | 'ai_speaking'
  const [liveTranscript, setLiveTranscript] = useState("");

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const isAiSpeakingRef = useRef(false);
  const isSessionActiveRef = useRef(false);
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
      .replace(/\([^)]*\)/g, "") // remove parenthetical transliteration for audio so it speaks authentic Kannada
      .trim();
  };

  // Stop any active AI speech immediately (Barge-in / Interrupt)
  const interruptAiSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    isAiSpeakingRef.current = false;
  };

  // Play audio response and resume listening immediately after finishing
  const speakAiResponse = (text) => {
    if (!window.speechSynthesis) return;

    interruptAiSpeech();
    const cleanKannada = cleanMarkdownForAudio(text);
    if (!cleanKannada) return;

    const utterance = new SpeechSynthesisUtterance(cleanKannada);
    utterance.lang = "kn-IN";
    utterance.rate = 0.92;

    utterance.onstart = () => {
      isAiSpeakingRef.current = true;
      setSessionStatus("ai_speaking");
    };

    utterance.onend = () => {
      isAiSpeakingRef.current = false;
      // Resume listening if session is still active
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
    recognition.lang = "kn-IN";

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
      // Automatically keep recognition running unless AI is speaking or session paused
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
  }, []);

  // Hands-Free Auto-Send Turn when silence is detected
  const handleAutoSendTurn = async (spokenText) => {
    if (!spokenText.trim()) return;

    // Clear interim transcript
    setLiveTranscript("");
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

    // Pause recognition while AI processes
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

      const conversationPrompt = `[Kannada Talk Hands-Free Mode]: The user is speaking live in Kannada. Reply in natural, friendly conversational Kannada (Kannada script first, followed by Romanized transliteration and short English meaning). Keep it punchy (2-3 sentences max) so it sounds like real spoken dialogue. User said: "${spokenText}"`;

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

      // Automatically speak the response in Kannada audio
      speakAiResponse(aiReply);

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: `⚠️ **ದೋಷ (Error):** ${err.message}`,
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
        background: "linear-gradient(135deg, #090d16 0%, #151136 50%, #200d45 100%)",
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
          background: "rgba(15, 23, 42, 0.85)",
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
            onClick={() => {
              isSessionActiveRef.current = false;
              interruptAiSpeech();
              try {
                recognitionRef.current?.stop();
              } catch (_) {}
              onBackToHome();
            }}
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
                ಕನ್ನಡ ಟಾಕ್ (Hands-Free AI Voice Partner)
              </h1>
            </div>
            <p style={{ fontSize: "0.78rem", color: "#c084fc", margin: "2px 0 0" }}>
              Automatic VAD • End-of-Turn Silence Detection • Interrupt (Barge-in) Support
            </p>
          </div>
        </div>

        {/* Start / Stop Hands-Free Voice Session Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={toggleHandsFreeSession}
            style={{
              background: isLiveSessionActive
                ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                : "linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)",
              color: "#ffffff",
              border: "none",
              borderRadius: "9999px",
              padding: "10px 20px",
              fontSize: "0.92rem",
              fontWeight: "800",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: isLiveSessionActive
                ? "0 0 20px rgba(239, 68, 68, 0.5)"
                : "0 0 20px rgba(147, 51, 234, 0.4)",
              transition: "all 0.25s",
            }}
          >
            {isLiveSessionActive ? (
              <>
                <Radio size={18} className="float-element" />
                <span>ಸೆಷನ್ ನಿಲ್ಲಿಸಿ (Stop Session)</span>
              </>
            ) : (
              <>
                <Mic size={18} />
                <span>ಧ್ವನಿ ಸಂಭಾಷಣೆ ಆರಂಭಿಸಿ (Start Hands-Free)</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              interruptAiSpeech();
              setMessages([messages[0]]);
            }}
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
        </div>
      </header>

      {/* Real-Time Live Status Bar */}
      {isLiveSessionActive && (
        <div
          style={{
            background: "rgba(147, 51, 234, 0.15)",
            borderBottom: "1px solid rgba(192, 132, 252, 0.3)",
            padding: "8px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.86rem",
            color: "#e9d5ff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: sessionStatus === "user_speaking" ? "#22c55e" : sessionStatus === "ai_speaking" ? "#38bdf8" : "#f59e0b",
                boxShadow: "0 0 10px currentColor",
              }}
            />
            <span style={{ fontWeight: 700 }}>
              {sessionStatus === "listening" && "🎧 ನಿರೀಕ್ಷಿಸಲಾಗುತ್ತಿದೆ (Listening for your Kannada voice)..."}
              {sessionStatus === "user_speaking" && "🎙️ ನೀವು ಮಾತನಾಡುತ್ತಿದ್ದೀರಿ (Detecting Speech)..."}
              {sessionStatus === "ai_thinking" && "✨ AI ಯೋಚಿಸುತ್ತಿದೆ (AI Processing Response)..."}
              {sessionStatus === "ai_speaking" && "🔊 AI ಮಾತನಾಡುತ್ತಿದೆ (Speaking... You can interrupt anytime!)"}
            </span>
          </div>

          {liveTranscript && (
            <div style={{ fontStyle: "italic", color: "#fef08a" }}>
              "{liveTranscript}"
            </div>
          )}
        </div>
      )}

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
        {/* Starter Topics */}
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
              onClick={() => handleAutoSendTurn(topic.prompt)}
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

        {/* Message Stream */}
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
                          onClick={() => speakAiResponse(msg.text)}
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
                <span>ಕನ್ನಡದಲ್ಲಿ ಯೋಚಿಸುತ್ತಿದೆ...</span>
                <Sparkles size={16} color="#c084fc" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Fallback Text Input & Hands-Free Status Trigger Bar */}
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
            onClick={toggleHandsFreeSession}
            title={isLiveSessionActive ? "Stop voice listening" : "Start continuous voice mode"}
            className={isLiveSessionActive ? "mic-recording" : ""}
            style={{
              background: isLiveSessionActive ? "#ef4444" : "rgba(147, 51, 234, 0.25)",
              border: "1px solid rgba(192, 132, 252, 0.4)",
              color: isLiveSessionActive ? "#ffffff" : "#c084fc",
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
            {isLiveSessionActive ? <MicOff size={18} /> : <Mic size={18} />}
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
                ? "🎙️ ಮುಕ್ತವಾಗಿ ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ... (Speak freely in Kannada)..."
                : "ಕನ್ನಡದಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮೇಲಿನ ಧ್ವನಿ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ..."
            }
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#ffffff",
              fontSize: "0.98rem",
              padding: "8px 4px",
              fontFamily: "inherit",
            }}
          />

          <button
            type="button"
            onClick={handleManualSend}
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
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
