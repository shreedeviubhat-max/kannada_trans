import React, { useEffect } from "react";
import { ArrowRight } from "lucide-react";

export default function LandingScreen({ onEnter }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") onEnter();
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
        backgroundColor: "#faf9f6", // Warm gallery linen background
        backgroundImage: "radial-gradient(#e5e2da 0.75px, transparent 0.75px)",
        backgroundSize: "24px 24px",
        padding: "32px 20px",
        position: "relative",
      }}
    >
      {/* Top minimal logo */}
      <header
        style={{
          position: "absolute",
          top: "32px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#0f172a",
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#d97706",
            display: "inline-block",
          }}
        />
        <span style={{ fontSize: "0.88rem", fontWeight: "600", letterSpacing: "0.5px" }}>
          KALI KANNADA
        </span>
      </header>

      {/* Main Center Minimal Hero */}
      <main
        className="animate-fade-in"
        style={{
          maxWidth: "680px",
          width: "100%",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Subtle Tagline */}
        <span
          style={{
            fontSize: "0.85rem",
            fontWeight: "600",
            color: "#92400e",
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            marginBottom: "16px",
          }}
        >
          ಕನ್ನಡ ಭಾಷಾ ಕಲಿಕಾ ವೇದಿಕೆ
        </span>

        {/* Primary Typography Heading */}
        <h1
          style={{
            fontSize: "clamp(2.5rem, 6vw, 3.8rem)",
            fontWeight: "800",
            color: "#0f172a",
            lineHeight: "1.18",
            letterSpacing: "-0.03em",
            fontFamily: "var(--font-kannada)",
            marginBottom: "18px",
          }}
        >
          ಕಲಿ ಕನ್ನಡ, ನಲಿ ಕನ್ನಡದಿ
        </h1>

        {/* Single clean welcoming sentence */}
        <p
          style={{
            fontSize: "1.1rem",
            color: "#475569",
            lineHeight: "1.6",
            maxWidth: "460px",
            marginBottom: "40px",
            fontWeight: "400",
          }}
        >
          A thoughtful, intelligent companion designed for learning, translating, and speaking Kannada with ease.
        </p>

        {/* Minimal, tactile Enter Button */}
        <button
          onClick={onEnter}
          style={{
            backgroundColor: "#0f172a",
            color: "#ffffff",
            border: "none",
            borderRadius: "12px",
            padding: "16px 36px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 4px 14px rgba(15, 23, 42, 0.12)",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#1e293b";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#0f172a";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <span>ಪ್ರವೇಶಿಸಿ (Enter)</span>
          <ArrowRight size={18} />
        </button>

        <span style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "16px" }}>
          or press <kbd style={{ padding: "2px 6px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "0.72rem" }}>Enter ↵</kbd>
        </span>
      </main>

      {/* Clean bottom signature */}
      <footer
        style={{
          position: "absolute",
          bottom: "24px",
          fontSize: "0.8rem",
          color: "#94a3b8",
        }}
      >
        ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ
      </footer>
    </div>
  );
}
