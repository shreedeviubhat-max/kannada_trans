import React from "react";
import {
  Languages,
  Gamepad2,
  BookOpen,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Flame,
  Globe2
} from "lucide-react";

export default function MainDashboard({ onNavigate }) {
  const cards = [
    {
      id: "bhashantara",
      title: "Translate",
      kannadaTitle: "ಭಾಷಾಂತರ",
      subtitle: "Bilingual Translation Workspace",
      description: "Fast, accurate translation between Kannada & English with script, phonetic transliteration, and simple explanations.",
      themeColor: "#0284c7",
      bgColor: "#f0f9ff",
      borderColor: "#bae6fd",
      tag: "Soft Blue & Clean",
      badgeColor: "#0369a1",
      badgeBg: "#e0f2fe",
      icon: Languages,
    },
    {
      id: "games",
      title: "Play Games",
      kannadaTitle: "ಕನ್ನಡ ಆಟಗಳು",
      subtitle: "Interactive Language Puzzles",
      description: "Sentence Formation, Word Finding Puzzles, and rich Karnataka GK Trivia with live points and celebratory rewards.",
      themeColor: "#d97706",
      bgColor: "#fffbeb",
      borderColor: "#fde68a",
      tag: "Playful & Vibrant",
      badgeColor: "#b45309",
      badgeBg: "#fef3c7",
      icon: Gamepad2,
    },
    {
      id: "daily_learn",
      title: "Learn Kannada",
      kannadaTitle: "ಕನ್ನಡ ಕಲಿಕೆ",
      subtitle: "Daily Structured Learning",
      description: "Daily calendar streak, riddles (ಒಗಟು), proverbs (ಗಾದೆ ಮಾತು), situation matching, and moral fables with point progression.",
      themeColor: "#15803d",
      bgColor: "#f0fdf4",
      borderColor: "#bbf7d0",
      tag: "Warm Cream & Green",
      badgeColor: "#166534",
      badgeBg: "#dcfce7",
      icon: BookOpen,
    },
    {
      id: "kannada_talk",
      title: "Talk with AI",
      kannadaTitle: "ಕನ್ನಡ ಟಾಕ್",
      subtitle: "Spoken Kannada AI Partner",
      description: "Practice real conversations in Kannada with an empathetic AI peer tutor. Includes speech recognition and audio pronunciation.",
      themeColor: "#7c3aed",
      bgColor: "#faf5ff",
      borderColor: "#e9d5ff",
      tag: "Modern Purple & Blue",
      badgeColor: "#6b21a8",
      badgeBg: "#f3e8ff",
      icon: MessageSquare,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
        color: "#0f172a",
        padding: "32px 20px 60px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Top Header Bar */}
      <header
        style={{
          width: "100%",
          maxWidth: "1100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "24px",
          borderBottom: "1px solid #cbd5e1",
          marginBottom: "36px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #eab308 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "24px",
              boxShadow: "0 4px 14px rgba(220, 38, 38, 0.3)",
            }}
          >
            🌺
          </div>
          <div>
            <h1 style={{ fontSize: "1.45rem", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.3px", margin: 0 }}>
              ಕಲಿ ಕನ್ನಡ, ನಲಿ ಕನ್ನಡದಿ
            </h1>
            <p style={{ fontSize: "0.86rem", color: "#64748b", margin: "2px 0 0" }}>
              Kali Kannada AI • Main Dashboard
            </p>
          </div>
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            padding: "8px 16px",
            borderRadius: "9999px",
            fontSize: "0.85rem",
            fontWeight: "600",
            color: "#991b1b",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
          }}
        >
          <Sparkles size={16} color="#eab308" />
          <span>"ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ"</span>
        </div>
      </header>

      {/* Hero Welcome Text */}
      <div style={{ maxWidth: "760px", textAlign: "center", marginBottom: "42px" }}>
        <h2 style={{ fontSize: "2.1rem", fontWeight: "800", color: "#0f172a", marginBottom: "10px" }}>
          ನಿಮ್ಮ ಕಲಿಕಾ ಮಾರ್ಗವನ್ನು ಆರಿಸಿ
        </h2>
        <p style={{ fontSize: "1.05rem", color: "#475569", lineHeight: "1.6" }}>
          Select an interactive pathway below. Each feature has its own dedicated workspace and visual identity designed for an effortless learning journey.
        </p>
      </div>

      {/* 4 Feature Cards Grid */}
      <div
        className="dashboard-grid"
        style={{
          width: "100%",
          maxWidth: "1100px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "24px",
        }}
      >
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onNavigate(card.id)}
              style={{
                background: "#ffffff",
                border: `1.5px solid ${card.borderColor}`,
                borderRadius: "24px",
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                transition: "all 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = `0 16px 36px ${card.borderColor}`;
                e.currentTarget.style.borderColor = card.themeColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.05)";
                e.currentTarget.style.borderColor = card.borderColor;
              }}
            >
              {/* Card Header & Badge */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "18px",
                      background: card.bgColor,
                      border: `1px solid ${card.borderColor}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: card.themeColor,
                    }}
                  >
                    <Icon size={28} />
                  </div>
                  <span
                    style={{
                      fontSize: "0.74rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      padding: "4px 10px",
                      borderRadius: "9999px",
                      background: card.badgeBg,
                      color: card.badgeColor,
                    }}
                  >
                    {card.tag}
                  </span>
                </div>

                <div style={{ fontSize: "1.05rem", fontWeight: "700", color: card.themeColor, marginBottom: "2px" }}>
                  {card.kannadaTitle}
                </div>
                <h3 style={{ fontSize: "1.45rem", fontWeight: "800", color: "#0f172a", marginBottom: "6px" }}>
                  {card.title}
                </h3>
                <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "#64748b", marginBottom: "12px" }}>
                  {card.subtitle}
                </div>
                <p style={{ fontSize: "0.92rem", color: "#475569", lineHeight: "1.55", marginBottom: "24px" }}>
                  {card.description}
                </p>
              </div>

              {/* Bottom Action Indicator */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.94rem",
                  fontWeight: "700",
                  color: card.themeColor,
                  paddingTop: "14px",
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <span>ಪ್ರಾರಂಭಿಸಿ (Open Workspace)</span>
                <ArrowRight size={18} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
