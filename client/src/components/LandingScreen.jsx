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
        backgroundColor: "#f4f6f8",
        backgroundImage: `
          radial-gradient(at 15% 20%, rgba(109, 129, 150, 0.22) 0px, transparent 55%),
          radial-gradient(at 85% 80%, rgba(255, 255, 227, 0.8) 0px, transparent 50%),
          radial-gradient(at 50% 50%, rgba(203, 203, 203, 0.25) 0px, transparent 60%)
        `,
        padding: "32px 20px",
        position: "relative",
      }}
    >
      {/* Top minimal brand tag */}
      <header
        style={{
          position: "absolute",
          top: "32px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#4a4a4a",
          background: "rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.7)",
          padding: "6px 14px",
          borderRadius: "9999px",
          boxShadow: "0 4px 12px rgba(74, 74, 74, 0.04)",
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#6d8196",
            display: "inline-block",
          }}
        />
        <span style={{ fontSize: "0.82rem", fontWeight: "600", letterSpacing: "0.5px" }}>
          KALI KANNADA AI
        </span>
      </header>

      {/* Main Glassmorphic Card */}
      <main
        className="animate-fade-in"
        style={{
          maxWidth: "680px",
          width: "100%",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "rgba(255, 255, 255, 0.68)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.8)",
          borderRadius: "24px",
          padding: "56px 36px",
          boxShadow: "0 20px 45px rgba(109, 129, 150, 0.14)",
        }}
      >
        {/* Subtle Tagline */}
        <span
          style={{
            fontSize: "0.82rem",
            fontWeight: "700",
            color: "#6d8196",
            textTransform: "uppercase",
            letterSpacing: "1.6px",
            marginBottom: "14px",
            background: "rgba(255, 255, 227, 0.8)",
            border: "1px solid rgba(203, 203, 203, 0.4)",
            padding: "4px 12px",
            borderRadius: "6px",
          }}
        >
          ಕನ್ನಡ ಭಾಷಾ ಕಲಿಕಾ ವೇದಿಕೆ
        </span>

        {/* Primary Typography Heading */}
        <h1
          style={{
            fontSize: "clamp(2.4rem, 5.5vw, 3.6rem)",
            fontWeight: "800",
            color: "#4a4a4a",
            lineHeight: "1.2",
            letterSpacing: "-0.02em",
            fontFamily: "var(--font-kannada)",
            marginBottom: "18px",
          }}
        >
          ಕಲಿ ಕನ್ನಡ, ನಲಿ ಕನ್ನಡದಿ
        </h1>

        {/* Single clean welcoming sentence */}
        <p
          style={{
            fontSize: "1.05rem",
            color: "#4a4a4a",
            opacity: 0.85,
            lineHeight: "1.65",
            maxWidth: "460px",
            marginBottom: "38px",
            fontWeight: "400",
          }}
        >
          A thoughtful, intelligent companion designed for learning, translating, and speaking Kannada with ease.
        </p>

        {/* Glassmorphic Enter Button in #6d8196 and #ffffe3 */}
        <button
          onClick={onEnter}
          style={{
            backgroundColor: "#6d8196",
            color: "#ffffe3",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "14px",
            padding: "16px 38px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 8px 24px rgba(109, 129, 150, 0.3)",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#596e82";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 12px 28px rgba(109, 129, 150, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#6d8196";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(109, 129, 150, 0.3)";
          }}
        >
          <span>ಪ್ರವೇಶಿಸಿ (Enter)</span>
          <ArrowRight size={18} />
        </button>

        <span style={{ fontSize: "0.78rem", color: "#6d8196", marginTop: "16px" }}>
          or press <kbd style={{ padding: "3px 8px", background: "rgba(255, 255, 255, 0.8)", border: "1px solid #cbcbcb", borderRadius: "6px", fontSize: "0.74rem", color: "#4a4a4a" }}>Enter ↵</kbd>
        </span>
      </main>

      {/* Clean bottom signature */}
      <footer
        style={{
          position: "absolute",
          bottom: "24px",
          fontSize: "0.82rem",
          color: "#6d8196",
          fontWeight: "500",
        }}
      >
        ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ
      </footer>
    </div>
  );
}
