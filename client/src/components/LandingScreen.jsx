import React from "react";
import { MessageSquare, Gamepad2, Sparkles, Compass } from "lucide-react";

export default function LandingScreen({ onSelectMode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#0a0a0a",
        padding: "20px",
      }}
    >
      {/* Background Karnataka Flag Ribbon Accents (Top Red, Bottom Yellow) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "12px",
          background: "linear-gradient(90deg, #b91c1c 0%, #dc2626 100%)",
          boxShadow: "0 2px 15px rgba(220, 38, 38, 0.4)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "12px",
          background: "linear-gradient(90deg, #ca8a04 0%, #eab308 100%)",
          boxShadow: "0 -2px 15px rgba(234, 179, 8, 0.4)",
        }}
      />

      {/* Decorative Radial Glow */}
      <div
        style={{
          position: "absolute",
          width: "550px",
          height: "550px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(185, 28, 28, 0.15) 0%, rgba(234, 179, 8, 0.08) 50%, transparent 75%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Center Container */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "760px",
          width: "100%",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Top Badges */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(254, 240, 138, 0.2)",
            borderRadius: "30px",
            padding: "8px 18px",
            marginBottom: "20px",
            backdropFilter: "blur(8px)",
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>🌺</span>
          <span style={{ fontSize: "0.9rem", color: "#fef08a", fontWeight: "600", letterSpacing: "0.5px" }}>
            ಕಲಿ ಕನ್ನಡ, ನಲಿ ಕನ್ನಡದಿ • Kali Kannada AI
          </span>
        </div>

        {/* Centerpiece: Karnataka Map Outline & Core Slogan */}
        <div
          style={{
            position: "relative",
            width: "320px",
            height: "360px",
            margin: "0 auto 30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Karnataka Map Stylized Outline (SVG) */}
          <svg
            viewBox="0 0 300 360"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              filter: "drop-shadow(0 0 16px rgba(234, 179, 8, 0.35))",
            }}
          >
            <defs>
              <linearGradient id="flagGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                <stop offset="48%" stopColor="#b91c1c" stopOpacity="0.1" />
                <stop offset="52%" stopColor="#eab308" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#facc15" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="50%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#facc15" />
              </linearGradient>
            </defs>

            {/* Stylized Karnataka Outline Silhouette */}
            <path
              d="M 120 18 
                 C 150 15, 185 24, 210 50
                 C 230 72, 245 110, 235 150
                 C 230 175, 242 195, 235 220
                 C 225 255, 205 285, 175 315
                 C 155 335, 130 350, 115 352
                 C 95 345, 90 320, 80 290
                 C 70 260, 60 230, 65 200
                 C 68 180, 55 160, 60 135
                 C 65 105, 80 80, 95 50
                 Z"
              fill="url(#flagGradient)"
              stroke="url(#strokeGradient)"
              strokeWidth="2.5"
              strokeDasharray="6 3"
            />

            {/* Subtle inner decorative glow nodes */}
            <circle cx="150" cy="180" r="70" fill="rgba(234, 179, 8, 0.04)" />
          </svg>

          {/* Slogan Displayed at the Exact Center of Karnataka Map */}
          <div
            style={{
              position: "relative",
              zIndex: 3,
              padding: "16px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "1.45rem",
                fontWeight: "800",
                color: "#ffffff",
                lineHeight: "1.4",
                textShadow: "0 0 20px rgba(250, 204, 21, 0.8), 0 2px 8px rgba(0,0,0,0.9)",
                letterSpacing: "0.4px",
                fontFamily: "'Noto Sans Kannada', sans-serif",
              }}
            >
              "ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ,<br />
              <span style={{ color: "#facc15" }}>ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ"</span>
            </div>
            <div
              style={{
                fontSize: "0.8rem",
                color: "#e5e7eb",
                opacity: 0.85,
                marginTop: "8px",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              May Kannada Conquer • May Kannada Flourish
            </div>
          </div>
        </div>

        {/* Sub-headline description */}
        <p
          style={{
            color: "#9ca3af",
            fontSize: "1rem",
            maxWidth: "580px",
            lineHeight: "1.6",
            marginBottom: "36px",
          }}
        >
          Your culturally grounded multimodal companion for mastering Kannada through conversational AI, grammar breakdowns, and rich interactive games.
        </p>

        {/* Initial Pathway Choice: Chatbox or Games */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
            width: "100%",
            maxWidth: "580px",
          }}
        >
          {/* Option 1: Chatbox Mode */}
          <button
            onClick={() => onSelectMode("chatbox")}
            style={{
              background: "linear-gradient(145deg, #18181b 0%, #09090b 100%)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              borderRadius: "16px",
              padding: "24px 20px",
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.25s ease",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#ef4444";
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(239, 68, 68, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.4)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.5)";
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(239, 68, 68, 0.15)",
                color: "#f87171",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MessageSquare size={22} />
            </div>
            <div>
              <div style={{ fontSize: "1.2rem", fontWeight: "700", color: "#ffffff" }}>
                Chatbox Mode
              </div>
              <div style={{ fontSize: "0.85rem", color: "#fca5a5", marginTop: "2px" }}>
                ಸಂಭಾಷಣೆ ಮತ್ತು ಕಲಿಕೆ
              </div>
            </div>
            <div style={{ fontSize: "0.84rem", color: "#9ca3af", lineHeight: "1.4" }}>
              Bilingual translations, instant grammar breakdowns & multimodal document/image OCR.
            </div>
          </button>

          {/* Option 2: Games Mode */}
          <button
            onClick={() => onSelectMode("games")}
            style={{
              background: "linear-gradient(145deg, #18181b 0%, #09090b 100%)",
              border: "1px solid rgba(234, 179, 8, 0.4)",
              borderRadius: "16px",
              padding: "24px 20px",
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.25s ease",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#facc15";
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(250, 204, 21, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(234, 179, 8, 0.4)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.5)";
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(234, 179, 8, 0.15)",
                color: "#facc15",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Gamepad2 size={22} />
            </div>
            <div>
              <div style={{ fontSize: "1.2rem", fontWeight: "700", color: "#ffffff" }}>
                Games Mode
              </div>
              <div style={{ fontSize: "0.85rem", color: "#fde047", marginTop: "2px" }}>
                ಕನ್ನಡ ಭಾಷಾ ಆಟಗಳು
              </div>
            </div>
            <div style={{ fontSize: "0.84rem", color: "#9ca3af", lineHeight: "1.4" }}>
              Sentence Formation, Word Finding Puzzle, and Karnataka GK Quiz with live scoring.
            </div>
          </button>
        </div>
      </div>

      {/* Footer Cultural Line */}
      <footer
        style={{
          position: "absolute",
          bottom: "22px",
          textAlign: "center",
          fontSize: "0.78rem",
          color: "#71717a",
          letterSpacing: "0.5px",
        }}
      >
        ಕರ್ನಾಟಕದ ಸಂಸ್ಕೃತಿ ಮತ್ತು ಕನ್ನಡ ಭಾಷಾ ಕಲಿಕೆಯ ಹೆಮ್ಮೆಯ ವೇದಿಕೆ
      </footer>
    </div>
  );
}
