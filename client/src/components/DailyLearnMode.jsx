import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

const DAILY_CHALLENGES = [
  {
    dayNumber: 1,
    title: "ಕನ್ನಡ ಒಗಟು (Kannada Riddle)",
    badge: "ಒಗಟು",
    question: "ಬಾಲ ಮುಟ್ಟಿದರೆ ಬಾಯಿ ತೆರೆಯುತ್ತೆ, ಕಣ್ಣಿಲ್ಲದಿದ್ದರೂ ದಾರಿ ತೋರಿಸುತ್ತೆ. ಇದು ಏನು?",
    transliteration: "Bāla muṭṭidare bāyi tereyutte, kaṇṇilladiddarū dāri tōrisutte. Idu ēnu?",
    englishHint: "Riddle: If you touch its tail it opens its mouth; it has no eyes yet cuts a path. What is it?",
    options: ["ಕತ್ತರಿ (Scissors)", "ಬೀಗ ಮತ್ತು ಕೀಲಿ (Lock & Key)", "ದೀಪ (Lamp)", "ಕನ್ನಡಿ (Mirror)"],
    correctAnswer: 0,
    explanation: "ಕತ್ತರಿ (Scissors) - ಕೈಹಿಡಿಯನ್ನು (ಬಾಲ) ಒತ್ತಿದಾಗ ಕತ್ತರಿಯ ಬಾಯಿ ತೆರೆಯುತ್ತದೆ, ಬಟ್ಟೆ ಕತ್ತರಿಸಿ ದಾರಿ ಮಾಡಿಕೊಡುತ್ತದೆ.",
  },
  {
    dayNumber: 2,
    title: "ಗಾದೆ ಮಾತು ಪೂರ್ಣಗೊಳಿಸಿ (Complete the Proverb)",
    badge: "ಗಾದೆ",
    question: "ಕೈ ಕೆಸರಾದರೆ, _________ ಗಟ್ಟಿ.",
    transliteration: "Kai kesarādare, _________ gaṭṭi.",
    englishHint: "If your hands get muddy with hard labor, the ______ will be thick.",
    options: ["ಮೊಸರು (Yogurt/Butter)", "ಹಾಲು (Milk)", "ಬೆಣ್ಣೆ (Butter)", "ಅನ್ನ (Rice)"],
    correctAnswer: 0,
    explanation: "'ಕೈ ಕೆಸರಾದರೆ ಮೊಸರು ಗಟ್ಟಿ' — ಕಷ್ಟಪಟ್ಟು ಹೊಲದಲ್ಲಿ ದುಡಿದರೆ ಮಾತ್ರ ಸುಖದ ಫಲ ಸಿಗುತ್ತದೆ.",
  },
  {
    dayNumber: 3,
    title: "ಸನ್ನಿವೇಶಕ್ಕೆ ತಕ್ಕ ಗಾದೆ (Match Proverb to Situation)",
    badge: "ಸನ್ನಿವೇಶ",
    question: "ಸನ್ನಿವೇಶ: ರಾಜು ಪರೀಕ್ಷೆಗೆ ಒಂದು ದಿನ ಮೊದಲು ಮಾತ್ರ ಓದಲು ಆರಂಭಿಸಿದ. ಮೊದಲಿನಿಂದಲೂ ಓದಿದ್ದರೆ ಸುಲಭವಾಗಿ ಉತ್ತೀರ್ಣನಾಗಬಹುದಿತ್ತು. ಇದಕ್ಕೆ ಸರಿಹೊಂದುವ ಗಾದೆ ಯಾವುದು?",
    transliteration: "Raju started studying only when exams were at the doorstep. Which proverb matches?",
    englishHint: "Preparing only after the crisis strikes.",
    options: [
      "ಮನೆಗೆ ಬೆಂಕಿ ಬಿದ್ದಾಗ ಬಾವಿ ತೋಡಿದರು (Digging a well after the house caught fire)",
      "ಹಾಸಿಗೆ ಇದ್ದಷ್ಟು ಕಾಲು ಚಾಚು (Live within means)",
      "ಕುಂಬಳಕಾಯಿ ಕಳ್ಳ ಎಂದರೆ ಹೆಗಲು ಮುಟ್ಟಿ ನೋಡಿಕೊಂಡ (Guilty conscience)",
      "ಊರಿಗೆ ಉಪಕಾರಿ, ಮನೆಗೆ ಮಾರಿ (Helpful outside, troublemaker at home)"
    ],
    correctAnswer: 0,
    explanation: "'ಮನೆಗೆ ಬೆಂಕಿ ಬಿದ್ದಾಗ ಬಾವಿ ತೋಡಿದರು' — ಕಷ್ಟ ಬಂದಾಗಲೇ ಪರಿಹಾರ ಹುಡುಕುವುದು ಮೂರ್ಖತನ, ಮೊದಲೇ ಸಿದ್ಧತೆ ಇರಬೇಕು.",
  },
  {
    dayNumber: 4,
    title: "ಕಥೆಯ ನೀತಿ (Moral of the Story)",
    badge: "ನೀತಿ",
    question: "ಸಣ್ಣ ಕಥೆ: ಕಾಗೆಯೊಂದು ಮಡಕೆಯಲ್ಲಿದ್ದ ನೀರು ಕುಡಿಯಲು ಕಲ್ಲುಗಳನ್ನು ಒಂದೊಂದಾಗಿ ತಂದು ಹಾಕಿ ನೀರು ಮೇಲಕ್ಕೆ ಬರುವಂತೆ ಮಾಡಿತು. ಈ ಕಥೆಯ ನೀತಿ ಏನು?",
    transliteration: "Story of the Thirsty Crow dropping pebbles into a pitcher.",
    englishHint: "What is the moral of the fable?",
    options: [
      "ಉಪಾಯ ಬಲ್ಲವನಿಗೆ ಅಪಾಯವಿಲ್ಲ / ಪ್ರಯತ್ನವೇ ಯಶಸ್ಸಿನ ಮೂಲ (Where there is perseverance, intelligence finds a way)",
      "ಅತಿಯಾಸೆ ಗತಿಗೇಡು (Greed leads to downfall)",
      "ದೂರದ ಬೆಟ್ಟ ಕಣ್ಣಿಗೆ ನುಣ್ಣಗೆ (Distant hills look smooth)",
      "ಕೋಪದಲ್ಲಿ ಕೊಯ್ದ ಮೂಗು ಮತ್ತೆ ಬರುವುದಿಲ್ಲ (Anger causes regret)"
    ],
    correctAnswer: 0,
    explanation: "ನೀತಿ: ಬುದ್ಧಿವಂತಿಕೆ ಮತ್ತು ಸತತ ಪ್ರಯತ್ನವಿದ್ದರೆ ಎಂತಹ ಕಠಿಣ ಸಮಸ್ಯೆಯನ್ನೂ ಪರಿಹರಿಸಬಹುದು.",
  },
  {
    dayNumber: 5,
    title: "ಕನ್ನಡ ಒಗಟು (Kannada Riddle)",
    badge: "ಒಗಟು",
    question: "ಮೇಲೆ ಹಸಿರು ಹೊದಿಕೆ, ಒಳಗೆ ಕೆಂಪು ಹಾಸಿಗೆ, ಕಪ್ಪು ಮುತ್ತುಗಳ ರಾಶಿ. ಇದು ಯಾರು?",
    transliteration: "Green coat outside, red bed inside, heap of black pearls. What fruit is this?",
    englishHint: "What fruit is this?",
    options: ["ಕಲ್ಲಂಗಡಿ ಹಣ್ಣು (Watermelon)", "ದಾಳಿಂಬೆ (Pomegranate)", "ಸೇಬು (Apple)", "ಪಪ್ಪಾಯಿ (Papaya)"],
    correctAnswer: 0,
    explanation: "ಕಲ್ಲಂಗಡಿ (Watermelon) — ಹೊರಗೆ ಹಸಿರು, ಒಳಗೆ ಕೆಂಪು ತಿರುಳು ಮತ್ತು ಕಪ್ಪು ಬೀಜಗಳು.",
  },
  {
    dayNumber: 6,
    title: "ಗಾದೆ ಪೂರ್ಣಗೊಳಿಸಿ (Complete the Proverb)",
    badge: "ಗಾದೆ",
    question: "ಹಾಸಿಗೆ ಇದ್ದಷ್ಟೇ __________ ಚಾಚು.",
    transliteration: "Hā奥行e iddaṣṭē __________ cācu.",
    englishHint: "Stretch your ______ only as far as your bed permits.",
    options: ["ಕಾಲು (Legs/Feet)", "ಕೈ (Hands)", "ಬಟ್ಟೆ (Cloth)", "ತಲೆ (Head)"],
    correctAnswer: 0,
    explanation: "'ಹಾಸಿಗೆ ಇದ್ದಷ್ಟೇ ಕಾಲು ಚಾಚು' — ನಮ್ಮ ಮಿತಿಗೆ ತಕ್ಕಂತೆ ನಾವು ಜೀವನ ನಡೆಸಬೇಕು.",
  },
  {
    dayNumber: 7,
    title: "ಸನ್ನಿವೇಶಕ್ಕೆ ತಕ್ಕ ಗಾದೆ (Match Proverb to Situation)",
    badge: "ಸನ್ನಿವೇಶ",
    question: "ಸನ್ನಿವೇಶ: ಒಬ್ಬ ವ್ಯಕ್ತಿಗೆ ಕೆಲಸ ಮಾಡಲು ಬಾರದಿದ್ದಾಗ 'ಉಪಕರಣಗಳು ಸರಿಯಿಲ್ಲ' ಎಂದು ಬೇರೆಯವರ ಮೇಲೆ ದೋಷ ಹೊರಿಸಿದ. ಇದಕ್ಕೆ ಸೂಕ್ತ ಗಾದೆ ಯಾವುದು?",
    transliteration: "A bad workman blaming his tools. Which Kannada proverb matches?",
    englishHint: "Blaming circumstances when one lacks the skill.",
    options: [
      "ಕುಣಿಯಲಾರದವಳು ನೆಲ ಡೊಂಕು ಅಂದಳಂತೆ (She who cannot dance blamed the floor)",
      "ಆಗಸಕ್ಕೆ ಏಣಿ ಹಾಕಿದ ಹಾಗೆ (Aiming impossible without effort)",
      "ಆನೆ ಸತ್ತರೂ ಸಾವಿರ ಹೊನ್ನು (Inherent value persists)",
      "ಉಪ್ಪು ತಿಂದವನು ನೀರು ಕುಡಿಯಲೇಬೇಕು (Consequences are inevitable)"
    ],
    correctAnswer: 0,
    explanation: "'ಕುಣಿಯಲಾರದವಳು ನೆಲ ಡೊಂಕು ಅಂದಳಂತೆ' — ತನಗೆ ಕೆಲಸ ಬಾರದಿದ್ದಾಗ ಸನ್ನಿವೇಶದ ಮೇಲೆ ತಪ್ಪು ಹಾಕುವುದು.",
  },
];

