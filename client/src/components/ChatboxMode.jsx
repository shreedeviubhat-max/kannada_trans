import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Image as ImageIcon,
  FileText,
  Volume2,
  Copy,
  Check,
  RotateCcw,
  X,
  Mic,
  MicOff,
  Send,
  Paperclip
} from "lucide-react";

export default function ChatboxMode({ onBackToHome }) {
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: `**ನಮಸ್ಕಾರ.**
Enter any sentence or phrase in English or Kannada below. You can also upload an image, signboard photo, or document to translate.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
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

  // Voice speech-to-text
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
      alert("Speech recognition is not supported in this browser.");
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

      // Real-time SSE streaming for fast response
      const response = await fetch(`${apiBase}/api/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: historyPayload,
          image: currentAttach?.data ? { data: currentAttach.data, mimeType: currentAttach.mimeType } : null,
        }),
      });

      if (!response.ok || !response.body) {
        // Fallback to standard chat
        const fallbackRes = await fetch(`${apiBase}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmed,
            history: historyPayload,
            image: currentAttach?.data ? { data: currentAttach.data, mimeType: currentAttach.mimeType } : null,
          }),
        });
        const fallbackData = await fallbackRes.json();
        if (!fallbackRes.ok) throw new Error(fallbackData.error || "Failed to receive response.");
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            text: fallbackData.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let streamText = "";
      let modelMessageAdded = false;

      const appendChunkToLastMessage = (chunk) => {
        streamText += chunk;
        setMessages((prev) => {
          if (!modelMessageAdded) {
            modelMessageAdded = true;
            return [
              ...prev,
              {
                role: "model",
                text: streamText,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
            ];
          } else {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, text: streamText } : m));
          }
        });
      };

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const block of lines) {
          const linesInBlock = block.split("\n");
          let eventType = "message";
          let dataStr = "";

          for (const l of linesInBlock) {
            if (l.startsWith("event: ")) eventType = l.replace("event: ", "").trim();
            if (l.startsWith("data: ")) dataStr = l.replace("data: ", "").trim();
          }

          if (eventType === "chunk" && dataStr) {
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) appendChunkToLastMessage(parsed.text);
            } catch (_) {}
          } else if (eventType === "error" && dataStr) {
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error && !streamText) throw new Error(parsed.error);
            } catch (_) {}
          }
        }
      }

      if (!streamText) {
        throw new Error("No translation response was received.");
      }
    } catch (err) {
      setErrorBanner(err.message);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: `⚠️ **Error:** ${err.message}`,
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
        backgroundColor: "#f4f6f8",
        backgroundImage: `
          radial-gradient(at 10% 15%, rgba(109, 129, 150, 0.22) 0px, transparent 55%),
          radial-gradient(at 85% 85%, rgba(255, 255, 227, 0.7) 0px, transparent 50%),
          radial-gradient(at 50% 50%, rgba(203, 203, 203, 0.2) 0px, transparent 60%)
        `,
        color: "#4a4a4a",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Refined Glass Top Navigation Bar */}
      <header
        style={{
          background: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(203, 203, 203, 0.4)",
          padding: "16px 28px",
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
              background: "rgba(255, 255, 255, 0.8)",
              border: "1px solid #cbcbcb",
              color: "#4a4a4a",
              padding: "7px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.85rem",
              fontWeight: "600",
            }}
          >
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>

          <div>
            <h1 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#4a4a4a", margin: 0 }}>
              ಭಾಷಾಂತರ <span style={{ fontWeight: "400", color: "#6d8196" }}>/ Translation Workspace</span>
            </h1>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          title="Clear session"
          style={{
            background: "rgba(255, 255, 255, 0.6)",
            border: "1px solid #cbcbcb",
            color: "#4a4a4a",
            padding: "8px",
            cursor: "pointer",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <RotateCcw size={16} />
        </button>
      </header>

      {/* Main Translation Stream Container */}
      <div
        style={{
          flex: 1,
          maxWidth: "820px",
          width: "100%",
          margin: "0 auto",
          padding: "24px 16px 32px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {errorBanner && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "0.86rem",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>{errorBanner}</span>
            <button
              onClick={() => setErrorBanner(null)}
              style={{ background: "transparent", border: "none", color: "#b91c1c", cursor: "pointer" }}
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* Message Log */}
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
                    maxWidth: isUser ? "80%" : "88%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      background: isUser ? "#6d8196" : "rgba(255, 255, 255, 0.78)",
                      backdropFilter: isUser ? "none" : "blur(16px)",
                      WebkitBackdropFilter: isUser ? "none" : "blur(16px)",
                      border: isUser ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid rgba(203, 203, 203, 0.45)",
                      color: isUser ? "#ffffe3" : "#4a4a4a",
                      padding: "16px 20px",
                      borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      boxShadow: isUser
                        ? "0 4px 16px rgba(109, 129, 150, 0.25)"
                        : "0 8px 24px rgba(74, 74, 74, 0.05)",
                    }}
                  >
                    {msg.attachment?.preview && (
                      <div style={{ marginBottom: "12px" }}>
                        <img
                          src={msg.attachment.preview}
                          alt="Uploaded attachment"
                          style={{
                            maxHeight: "200px",
                            maxWidth: "100%",
                            borderRadius: "8px",
                            border: "1px solid #e2e8f0",
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
                          background: "#f0f9ff",
                          border: "1px solid #bae6fd",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "0.82rem",
                          marginBottom: "10px",
                          color: "#0369a1",
                        }}
                      >
                        <FileText size={15} />
                        <span>{msg.attachment.name}</span>
                      </div>
                    )}

                    <div className="editorial-prose" style={{ color: isUser ? "#ffffe3" : "#4a4a4a" }}>
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginTop: "4px",
                      fontSize: "0.72rem",
                      color: "#6d8196",
                      alignSelf: isUser ? "flex-end" : "flex-start",
                      padding: "0 4px",
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
                          color: "#6d8196",
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                          fontWeight: "600",
                          fontSize: "0.72rem",
                        }}
                      >
                        <Volume2 size={13} />
                        <span>Listen</span>
                      </button>
                    )}

                    <button
                      onClick={() => copyToClipboard(msg.text, idx)}
                      title="Copy text"
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: copiedIndex === idx ? "#16a34a" : "#6d8196",
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",
                      }}
                    >
                      {copiedIndex === idx ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 0", color: "#0284c7", fontSize: "0.85rem" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#0284c7", display: "inline-block" }} />
              <span>Translating...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Selected Attachment preview bar */}
        {selectedAttachment && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#ffffff",
              border: "1px solid #bae6fd",
              borderRadius: "8px",
              padding: "6px 10px",
              marginBottom: "8px",
              alignSelf: "flex-start",
            }}
          >
            <span style={{ fontSize: "0.8rem", color: "#0369a1", fontWeight: "600" }}>
              {selectedAttachment.name}
            </span>
            <button
              onClick={removeAttachment}
              style={{
                background: "transparent",
                border: "none",
                color: "#64748b",
                cursor: "pointer",
                padding: "2px",
              }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Hidden File Inputs */}
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

        {/* Workspace Input Console */}
        <div style={{ position: "relative" }}>
          {showAttachMenu && (
            <div
              style={{
                position: "absolute",
                bottom: "58px",
                left: "4px",
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                padding: "6px",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
                zIndex: 10,
                minWidth: "160px",
              }}
            >
              <button
                onClick={() => cameraInputRef.current?.click()}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#334155",
                  padding: "8px 10px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.84rem",
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <Camera size={16} />
                <span>Camera</span>
              </button>

              <button
                onClick={() => imageInputRef.current?.click()}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#334155",
                  padding: "8px 10px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.84rem",
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <ImageIcon size={16} />
                <span>Upload Image</span>
              </button>

              <button
                onClick={() => docInputRef.current?.click()}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#334155",
                  padding: "8px 10px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.84rem",
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <FileText size={16} />
                <span>Document</span>
              </button>
            </div>
          )}

          <div
            style={{
              background: "rgba(255, 255, 255, 0.78)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(203, 203, 203, 0.5)",
              borderRadius: "14px",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 8px 24px rgba(74, 74, 74, 0.05)",
            }}
          >
            <button
              type="button"
              onClick={() => setShowAttachMenu((prev) => !prev)}
              title="Attach photo or document"
              style={{
                background: "transparent",
                border: "none",
                color: "#6d8196",
                cursor: "pointer",
                padding: "6px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Paperclip size={18} />
            </button>

            <button
              type="button"
              onClick={toggleVoiceRecording}
              title={isRecording ? "Stop voice input" : "Speak to translate"}
              style={{
                background: isRecording ? "#ef4444" : "rgba(109, 129, 150, 0.12)",
                border: "1px solid rgba(109, 129, 150, 0.2)",
                color: isRecording ? "#ffffff" : "#6d8196",
                borderRadius: "8px",
                padding: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              placeholder="Type English or Kannada to translate..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "0.95rem",
                color: "#4a4a4a",
                background: "transparent",
              }}
            />

            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={loading || (!input.trim() && !selectedAttachment)}
              style={{
                background: !loading && (input.trim() || selectedAttachment) ? "#6d8196" : "rgba(203, 203, 203, 0.3)",
                color: !loading && (input.trim() || selectedAttachment) ? "#ffffe3" : "#cbcbcb",
                border: "none",
                borderRadius: "10px",
                padding: "9px 18px",
                cursor: !loading && (input.trim() || selectedAttachment) ? "pointer" : "not-allowed",
                fontWeight: "600",
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: !loading && (input.trim() || selectedAttachment) ? "0 4px 12px rgba(109, 129, 150, 0.3)" : "none",
              }}
            >
              <span>Translate</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
