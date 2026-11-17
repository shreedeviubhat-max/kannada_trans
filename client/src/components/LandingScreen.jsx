import React, { useState, useEffect } from "react";
import { MessageSquare, Gamepad2 } from "lucide-react";

export default function LandingScreen({ onSelectMode }) {
  // false = initial view (only flag + map + slogan)
  // true = after pressing Enter or clicking, show the two options
  const [showOptions, setShowOptions] = useState(false);

  // Listen for Enter key press on the whole window
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        setShowOptions(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      onClick={() => {
        if (!showOptions) setShowOptions(true);
      }}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        cursor: showOptions ? "default" : "pointer",
        userSelect: "none",
      }}
    >
      {/* 
        KARNATAKA FLAG COVERING ENTIRE DISPLAY:
        Top Half: Red (#d32f2f / #dc2626)
        Bottom Half: Yellow (#fbc02d / #eab308)
      */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50vh",
          backgroundColor: "#d32f2f",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50vh",
          backgroundColor: "#fbc02d",
          zIndex: 1,
        }}
      />

      {/* 
        ON ABOVE THE FLAG: KARNATAKA MAP WITH SLOGAN INSIDE
      */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: "700px",
          padding: "20px",
          textAlign: "center",
        }}
      >
        {/* Karnataka Map Container with Slogan inside */}
        <div
          style={{
            position: "relative",
            width: "360px",
            height: "440px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            filter: "drop-shadow(0 15px 35px rgba(0, 0, 0, 0.45))",
            transition: "transform 0.4s ease",
            transform: showOptions ? "scale(0.85) translateY(-20px)" : "scale(1)",
          }}
        >
          {/* Karnataka Map SVG Outline */}
          <svg
            viewBox="0 0 300 370"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            {/* Distinct Map Fill & Stroke */}
            <path
              d="M 125 15
                 C 155 12, 190 22, 215 50
                 C 235 75, 250 115, 240 155
                 C 234 180, 246 200, 238 225
                 C 228 260, 206 295, 175 325
                 C 155 345, 128 360, 115 362
                 C 95 355, 90 328, 80 295
                 C 70 265, 58 232, 64 200
                 C 68 180, 52 160, 58 135
                 C 64 105, 80 78, 98 48
                 Z"
              fill="rgba(0, 0, 0, 0.35)"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinejoin="round"
            />
          </svg>

          {/* Slogan Inside Karnataka Map: "ಕನ್ನಡಂ ಗೆಲ್ಗೆ, ಕನ್ನಡಂ ಬಾಳ್ಗೆ" */}
          <div
            style={{
              position: "relative",
              zIndex: 3,
              textAlign: "center",
              padding: "16px",
            }}
          >
            <h1
              style={{
                fontSize: "1.75rem",
                fontWeight: "900",
                color: "#ffffff",
                lineHeight: "1.4",
                textShadow: "0 3px 12px rgba(0, 0, 0, 0.95), 0 0 25px rgba(0,0,0,0.8)",
                letterSpacing: "0.5px",
                fontFamily: "'Noto Sans Kannada', sans-serif",
                margin: 0,
              }}
            >
              ಕನ್ನಡಂ ಗೆಲ್ಗೆ,<br />
              <span style={{ color: "#ffffff" }}>ಕನ್ನಡಂ ಬಾಳ್ಗೆ</span>
            </h1>
          </div>
        </div>

        {/* Enter Prompt Hint when not opened yet */}
        {!showOptions && (
          <div
            style={{
              marginTop: "16px",
              background: "rgba(0, 0, 0, 0.6)",
              color: "#ffffff",
              padding: "10px 24px",
              borderRadius: "30px",
              fontSize: "0.95rem",
              fontWeight: "600",
              letterSpacing: "0.5px",
              backdropFilter: "blur(4px)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              animation: "bounce 2s infinite",
            }}
          >
            Press <strong>ENTER</strong> or Click anywhere to continue
          </div>
        )}

        {/* 
          WHEN ENTER IS PRESSED: TWO OPTIONS APPEAR
          1. Chat with me
          2. Game
        */}
        {showOptions && (
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              justifyContent: "center",
              width: "100%",
              maxWidth: "520px",
              animation: "fadeIn 0.3s ease-in-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Option 1: Chat with me */}
            <button
              onClick={() => onSelectMode("chatbox")}
              style={{
                flex: "1 1 200px",
                background: "#000000",
                color: "#ffffff",
                border: "3px solid #ffffff",
                borderRadius: "16px",
                padding: "20px 24px",
                fontSize: "1.2rem",
                fontWeight: "800",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.backgroundColor = "#18181b";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.backgroundColor = "#000000";
              }}
            >
              <MessageSquare size={32} color="#ffffff" />
              <span>Chat with me</span>
              <span style={{ fontSize: "0.85rem", color: "#facc15", fontWeight: "600" }}>
                (ನನ್ನೊಂದಿಗೆ ಮಾತನಾಡಿ)
              </span>
            </button>

            {/* Option 2: Game */}
            <button
              onClick={() => onSelectMode("games")}
              style={{
                flex: "1 1 200px",
                background: "#000000",
                color: "#ffffff",
                border: "3px solid #ffffff",
                borderRadius: "16px",
                padding: "20px 24px",
                fontSize: "1.2rem",
                fontWeight: "800",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.backgroundColor = "#18181b";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.backgroundColor = "#000000";
              }}
            >
              <Gamepad2 size={32} color="#ffffff" />
              <span>Game</span>
              <span style={{ fontSize: "0.85rem", color: "#facc15", fontWeight: "600" }}>
                (ಕನ್ನಡ ಆಟಗಳು)
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