export default function DailyLearnMode({ onBackToHome }) {
  const [visitedDays, setVisitedDays] = useState(() => {
    try {
      const saved = localStorage.getItem("kannada_daily_visits");
      return saved ? JSON.parse(saved) : [1];
    } catch {
      return [1];
    }
  });

  const [points, setPoints] = useState(() => {
    try {
      const saved = localStorage.getItem("kannada_daily_points");
      return saved ? parseInt(saved, 10) : 50;
    } catch {
      return 50;
    }
  });

  const [activeDay, setActiveDay] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const today = new Date().getDate() % 7 || 7;
    if (!visitedDays.includes(today)) {
      const updated = [...visitedDays, today];
      setVisitedDays(updated);
      setPoints((p) => {
        const nextP = p + 20;
        localStorage.setItem("kannada_daily_points", nextP.toString());
        return nextP;
      });
      localStorage.setItem("kannada_daily_visits", JSON.stringify(updated));
    }
  }, []);

  const currentChallenge = DAILY_CHALLENGES.find((c) => c.dayNumber === activeDay) || DAILY_CHALLENGES[0];

  const handleSelectDay = (dayNum) => {
    setActiveDay(dayNum);
    setSelectedOption(null);
    setIsAnswered(false);
    setFeedback(null);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);

    if (selectedOption === currentChallenge.correctAnswer) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.75 },
        colors: ["#16a34a", "#2e7d32", "#84cc16"],
      });
      const newPts = points + 30;
      setPoints(newPts);
      localStorage.setItem("kannada_daily_points", newPts.toString());
      setFeedback({
        isCorrect: true,
        text: "ಸರಿಯಾದ ಉತ್ತರ (+30 pts)",
      });
    } else {
      setFeedback({
        isCorrect: false,
        text: "ತಪ್ಪಾದ ಉತ್ತರ. ವಿವರಣೆ ಗಮನಿಸಿ.",
      });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f7f8f6",
        backgroundImage: `
          radial-gradient(at 15% 15%, rgba(162, 174, 157, 0.28) 0px, transparent 55%),
          radial-gradient(at 85% 85%, rgba(255, 255, 227, 0.75) 0px, transparent 50%),
          radial-gradient(at 50% 50%, rgba(84, 70, 58, 0.08) 0px, transparent 60%)
        `,
        color: "#54463a",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Top Glass Header */}
      <header
        style={{
          background: "rgba(255, 255, 255, 0.78)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(162, 174, 157, 0.35)",
          padding: "16px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button
            onClick={onBackToHome}
            style={{
              background: "rgba(255, 255, 255, 0.8)",
              border: "1px solid rgba(162, 174, 157, 0.4)",
              color: "#54463a",
              padding: "7px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.85rem",
              fontWeight: "600",
            }}
          >
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>

          <div>
            <h1 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#54463a", margin: 0 }}>
              ದಿನದ ಕಲಿಕೆ <span style={{ fontWeight: "400", color: "#a2ae9d" }}>/ Learn Kannada</span>
            </h1>
          </div>
        </div>

        {/* Streak & points pill */}
        <div
          style={{
            background: "rgba(162, 174, 157, 0.25)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(162, 174, 157, 0.4)",
            padding: "6px 14px",
            borderRadius: "9999px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "0.86rem",
            fontWeight: "700",
            color: "#54463a",
          }}
        >
          <span>Day {activeDay}</span>
          <span style={{ color: "#a2ae9d" }}>•</span>
          <span>{points} pts</span>
        </div>
      </header>

      {/* Main Learning Workspace */}
      <div
        style={{
          flex: 1,
          maxWidth: "820px",
          width: "100%",
          margin: "0 auto",
          padding: "24px 16px 40px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Weekly Day Strip (Glassmorphism & Palette B) */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            paddingBottom: "4px",
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7].map((day) => {
            const isVisited = visitedDays.includes(day);
            const isSelected = activeDay === day;
            return (
              <button
                key={day}
                onClick={() => handleSelectDay(day)}
                style={{
                  flex: "1 1 0",
                  minWidth: "70px",
                  background: isSelected
                    ? "#54463a"
                    : isVisited
                    ? "rgba(162, 174, 157, 0.28)"
                    : "rgba(255, 255, 255, 0.72)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  color: isSelected ? "#ffffe3" : "#54463a",
                  border: isSelected
                    ? "1.5px solid #54463a"
                    : "1px solid rgba(162, 174, 157, 0.4)",
                  borderRadius: "12px",
                  padding: "10px 8px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "2px",
                  transition: "all 0.15s",
                  boxShadow: "0 4px 14px rgba(84, 70, 58, 0.04)",
                }}
              >
                <span style={{ fontSize: "0.72rem", textTransform: "uppercase", fontWeight: "600" }}>
                  Day {day}
                </span>
                <span style={{ fontSize: "0.98rem", fontWeight: "700" }}>
                  {isVisited ? "✓" : `•`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Challenge Card (Frosted Glass Panel) */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.78)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(162, 174, 157, 0.35)",
            borderRadius: "18px",
            padding: "30px",
            boxShadow: "0 8px 30px rgba(84, 70, 58, 0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <span
              style={{
                fontSize: "0.76rem",
                fontWeight: "700",
                color: "#54463a",
                background: "rgba(162, 174, 157, 0.3)",
                border: "1px solid rgba(162, 174, 157, 0.45)",
                padding: "3px 10px",
                borderRadius: "6px",
                textTransform: "uppercase",
              }}
            >
              {currentChallenge.badge}
            </span>
            <span style={{ fontSize: "0.85rem", color: "#a2ae9d", fontWeight: "600" }}>
              Day {activeDay} Curriculum
            </span>
          </div>

          <h2 style={{ fontSize: "1.18rem", fontWeight: "700", color: "#54463a", marginBottom: "8px" }}>
            {currentChallenge.title}
          </h2>

          <div
            style={{
              background: "rgba(255, 255, 227, 0.65)",
              borderLeft: "3.5px solid #a2ae9d",
              padding: "16px 18px",
              borderRadius: "0 10px 10px 0",
              fontSize: "1.05rem",
              color: "#54463a",
              fontWeight: "600",
              lineHeight: "1.6",
              marginBottom: "8px",
            }}
          >
            {currentChallenge.question}
          </div>

          <p style={{ fontSize: "0.86rem", color: "#54463a", opacity: 0.75, fontStyle: "italic", marginBottom: "22px" }}>
            {currentChallenge.englishHint}
          </p>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "22px" }}>
            {currentChallenge.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentChallenge.correctAnswer;

              let border = "#e2e8f0";
              let bg = "#ffffff";
              let col = "#1e293b";

              if (isAnswered) {
                if (isCorrect) {
                  border = "#22c55e";
                  bg = "#f0fdf4";
                  col = "#15803d";
                } else if (isSelected && !isCorrect) {
                  border = "#ef4444";
                  bg = "#fef2f2";
                  col = "#b91c1c";
                }
              } else if (isSelected) {
                border = "#15803d";
                bg = "#f0fdf4";
              }

              return (
                <button
                  key={idx}
                  onClick={() => !isAnswered && setSelectedOption(idx)}
                  disabled={isAnswered}
                  style={{
                    background: bg,
                    border: `1.5px solid ${border}`,
                    color: col,
                    borderRadius: "8px",
                    padding: "14px 16px",
                    textAlign: "left",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    cursor: isAnswered ? "default" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrect && <CheckCircle2 size={18} color="#16a34a" />}
                </button>
              );
            })}
          </div>

          {!isAnswered ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              style={{
                background: selectedOption !== null ? "#15803d" : "#f1f5f9",
                color: selectedOption !== null ? "#ffffff" : "#94a3b8",
                border: "none",
                borderRadius: "8px",
                padding: "10px 22px",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: selectedOption !== null ? "pointer" : "not-allowed",
              }}
            >
              Submit Answer
            </button>
          ) : (
            <div
              style={{
                padding: "14px 16px",
                borderRadius: "8px",
                background: feedback?.isCorrect ? "#f0fdf4" : "#fef2f2",
                border: feedback?.isCorrect ? "1px solid #bbf7d0" : "1px solid #fecaca",
                color: "#334155",
                fontSize: "0.88rem",
              }}
            >
              <div style={{ fontWeight: "700", color: feedback?.isCorrect ? "#15803d" : "#b91c1c", marginBottom: "4px" }}>
                {feedback?.text}
              </div>
              <div style={{ lineHeight: "1.5" }}>{currentChallenge.explanation}</div>

              <button
                onClick={() => handleSelectDay((activeDay % 7) + 1)}
                style={{
                  marginTop: "12px",
                  background: "#15803d",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 14px",
                  fontSize: "0.82rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span>Next Day</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
