import React, { useState, useEffect } from "react";
import { MessageSquare, Gamepad2 } from "lucide-react";

export default function LandingScreen({ onSelectMode }) {
  // false = initial view (only the uploaded flag/map/slogan artwork)
  // true = after pressing Enter or clicking anywhere, display the two pathways
  const [showOptions, setShowOptions] = useState(false);

  // Listen for Enter key press
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
        backgroundImage: "url('/karnataka-home.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end", // Keep center visual unblocked, options at comfortable reading zone
        paddingBottom: "48px",
        overflow: "hidden",
        cursor: showOptions ? "default" : "pointer",
        userSelect: "none",
        boxSizing: "border-box",
      }}
    >
      {/* Subtle bottom gradient overlay when options appear to ensure crisp contrast */}
      {showOptions && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.45) 45%, rgba(0, 0, 0, 0.15) 100%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Interactive Action Area */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "640px",
          padding: "0 20px",
        }}
      >
        {/* Subtle Press Enter Pill prior to interaction */}
        {!showOptions && (
          <div
            style={{
              background: "rgba(0, 0, 0, 0.7)",
              color: "#ffffff",
              padding: "12px 28px",
              borderRadius: "30px",
              fontSize: "1rem",
              fontWeight: "600",
              letterSpacing: "0.5px",
              backdropFilter: "blur(6px)",
              boxShadow: "0 6px 25px rgba(0, 0, 0, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              animation: "bounce 2s infinite",
              textAlign: "center",
            }}
          >
            Press <strong style={{ color: "#facc15" }}>ENTER</strong> or Click anywhere to begin
          </div>
        )}

        {/* Pathways displayed after pressing Enter */}
        {showOptions && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              justifyContent: "center",
              width: "100%",
              animation: "fadeIn 0.35s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Option 1: Chat with me */}
            <button
              onClick={() => onSelectMode("chatbox")}
              style={{
                flex: "1 1 240px",
                background: "rgba(10, 10, 10, 0.9)",
                color: "#ffffff",
                border: "2px solid #ef4444",
                borderRadius: "18px",
                padding: "22px 24px",
                fontSize: "1.22rem",
                fontWeight: "800",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.7)",
                backdropFilter: "blur(8px)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "#ffffff";
                e.currentTarget.style.boxShadow = "0 12px 35px rgba(239, 68, 68, 0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#ef4444";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.7)";
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "rgba(239, 68, 68, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "4px",
                }}
              >
                <MessageSquare size={26} color="#f87171" />
              </div>
              <span>Chat with me</span>
              <span style={{ fontSize: "0.85rem", color: "#fca5a5", fontWeight: "600" }}>
                (ನನ್ನೊಂದಿಗೆ ಮಾತನಾಡಿ)
              </span>
            </button>

            {/* Option 2: Game */}
            <button
              onClick={() => onSelectMode("games")}
              style={{
                flex: "1 1 240px",
                background: "rgba(10, 10, 10, 0.9)",
                color: "#ffffff",
                border: "2px solid #eab308",
                borderRadius: "18px",
                padding: "22px 24px",
                fontSize: "1.22rem",
                fontWeight: "800",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.7)",
                backdropFilter: "blur(8px)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "#ffffff";
                e.currentTarget.style.boxShadow = "0 12px 35px rgba(234, 179, 8, 0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#eab308";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.7)";
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "rgba(234, 179, 8, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "4px",
                }}
              >
                <Gamepad2 size={26} color="#facc15" />
              </div>
              <span>Game</span>
              <span style={{ fontSize: "0.85rem", color: "#fef08a", fontWeight: "600" }}>
                (ಕನ್ನಡ ಆಟಗಳು)
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
