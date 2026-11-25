import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
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
  Languages,
  BookOpen
} from "lucide-react";

export default function ChatboxMode({ onBackToHome }) {
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: `**ನಮಸ್ಕಾರ! ಭಾಷಾಂತರ (Bhashantara Workspace) ಗೆ ಸುಸ್ವಾಗತ!** 🌐

ಇಲ್ಲಿ ನೀವು ಯಾವುದೇ ಇಂಗ್ಲಿಷ್ ಅಥವಾ ಕನ್ನಡ ಪಠ್ಯ, ಚಿತ್ರ ಅಥವಾ ಧ್ವನಿಯನ್ನು ಅತ್ಯಂತ ವೇಗವಾಗಿ ಮತ್ತು ಸರಳವಾಗಿ ಭಾಷಾಂತರಿಸಬಹುದು.

**ಉದಾಹರಣೆಗೆ (Format):**
- **ನೀಡಿದ ಪಠ್ಯ (Given Text):** Good morning, how are you?
- **ಅನುವಾದ (Translation):** ಶುಭೋದಯ, ನೀವು ಹೇಗಿದ್ದೀರಿ?
- **ಉಚ್ಚಾರಣೆ (Transliteration):** Śubhōdaya, nīvu hēgiddīri?
- **ಸರಳ ವಿವರಣೆ (Simple Explanation):** Formal and respectful way to greet someone in Kannada.

*ಟೈಪ್ ಮಾಡಿ, ಧ್ವನಿ ಬಳಸಿ ಅಥವಾ \`(+)\` ಮೂಲಕ ಚಿತ್ರ/ದಾಖಲೆ ಲಗತ್ತಿಸಿ!*`,
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
      
      // Try streaming endpoint for fastest response
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
        // Fallback to standard chat if stream is unsupported
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

      // Stream tokens dynamically into state
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
        throw new Error("No response was received from the stream.");
      }

    } catch (err) {
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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)",
        color: "#0f172a",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Top Header Bar */}
      <header
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #bae6fd",
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
              background: "#ffffff",
              border: "1px solid #bae6fd",
              color: "#0369a1",
              padding: "8px 14px",
              borderRadius: "12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.88rem",
              fontWeight: "600",
              boxShadow: "0 2px 6px rgba(2, 132, 199, 0.08)",
            }}
          >
            <ArrowLeft size={16} />
            <span>ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ (Dashboard)</span>
          </button>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Languages size={20} color="#0284c7" />
              <h1 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#0c4a6e", margin: 0 }}>
                ಭಾಷಾಂತರ (Translation Workspace)
              </h1>
            </div>
            <p style={{ fontSize: "0.78rem", color: "#0284c7", margin: "2px 0 0" }}>
              Soft Blue & White Theme • Fast, Clean & Concise Kannada ⇄ English
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          title="Reset Workspace"
          style={{
            background: "#ffffff",
            border: "1px solid #bae6fd",
            color: "#0284c7",
            padding: "8px",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RotateCcw size={17} />
        </button>
      </header>

      {/* Main Translation Conversation Container */}
      <div
        style={{
          flex: 1,
          maxWidth: "940px",
          width: "100%",
          margin: "0 auto",
          padding: "20px 16px",
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
              borderRadius: "12px",
              fontSize: "0.86rem",
              marginBottom: "14px",
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
                      background: isUser ? "#0284c7" : "#e0f2fe",
                      color: isUser ? "#ffffff" : "#0369a1",
                      border: isUser ? "none" : "1px solid #bae6fd",
                    }}
                  >
                    {isUser ? "ನೀವು" : "ಅನುವಾದ"}
                  </div>

                  <div
                    style={{
                      background: isUser ? "#0284c7" : "#ffffff",
                      border: isUser ? "none" : "1px solid #e0f2fe",
                      color: isUser ? "#ffffff" : "#0f172a",
                      padding: "16px 20px",
                      borderRadius: isUser ? "20px 4px 20px 20px" : "4px 20px 20px 20px",
                      boxShadow: "0 4px 16px rgba(2, 132, 199, 0.08)",
                    }}
                  >
                    {msg.attachment?.preview && (
                      <div style={{ marginBottom: "10px" }}>
                        <img
                          src={msg.attachment.preview}
                          alt="attachment"
                          style={{
                            maxHeight: "220px",
                            maxWidth: "100%",
                            borderRadius: "10px",
                            border: "1px solid #bae6fd",
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
                          borderRadius: "8px",
                          fontSize: "0.82rem",
                          marginBottom: "10px",
                          color: "#0369a1",
                        }}
                      >
                        <FileText size={16} />
                        <span>{msg.attachment.name}</span>
                      </div>
                    )}

                    <div className={isUser ? "" : "prose-light"}>
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: "12px",
                        marginTop: "10px",
                        paddingTop: "6px",
                        borderTop: isUser ? "1px solid rgba(255,255,255,0.2)" : "1px solid #f1f5f9",
                        fontSize: "0.74rem",
                        color: isUser ? "#e0f2fe" : "#94a3b8",
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
                            color: "#0284c7",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontWeight: "600",
                          }}
                        >
                          <Volume2 size={14} />
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
                          color: copiedIndex === idx ? "#16a34a" : isUser ? "#e0f2fe" : "#94a3b8",
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        {copiedIndex === idx ? <Check size={14} /> : <Copy size={14} />}
                      </button>
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
                  background: "#e0f2fe",
                  color: "#0284c7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                ಅನುವಾದ
              </div>
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #bae6fd",
                  padding: "10px 18px",
                  borderRadius: "16px",
                  fontSize: "0.88rem",
                  color: "#0284c7",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 2px 8px rgba(2, 132, 199, 0.08)",
                }}
              >
                <span>ಭಾಷಾಂತರಿಸಲಾಗುತ್ತಿದೆ (Translating)...</span>
                <Sparkles size={16} color="#0284c7" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Selected Attachment Preview Bar */}
        {selectedAttachment && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "#ffffff",
              border: "1px solid #bae6fd",
              borderRadius: "12px",
              padding: "8px 12px",
              marginBottom: "10px",
              alignSelf: "flex-start",
              boxShadow: "0 2px 8px rgba(2, 132, 199, 0.1)",
            }}
          >
            {selectedAttachment.preview ? (
              <img
                src={selectedAttachment.preview}
                alt="Preview"
                style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "cover" }}
              />
            ) : (
              <FileText size={22} color="#0284c7" />
            )}
            <div>
              <div style={{ fontSize: "0.82rem", color: "#0c4a6e", fontWeight: 700 }}>
                {selectedAttachment.name}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#64748b" }}>Ready for translation & OCR</div>
            </div>
            <button
              onClick={removeAttachment}
              style={{
                background: "#f1f5f9",
                border: "none",
                color: "#64748b",
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

        {/* Translation Input Bar */}
        <div style={{ position: "relative" }}>
          {showAttachMenu && (
            <div
              style={{
                position: "absolute",
                bottom: "68px",
                left: "6px",
                background: "#ffffff",
                border: "1px solid #bae6fd",
                borderRadius: "16px",
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                boxShadow: "0 10px 25px rgba(2, 132, 199, 0.15)",
                zIndex: 10,
                minWidth: "180px",
              }}
            >
              <button
                onClick={() => cameraInputRef.current?.click()}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#0f172a",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "0.86rem",
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f9ff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <Camera size={18} color="#0284c7" />
                <span>Camera (ಕ್ಯಾಮೆರಾ)</span>
              </button>

              <button
                onClick={() => imageInputRef.current?.click()}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#0f172a",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "0.86rem",
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f9ff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <ImageIcon size={18} color="#0284c7" />
                <span>Image (ಚಿತ್ರ)</span>
              </button>

              <button
                onClick={() => docInputRef.current?.click()}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#0f172a",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "0.86rem",
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f9ff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <FileText size={18} color="#0284c7" />
                <span>Document (ದಾಖಲೆ)</span>
              </button>
            </div>
          )}

          <div
            style={{
              background: "#ffffff",
              border: "1.5px solid #bae6fd",
              borderRadius: "28px",
              padding: "8px 14px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 6px 20px rgba(2, 132, 199, 0.08)",
            }}
          >
            <button
              type="button"
              onClick={() => setShowAttachMenu((prev) => !prev)}
              title="Attach Camera, Image, or Document"
              style={{
                background: showAttachMenu ? "#e0f2fe" : "#f0f9ff",
                border: "1px solid #bae6fd",
                color: "#0284c7",
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
              <Plus size={20} style={{ transform: showAttachMenu ? "rotate(45deg)" : "none", transition: "0.2s" }} />
            </button>

            <button
              type="button"
              onClick={toggleVoiceRecording}
              title={isRecording ? "Stop voice input" : "Speak text"}
              className={isRecording ? "mic-recording" : ""}
              style={{
                background: isRecording ? "#ef4444" : "#f0f9ff",
                border: "1px solid #bae6fd",
                color: isRecording ? "#ffffff" : "#0284c7",
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
              {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
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
              placeholder="ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ (Type text in Kannada or English to translate)..."
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#0f172a",
                fontSize: "0.98rem",
                padding: "8px 4px",
                resize: "none",
                fontFamily: "inherit",
              }}
            />

            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={loading || (!input.trim() && !selectedAttachment)}
              style={{
                background: !loading && (input.trim() || selectedAttachment)
                  ? "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)"
                  : "#e2e8f0",
                color: !loading && (input.trim() || selectedAttachment) ? "#ffffff" : "#94a3b8",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: !loading && (input.trim() || selectedAttachment) ? "pointer" : "not-allowed",
                flexShrink: 0,
                boxShadow: !loading && (input.trim() || selectedAttachment) ? "0 4px 12px rgba(2, 132, 199, 0.3)" : "none",
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
