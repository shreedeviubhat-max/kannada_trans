import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import confetti from "canvas-confetti";
import {
  Send,
  Plus,
  Camera,
  Image as ImageIcon,
  FileText,
  Volume2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  X,
  Mic,
  MicOff,
  AlertCircle
} from "lucide-react";

export default function ChatboxMode({ onBackToHome }) {
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: `**ನಮಸ್ಕಾರ! ಸುಸ್ವಾಗತ!** 🙏 (*Namaskāra! Susvāgata!*)

ನಾನು ನಿಮ್ಮ **"ಕಲಿ ಕನ್ನಡ, ನಲಿ ಕನ್ನಡದಿ"** AI ಸಹಾಯಕ.
Under the spirit of **"ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ"**, I am here to help you learn, translate, and interact with Kannada.

- ✍️ **ನನ್ನಲ್ಲಿ ಕೇಳು:** Type any sentence or phrase in English or Kannada.
- ➕ **Attach:** Click \`(+)\` below to capture with your **Camera**, upload an **Image** (signboards, menus, books), or attach a **Document**.
- 📖 **Grammar & Phonetics:** Every response features authentic Kannada script, Romanized transliteration (IAST), and detailed grammar breakdowns (root words, vibhakti suffixes, verb tenses).`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null); // { type: 'image'|'camera'|'doc', name, data, preview, mimeType }
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [errorBanner, setErrorBanner] = useState(null);

  const messagesEndRef = useRef(null);
  const imageInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const docInputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Speech recognition setup
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

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedAttachment({
        type,
        name: file.name,
        data: reader.result,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
        mimeType: file.type || "application/octet-stream",
      });
    };
    reader.readAsDataURL(file);
    setShowAttachMenu(false);
  };

  const removeAttachment = () => {
    setSelectedAttachment(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    if (docInputRef.current) docInputRef.current.value = "";
  };

  const playPronunciation = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`~>]/g, "").trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "kn-IN";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSendMessage = async (textToSend = input) => {
    const trimmed = textToSend.trim();
    if (!trimmed && !selectedAttachment) return;

    const userMessage = {
      role: "user",
      text: trimmed,
      attachment: selectedAttachment,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const currentAttach = selectedAttachment;
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSelectedAttachment(null);
    setLoading(true);
    setErrorBanner(null);

    try {
      const historyPayload = messages
        .filter((_, idx) => idx > 0)
        .map((m) => ({ role: m.role, text: m.text }));

      const apiBase = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${apiBase}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: historyPayload,
          image: currentAttach?.data ? { data: currentAttach.data, mimeType: currentAttach.mimeType } : null,
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
      console.error(err);
      setErrorBanner(err.message);
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
            title="Return to Welcome Screen"
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
              transition: "all 0.2s",
            }}
          >
            <ArrowLeft size={16} />
            <span>ಹಿಂದೆ (Back)</span>
          </button>

          <div>
            <h1 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#ffffff", letterSpacing: "0.3px" }}>
              ಕಲಿ ಕನ್ನಡ, ನಲಿ ಕನ್ನಡದಿ
            </h1>
            <p style={{ fontSize: "0.76rem", color: "#facc15" }}>
              "ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ" • Chatbox Mode
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (window.confirm("Start fresh chat?")) {
              setMessages([messages[0]]);
            }
          }}
          title="Reset Chat"
          style={{
            background: "#18181b",
            border: "1px solid #27272a",
            color: "#a1a1aa",
            padding: "8px",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RotateCcw size={16} />
        </button>
      </header>

      {/* Error Banner */}
      {errorBanner && (
        <div
          style={{
            background: "#450a0a",
            border: "1px solid #991b1b",
            color: "#fecaca",
            padding: "8px 14px",
            borderRadius: "8px",
            fontSize: "0.85rem",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>{errorBanner}</span>
          <button
            onClick={() => setErrorBanner(null)}
            style={{ background: "transparent", border: "none", color: "#fca5a5", cursor: "pointer" }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Chat Messages Log */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px 6px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
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
                {/* Avatar Icon */}
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
                    marginTop: "3px",
                    background: isUser ? "#eab308" : "#dc2626",
                    color: isUser ? "#000000" : "#ffffff",
                  }}
                >
                  {isUser ? "ನೀವು" : "ಕಲಿ"}
                </div>

                {/* Message Bubble (Pitch black / subtle zinc contrast) */}
                <div
                  style={{
                    background: isUser ? "#18181b" : "#0d0d10",
                    border: isUser ? "1px solid #3f3f46" : "1px solid #27272a",
                    padding: "14px 18px",
                    borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.4)",
                    color: "#ffffff",
                  }}
                >
                  {/* Attachment Preview if attached */}
                  {msg.attachment?.preview && (
                    <div style={{ marginBottom: "10px" }}>
                      <img
                        src={msg.attachment.preview}
                        alt="attachment"
                        style={{
                          maxHeight: "220px",
                          maxWidth: "100%",
                          borderRadius: "8px",
                          border: "1px solid #3f3f46",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  )}

                  {msg.attachment && !msg.attachment.preview && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        background: "#18181b",
                        border: "1px solid #27272a",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "0.82rem",
                        marginBottom: "10px",
                        color: "#facc15",
                      }}
                    >
                      <FileText size={16} />
                      <span>{msg.attachment.name}</span>
                    </div>
                  )}

                  {/* Body text */}
                  <div className="prose-dark">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>

                  {/* Action Bar (Audio speak, copy, time) */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: "12px",
                      marginTop: "10px",
                      paddingTop: "6px",
                      borderTop: "1px solid #1f1f23",
                      fontSize: "0.72rem",
                      color: "#71717a",
                    }}
                  >
                    <span>{msg.timestamp}</span>

                    {!isUser && (
                      <button
                        onClick={() => playPronunciation(msg.text)}
                        title="Listen to pronunciation"
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "#facc15",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Volume2 size={13} />
                        <span>ಆಲಿಸಿ</span>
                      </button>
                    )}

                    <button
                      onClick={() => copyToClipboard(msg.text, idx)}
                      title="Copy text"
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: copiedIndex === idx ? "#4ade80" : "#a1a1aa",
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                      }}
                    >
                      {copiedIndex === idx ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "#dc2626",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
              }}
            >
              ಕಲಿ
            </div>
            <div
              style={{
                background: "#18181b",
                border: "1px solid #27272a",
                padding: "8px 16px",
                borderRadius: "16px",
                fontSize: "0.85rem",
                color: "#facc15",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span className="kannada-text">ಕಲಿ ಕನ್ನಡ ಯೋಚಿಸುತ್ತಿದೆ...</span>
              <Sparkles size={14} color="#facc15" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Selected Attachment Preview Bar before sending */}
      {selectedAttachment && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "#18181b",
            border: "1px solid #facc15",
            borderRadius: "10px",
            padding: "8px 12px",
            marginBottom: "8px",
            alignSelf: "flex-start",
          }}
        >
          {selectedAttachment.preview ? (
            <img
              src={selectedAttachment.preview}
              alt="Preview"
              style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover" }}
            />
          ) : (
            <FileText size={22} color="#facc15" />
          )}
          <div>
            <div style={{ fontSize: "0.82rem", color: "#ffffff", fontWeight: 600 }}>
              {selectedAttachment.name}
            </div>
            <div style={{ fontSize: "0.72rem", color: "#a1a1aa" }}>Ready for multimodal analysis</div>
          </div>
          <button
            onClick={removeAttachment}
            style={{
              background: "#27272a",
              border: "none",
              color: "#f87171",
              borderRadius: "50%",
              width: "22px",
              height: "22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Hidden Inputs for (+) Button (Camera, Image, Document) */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={(e) => handleFileUpload(e, "camera")}
        style={{ display: "none" }}
      />
      <input
        type="file"
        ref={imageInputRef}
        accept="image/*"
        onChange={(e) => handleFileUpload(e, "image")}
        style={{ display: "none" }}
      />
      <input
        type="file"
        ref={docInputRef}
        accept=".pdf,.txt,.doc,.docx,image/*"
        onChange={(e) => handleFileUpload(e, "doc")}
        style={{ display: "none" }}
      />

      {/* Input Bar with (+) on left, "ನನ್ನಲ್ಲಿ ಕೇಳು" placeholder, and Send on right */}
      <div style={{ position: "relative", marginTop: "8px" }}>
        {/* (+) Expandable Attachment Menu */}
        {showAttachMenu && (
          <div
            style={{
              position: "absolute",
              bottom: "60px",
              left: "4px",
              background: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: "14px",
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.7)",
              zIndex: 10,
              minWidth: "170px",
            }}
          >
            <button
              onClick={() => cameraInputRef.current?.click()}
              style={{
                background: "transparent",
                border: "none",
                color: "#ffffff",
                padding: "8px 12px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "0.85rem",
                cursor: "pointer",
                textAlign: "left",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#27272a")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Camera size={18} color="#f87171" />
              <span>Camera (ಕ್ಯಾಮೆರಾ)</span>
            </button>

            <button
              onClick={() => imageInputRef.current?.click()}
              style={{
                background: "transparent",
                border: "none",
                color: "#ffffff",
                padding: "8px 12px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "0.85rem",
                cursor: "pointer",
                textAlign: "left",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#27272a")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <ImageIcon size={18} color="#facc15" />
              <span>Image (ಚಿತ್ರ)</span>
            </button>

            <button
              onClick={() => docInputRef.current?.click()}
              style={{
                background: "transparent",
                border: "none",
                color: "#ffffff",
                padding: "8px 12px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "0.85rem",
                cursor: "pointer",
                textAlign: "left",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#27272a")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <FileText size={18} color="#60a5fa" />
              <span>Document (ದಾಖಲೆ)</span>
            </button>
          </div>
        )}

        {/* Input Bar Container */}
        <div
          style={{
            background: "#121215",
            border: "1px solid #27272a",
            borderRadius: "24px",
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.6)",
          }}
        >
          {/* (+) Button */}
          <button
            type="button"
            onClick={() => setShowAttachMenu((prev) => !prev)}
            title="Attach Camera, Image, or Document"
            style={{
              background: showAttachMenu ? "#3f3f46" : "#1f1f23",
              border: "1px solid #3f3f46",
              color: "#ffffff",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              transition: "all 0.2s",
            }}
          >
            <Plus size={20} style={{ transform: showAttachMenu ? "rotate(45deg)" : "none", transition: "0.2s" }} />
          </button>

          {/* Voice Input Mic */}
          <button
            type="button"
            onClick={toggleVoiceRecording}
            title={isRecording ? "Stop voice input" : "Speak in Kannada"}
            className={isRecording ? "mic-recording" : ""}
            style={{
              background: isRecording ? "#ef4444" : "#1f1f23",
              border: "1px solid #3f3f46",
              color: isRecording ? "#ffffff" : "#a1a1aa",
              borderRadius: "50%",
              width: "34px",
              height: "34px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
          </button>

          {/* Text Area with Prompt Placeholder "ನನ್ನಲ್ಲಿ ಕೇಳು" */}
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ನನ್ನಲ್ಲಿ ಕೇಳು (Ask me anything in Kannada or English)..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#ffffff",
              fontSize: "0.96rem",
              padding: "6px 2px",
              resize: "none",
              fontFamily: "inherit",
              maxHeight: "90px",
            }}
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={loading || (!input.trim() && !selectedAttachment)}
            title="Send"
            style={{
              background: !loading && (input.trim() || selectedAttachment)
                ? "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)"
                : "#27272a",
              color: !loading && (input.trim() || selectedAttachment) ? "#ffffff" : "#71717a",
              border: "none",
              borderRadius: "50%",
              width: "38px",
              height: "38px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: !loading && (input.trim() || selectedAttachment) ? "pointer" : "not-allowed",
              flexShrink: 0,
              boxShadow: !loading && (input.trim() || selectedAttachment) ? "0 2px 10px rgba(220, 38, 38, 0.4)" : "none",
            }}
          >
            <Send size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
