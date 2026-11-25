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
      accent: "#0284c7",
      bgHover: "#f0f9ff",
      borderTone: "#e2e8f0",
      tag: "Workspace",
    },
    {
      id: "games",
      number: "02",
      title: "Play Games",
      kannada: "ಭಾಷಾ ಆಟಗಳು",
      description: "Sentence formation puzzles, hidden word discovery, and Karnataka cultural trivia.",
      accent: "#ea580c",
      bgHover: "#fff7ed",
      borderTone: "#e2e8f0",
      tag: "Interactive",
    },
    {
      id: "daily_learn",
      number: "03",
      title: "Learn Kannada",
      kannada: "ದಿನದ ಕಲಿಕೆ",
      description: "Structured calendar streak, riddles (ಒಗಟು), proverbs, and situational moral lessons.",
      accent: "#15803d",
      bgHover: "#f0fdf4",
      borderTone: "#e2e8f0",
      tag: "Curriculum",
    },
    {
      id: "kannada_talk",
      number: "04",
      title: "Talk with AI",
      kannada: "ಕನ್ನಡ ಸಂಭಾಷಣೆ",
      description: "Hands-free continuous spoken dialogue partner with automatic voice detection and speech synthesis.",
      accent: "#7e22ce",
      bgHover: "#faf5ff",
      borderTone: "#e2e8f0",
      tag: "Conversational",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fcfbf9",
        color: "#0f172a",
        padding: "40px 24px 80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Top Refined Navigation */}
      <header
        style={{
          width: "100%",
          maxWidth: "1080px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "24px",
          borderBottom: "1px solid #e5e5e5",
          marginBottom: "48px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {onBackToWelcome && (
            <button
              onClick={onBackToWelcome}
              title="Return to welcome"
              style={{
                background: "transparent",
                border: "none",
                color: "#64748b",
                cursor: "pointer",
                padding: "6px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <span style={{ fontSize: "1.05rem", fontWeight: "700", letterSpacing: "-0.01em" }}>
            ಕಲಿ ಕನ್ನಡ <span style={{ color: "#94a3b8", fontWeight: "400" }}>/ Dashboard</span>
          </span>
        </div>

        <span
          style={{
            fontSize: "0.82rem",
            color: "#64748b",
            fontWeight: "500",
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
          marginBottom: "40px",
        }}
      >
        <span
          style={{
            fontSize: "0.82rem",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "1.2px",
            color: "#64748b",
            display: "block",
            marginBottom: "8px",
          }}
        >
          Select Mode
        </span>
        <h2
          style={{
            fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
            fontWeight: "800",
            letterSpacing: "-0.03em",
            color: "#0f172a",
            margin: 0,
            lineHeight: "1.2",
          }}
        >
          Explore Kannada Language
        </h2>
      </section>

      {/* Editorial List / Cards Layout */}
      <div
        style={{
          width: "100%",
          maxWidth: "1080px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
        }}
      >
        {pathways.map((item) => (
          <div
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              backgroundColor: "#ffffff",
              border: `1px solid ${item.borderTone}`,
              borderRadius: "14px",
              padding: "28px 24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              minHeight: "260px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = item.accent;
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.backgroundColor = item.bgHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = item.borderTone;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.backgroundColor = "#ffffff";
            }}
          >
            <div>
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
                    fontFamily: "monospace",
                    color: item.accent,
                  }}
                >
                  {item.number}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {item.tag}
                </span>
              </div>

              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  fontFamily: "var(--font-kannada)",
                  color: "#0f172a",
                  marginBottom: "4px",
                }}
              >
                {item.kannada}
              </div>

              <h3
                style={{
                  fontSize: "1.35rem",
                  fontWeight: "700",
                  letterSpacing: "-0.02em",
                  color: "#0f172a",
                  marginBottom: "10px",
                }}
              >
                {item.title}
              </h3>

              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#475569",
                  lineHeight: "1.55",
                  margin: 0,
                }}
              >
                {item.description}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: "16px",
                borderTop: "1px solid #f1f5f9",
                marginTop: "20px",
              }}
            >
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: item.accent,
                }}
              >
                Open
              </span>
              <ArrowUpRight size={18} color={item.accent} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
