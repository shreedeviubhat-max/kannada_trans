import React, { useState, useEffect } from "react";
import { Languages, Gamepad2, Calendar, MessageCircle } from "lucide-react";

export default function LandingScreen({ onSelectMode }) {
  // false = initial view (only the uploaded flag/map/slogan artwork)
  // true = after pressing Enter or clicking anywhere, display the 4 pathway blocks
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
        justifyContent: "flex-end",
        paddingBottom: "36px",
        overflow: "hidden",
        cursor: showOptions ? "default" : "pointer",
        userSelect: "none",
        boxSizing: "border-box",
      }}
    >
      {/* Dark overlay when options appear for readability */}
      {showOptions && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.2) 100%)",
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
          maxWidth: "880px",
          padding: "0 16px",
        }}
      >
        {/* Subtle Press Enter Pill prior to interaction */}
        {!showOptions && (
          <div
            style={{
              background: "rgba(0, 0, 0, 0.75)",
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

        {/* 4 Feature Pathways displayed after pressing Enter */}
        {showOptions && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: "14px",
              width: "100%",
              animation: "fadeIn 0.35s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Block 1: ಭಾಷಾಂತರ (Bhashantara - Translation & AI) */}
            <button
              onClick={() => onSelectMode("bhashantara")}
              style={{
                background: "rgba(18, 18, 21, 0.92)",
                color: "#ffffff",
                border: "2px solid #ef4444",
                borderRadius: "16px",
                padding: "18px 14px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "8px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(8px)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "#ffffff";
                e.currentTarget.style.boxShadow = "0 10px 28px rgba(239, 68, 68, 0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#ef4444";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.6)";
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "rgba(239, 68, 68, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Languages size={22} color="#f87171" />
              </div>
              <span style={{ fontSize: "1.1rem", fontWeight: "800" }}>ಭಾಷಾಂತರ</span>
              <span style={{ fontSize: "0.78rem", color: "#fca5a5", fontWeight: "600" }}>
                Bhashantara (Translate)
              </span>
              <span style={{ fontSize: "0.74rem", color: "#a1a1aa", lineHeight: "1.3" }}>
                Fast concise translation, script & simple explanation
              </span>
            </button>

            {/* Block 2: ಆಟಗಳು (Games) */}
            <button
              onClick={() => onSelectMode("games")}
              style={{
                background: "rgba(18, 18, 21, 0.92)",
                color: "#ffffff",
                border: "2px solid #eab308",
                borderRadius: "16px",
                padding: "18px 14px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "8px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(8px)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "#ffffff";
                e.currentTarget.style.boxShadow = "0 10px 28px rgba(234, 179, 8, 0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#eab308";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.6)";
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "rgba(234, 179, 8, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Gamepad2 size={22} color="#facc15" />
              </div>
              <span style={{ fontSize: "1.1rem", fontWeight: "800" }}>ಕನ್ನಡ ಆಟಗಳು</span>
              <span style={{ fontSize: "0.78rem", color: "#fef08a", fontWeight: "600" }}>
                Kannada Games
              </span>
              <span style={{ fontSize: "0.74rem", color: "#a1a1aa", lineHeight: "1.3" }}>
                Sentence Formation, Word Finding & GK Quiz
              </span>
            </button>

            {/* Block 3: ದಿನದ ಕಲಿಕೆ (Daily Learn Kannada) */}
            <button
              onClick={() => onSelectMode("daily_learn")}
              style={{
                background: "rgba(18, 18, 21, 0.92)",
                color: "#ffffff",
                border: "2px solid #22c55e",
                borderRadius: "16px",
                padding: "18px 14px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "8px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(8px)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "#ffffff";
                e.currentTarget.style.boxShadow = "0 10px 28px rgba(34, 197, 94, 0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#22c55e";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.6)";
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "rgba(34, 197, 94, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Calendar size={22} color="#4ade80" />
              </div>
              <span style={{ fontSize: "1.1rem", fontWeight: "800" }}>ದಿನದ ಕಲಿಕೆ</span>
              <span style={{ fontSize: "0.78rem", color: "#86efac", fontWeight: "600" }}>
                Daily Learn (Calendar)
              </span>
              <span style={{ fontSize: "0.74rem", color: "#a1a1aa", lineHeight: "1.3" }}>
                ಒಗಟು, ಗಾದೆ ಪೂರ್ಣ, ಸನ್ನಿವೇಶ & ನೀತಿ ಕಥೆಗಳು
              </span>
            </button>

            {/* Block 4: ಕನ್ನಡ ಟಾಕ್ (Kannada Talk) */}
            <button
              onClick={() => onSelectMode("kannada_talk")}
              style={{
                background: "rgba(18, 18, 21, 0.92)",
                color: "#ffffff",
                border: "2px solid #3b82f6",
                borderRadius: "16px",
                padding: "18px 14px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "8px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(8px)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "#ffffff";
                e.currentTarget.style.boxShadow = "0 10px 28px rgba(59, 130, 246, 0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#3b82f6";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.6)";
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "rgba(59, 130, 246, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MessageCircle size={22} color="#60a5fa" />
              </div>
              <span style={{ fontSize: "1.1rem", fontWeight: "800" }}>ಕನ್ನಡ ಟಾಕ್</span>
              <span style={{ fontSize: "0.78rem", color: "#93c5fd", fontWeight: "600" }}>
                Kannada Talk
              </span>
              <span style={{ fontSize: "0.74rem", color: "#a1a1aa", lineHeight: "1.3" }}>
                AI speaks with you in Kannada with voice guidance
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
