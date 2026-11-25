import React, { useEffect } from "react";
import { ArrowRight, Sparkles, BookOpen, Compass } from "lucide-react";

export default function LandingScreen({ onEnter }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        onEnter();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onEnter]);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #7f1d1d 0%, #991b1b 45%, #b45309 85%, #d97706 100%)",
        color: "#ffffff",
        padding: "24px 16px",
      }}
    >
      {/* Decorative Traditional Kannada Motif Patterns & Radial Glow */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(254, 240, 138, 0.25) 0%, transparent 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          right: "-10%",
          width: "550px",
          height: "550px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Main Glassmorphic Welcome Card */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "840px",
          width: "100%",
          background: "rgba(15, 23, 42, 0.45)",
          backdropFilter: "blur(18px)",
          border: "1px solid rgba(254, 240, 138, 0.3)",
          borderRadius: "32px",
          padding: "48px 32px",
          textAlign: "center",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.45)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          animation: "fadeIn 0.6s ease-out",
        }}
      >
        {/* Top Cultural Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(254, 240, 138, 0.15)",
            border: "1px solid rgba(254, 240, 138, 0.4)",
            borderRadius: "9999px",
            padding: "8px 20px",
            marginBottom: "24px",
            fontSize: "0.92rem",
            fontWeight: "600",
            color: "#fef08a",
            letterSpacing: "0.5px",
          }}
        >
          <span>🌺</span>
          <span>ಕಲಿ ಕನ್ನಡ, ನಲಿ ಕನ್ನಡದಿ • Kali Kannada AI</span>
        </div>

        {/* Karnataka Stylized Map with Slogan & Emblem */}
        <div
          style={{
            position: "relative",
            width: "280px",
            height: "280px",
            margin: "0 auto 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Karnataka Map Stylized Outline */}
          <svg
            viewBox="0 0 300 360"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              filter: "drop-shadow(0 8px 25px rgba(254, 240, 138, 0.4))",
            }}
          >
            <defs>
              <linearGradient id="mapGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#dc2626" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#b91c1c" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#eab308" stopOpacity="0.9" />
              </linearGradient>
            </defs>
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
              fill="url(#mapGradient)"
              stroke="#fef08a"
              strokeWidth="3"
            />
          </svg>

          {/* Central Cultural Motto */}
          <div
            style={{
              position: "relative",
              zIndex: 3,
              textAlign: "center",
              padding: "16px",
            }}
          >
            <div
              style={{
                fontSize: "1.45rem",
                fontWeight: "900",
                color: "#ffffff",
                lineHeight: "1.35",
                textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                letterSpacing: "0.5px",
                fontFamily: "'Noto Sans Kannada', sans-serif",
              }}
            >
              "ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ,<br />
              <span style={{ color: "#fef08a" }}>ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ"</span>
            </div>
            <div
              style={{
                fontSize: "0.74rem",
                color: "#e2e8f0",
                marginTop: "6px",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Learn • Translate • Speak
            </div>
          </div>
        </div>

        {/* Hero Title & Subtext */}
        <h1
          style={{
            fontSize: "2.4rem",
            fontWeight: "800",
            color: "#ffffff",
            marginBottom: "12px",
            lineHeight: "1.25",
            letterSpacing: "-0.5px",
          }}
        >
          ಕನ್ನಡ ಕಲಿಯಿರಿ, ಸಂಭ್ರಮಿಸಿ
        </h1>
        <p
          style={{
            fontSize: "1.05rem",
            color: "#fed7aa",
            maxWidth: "620px",
            lineHeight: "1.6",
            marginBottom: "36px",
          }}
        >
          Welcome to your premier AI platform for mastering Kannada through interactive translation, spoken AI dialogues, immersive learning challenges, and games.
        </p>

        {/* ENTER Button */}
        <button
          onClick={onEnter}
          style={{
            background: "linear-gradient(135deg, #facc15 0%, #eab308 100%)",
            color: "#78350f",
            border: "none",
            borderRadius: "9999px",
            padding: "18px 46px",
            fontSize: "1.2rem",
            fontWeight: "800",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            boxShadow: "0 10px 30px rgba(234, 179, 8, 0.45)",
            transition: "all 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05) translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 14px 40px rgba(234, 179, 8, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1) translateY(0)";
            e.currentTarget.style.boxShadow = "0 10px 30px rgba(234, 179, 8, 0.45)";
          }}
        >
          <span>ಪ್ರವೇಶಿಸಿ (ENTER)</span>
          <ArrowRight size={22} color="#78350f" />
        </button>

        <div style={{ marginTop: "14px", fontSize: "0.82rem", color: "rgba(255,255,255,0.7)" }}>
          Press <strong>ENTER</strong> or click above to explore
        </div>
      </div>
    </div>
  );
}
