import React from "react";
import { ArrowUpRight, ArrowLeft } from "lucide-react";

export default function MainDashboard({ onNavigate, onBackToWelcome }) {
  const pathways = [
    {
      id: "bhashantara",
      number: "01",
      title: "Translate",
      kannada: "ಭಾಷಾಂತರ",
      description: "Direct bilingual translation with phonetic Romanization and contextual word breakdown.",
      accent: "#6d8196",
      glassBg: "rgba(255, 255, 255, 0.72)",
      tagBg: "rgba(109, 129, 150, 0.12)",
      borderTone: "rgba(109, 129, 150, 0.25)",
      tag: "Workspace",
    },
    {
      id: "games",
      number: "02",
      title: "Play Games",
      kannada: "ಭಾಷಾ ಆಟಗಳು",
      description: "Sentence formation puzzles, hidden word discovery, and Karnataka cultural trivia.",
      accent: "#c75f71",
      glassBg: "rgba(255, 255, 255, 0.75)",
      tagBg: "rgba(240, 187, 187, 0.35)",
      borderTone: "rgba(199, 95, 113, 0.25)",
      tag: "Interactive",
    },
    {
      id: "daily_learn",
      number: "03",
      title: "Learn Kannada",
      kannada: "ದಿನದ ಕಲಿಕೆ",
      description: "Structured calendar streak, riddles (ಒಗಟು), proverbs, and situational moral lessons.",
      accent: "#54463a",
      glassBg: "rgba(255, 255, 255, 0.75)",
      tagBg: "rgba(162, 174, 157, 0.28)",
      borderTone: "rgba(162, 174, 157, 0.35)",
      tag: "Curriculum",
    },
    {
      id: "kannada_talk",
      number: "04",
      title: "Talk with AI",
      kannada: "ಕನ್ನಡ ಸಂಭಾಷಣೆ",
      description: "Hands-free continuous spoken dialogue partner with automatic voice detection and speech synthesis.",
      accent: "#6d8196",
      glassBg: "rgba(255, 255, 255, 0.72)",
      tagBg: "rgba(255, 255, 227, 0.7)",
      borderTone: "rgba(203, 203, 203, 0.45)",
      tag: "Conversational",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
        backgroundImage: `
          radial-gradient(at 10% 15%, rgba(109, 129, 150, 0.18) 0px, transparent 50%),
          radial-gradient(at 90% 85%, rgba(240, 187, 187, 0.2) 0px, transparent 45%),
          radial-gradient(at 80% 20%, rgba(162, 174, 157, 0.18) 0px, transparent 50%),
          radial-gradient(at 20% 80%, rgba(255, 255, 227, 0.6) 0px, transparent 50%)
        `,
        color: "#4a4a4a",
        padding: "40px 24px 80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Top Refined Glass Navigation */}
      <header
        style={{
          width: "100%",
          maxWidth: "1080px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.8)",
          borderRadius: "16px",
          marginBottom: "40px",
          boxShadow: "0 4px 20px rgba(74, 74, 74, 0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {onBackToWelcome && (
            <button
              onClick={onBackToWelcome}
              title="Return to welcome"
              style={{
                background: "rgba(255, 255, 255, 0.6)",
                border: "1px solid #cbcbcb",
                color: "#4a4a4a",
                cursor: "pointer",
                padding: "6px 10px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                transition: "all 0.15s ease",
              }}
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <span style={{ fontSize: "1.05rem", fontWeight: "700", letterSpacing: "-0.01em", color: "#4a4a4a" }}>
            ಕಲಿ ಕನ್ನಡ <span style={{ color: "#6d8196", fontWeight: "400" }}>/ Dashboard</span>
          </span>
        </div>

        <span
          style={{
            fontSize: "0.82rem",
            color: "#6d8196",
            fontWeight: "600",
          }}
        >
          ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ
        </span>
      </header>

      {/* Hero statement */}
      <section
        style={{
          width: "100%",
          maxWidth: "1080px",
          marginBottom: "36px",
        }}
      >
        <span
          style={{
            fontSize: "0.82rem",
            fontWeight: "700",
            color: "#6d8196",
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            display: "block",
            marginBottom: "8px",
          }}
        >
          Learning Pathways
        </span>
        <h2
          style={{
            fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)",
            fontWeight: "800",
            color: "#4a4a4a",
            letterSpacing: "-0.02em",
            marginBottom: "10px",
          }}
        >
          Select an interactive pathway
        </h2>
        <p
          style={{
            fontSize: "1.02rem",
            color: "#4a4a4a",
            opacity: 0.8,
            maxWidth: "600px",
            lineHeight: "1.6",
          }}
        >
          Choose from direct translation, interactive educational games, a structured daily streak curriculum, or a hands-free conversational AI partner.
        </p>
      </section>

      {/* Pathways Grid with Frosted Glass Cards */}
      <div
        style={{
          width: "100%",
          maxWidth: "1080px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "24px",
        }}
      >
        {pathways.map((item) => (
          <div
            key={item.id}
            onClick={() => onNavigate(item.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onNavigate(item.id)}
            style={{
              background: item.glassBg,
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: `1px solid ${item.borderTone}`,
              borderRadius: "18px",
              padding: "30px 24px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "260px",
              boxShadow: "0 10px 30px rgba(74, 74, 74, 0.05)",
              transition: "all 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = `0 18px 36px rgba(74, 74, 74, 0.1)`;
              e.currentTarget.style.borderColor = item.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(74, 74, 74, 0.05)";
              e.currentTarget.style.borderColor = item.borderTone;
            }}
          >
            <div>
              {/* Header: Number and Tag */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    color: item.accent,
                    letterSpacing: "0.5px",
                  }}
                >
                  {item.number}
                </span>

                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    color: item.accent,
                    backgroundColor: item.tagBg,
                    border: `1px solid ${item.borderTone}`,
                    padding: "3px 8px",
                    borderRadius: "6px",
                  }}
                >
                  {item.tag}
                </span>
              </div>

              {/* Title & Kannada subtitle */}
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  color: "#4a4a4a",
                  marginBottom: "4px",
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-kannada)",
                  fontSize: "0.95rem",
                  color: item.accent,
                  fontWeight: "600",
                  marginBottom: "12px",
                }}
              >
                {item.kannada}
              </p>

              {/* Description */}
              <p
                style={{
                  fontSize: "0.88rem",
                  color: "#4a4a4a",
                  opacity: 0.85,
                  lineHeight: "1.55",
                }}
              >
                {item.description}
              </p>
            </div>

            {/* Bottom Arrow Indicator */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                marginTop: "24px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: item.tagBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: item.accent,
                  border: `1px solid ${item.borderTone}`,
                }}
              >
                <ArrowUpRight size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
