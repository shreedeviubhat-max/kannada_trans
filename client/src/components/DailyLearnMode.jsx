import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Calendar,
  Trophy,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  BookOpen,
  Award,
  ChevronRight,
  Flame,
  GraduationCap
} from "lucide-react";

const DAILY_CHALLENGES = [
  {
    dayNumber: 1,
    title: "ದಿನ ೧: ಕನ್ನಡ ಒಗಟು (Kannada Riddle)",
    typeBadge: "ಒಗಟು (Riddle)",
    question: "ಬಾಲ ಮುಟ್ಟಿದರೆ ಬಾಯಿ ತೆರೆಯುತ್ತೆ, ಕಣ್ಣಿಲ್ಲದಿದ್ದರೂ ದಾರಿ ತೋರಿಸುತ್ತೆ. ಇದು ಏನು?",
    transliteration: "Bāla muṭṭidare bāyi tereyutte, kaṇṇilladiddarū dāri tōrisutte. Idu ēnu?",
    englishHint: "Riddle: If you touch its tail it opens its mouth; it has no eyes yet cuts a path. What is it?",
    options: ["ಕತ್ತರಿ (Scissors)", "ಬೀಗ ಮತ್ತು ಕೀಲಿ (Lock & Key)", "ದೀಪ (Lamp)", "ಕನ್ನಡಿ (Mirror)"],
    correctAnswer: 0,
    explanation: "ಕತ್ತರಿ (Scissors) - ಕೈಹಿಡಿಯನ್ನು (ಬಾಲ) ಒತ್ತಿದಾಗ ಕತ್ತರಿಯ ಬಾಯಿ ತೆರೆಯುತ್ತದೆ, ಬಟ್ಟೆ ಕತ್ತರಿಸಿ ದಾರಿ ಮಾಡಿಕೊಡುತ್ತದೆ.",
  },
  {
    dayNumber: 2,
    title: "ದಿನ ೨: ಗಾದೆ ಮಾತು ಪೂರ್ಣಗೊಳಿಸಿ (Complete the Proverb)",
    typeBadge: "ಗಾದೆ ಪೂರ್ಣಗೊಳಿಸಿ (Proverb)",
    question: "ಕೈ ಕೆಸರಾದರೆ, _________ ಗಟ್ಟಿ.",
    transliteration: "Kai kesarādare, _________ gaṭṭi.",
    englishHint: "If your hands get muddy with hard labor, the ______ will be thick and solid.",
    options: ["ಮೊಸರು (Yogurt/Butter)", "ಹಾಲು (Milk)", "ಬೆಣ್ಣೆ (Butter)", "ಅನ್ನ (Rice)"],
    correctAnswer: 0,
    explanation: "'ಕೈ ಕೆಸರಾದರೆ ಮೊಸರು ಗಟ್ಟಿ' — ಕಷ್ಟಪಟ್ಟು ಹೊಲದಲ್ಲಿ ದುಡಿದರೆ ಮಾತ್ರ ಸುಖದ ಫಲ (ಮೊಸರು/ಊಟ) ಸಿಗುತ್ತದೆ. ಕಾಯಕವೇ ಕೈಲಾಸ.",
  },
  {
    dayNumber: 3,
    title: "ದಿನ ೩: ಸನ್ನಿವೇಶಕ್ಕೆ ತಕ್ಕ ಗಾದೆ (Match Proverb to Situation)",
    typeBadge: "ಸನ್ನಿವೇಶ & ಗಾದೆ (Context Match)",
    question: "ಸನ್ನಿವೇಶ: ರಾಜು ಪರೀಕ್ಷೆಗೆ ಒಂದು ದಿನ ಮೊದಲು ಮಾತ್ರ ಓದಲು ಆರಂಭಿಸಿದ. ಮೊದಲಿನಿಂದಲೂ ಓದಿದ್ದರೆ ಸುಲಭವಾಗಿ ಉತ್ತೀರ್ಣನಾಗಬಹುದಿತ್ತು. ಇದಕ್ಕೆ ಸರಿಹೊಂದುವ ಗಾದೆ ಯಾವುದು?",
    transliteration: "Situation: Raju started studying only one day before exams when disaster struck. Which proverb fits?",
    englishHint: "Starting preparation only after the crisis strikes. Which proverb matches?",
    options: [
      "ಮನೆಗೆ ಬೆಂಕಿ ಬಿದ್ದಾಗ ಬಾವಿ ತೋಡಿದರು (Digging a well after the house caught fire)",
      "ಹಾಸಿಗೆ ಇದ್ದಷ್ಟು ಕಾಲು ಚಾಚು (Stretch feet only as long as the mat)",
      "ಕುಂಬಳಕಾಯಿ ಕಳ್ಳ ಎಂದರೆ ಹೆಗಲು ಮುಟ್ಟಿ ನೋಡಿಕೊಂಡ (Guilty conscience)",
      "ಊರಿಗೆ ಉಪಕಾರಿ, ಮನೆಗೆ ಮಾರಿ (Helpful outside, troublemaker at home)"
    ],
    correctAnswer: 0,
    explanation: "'ಮನೆಗೆ ಬೆಂಕಿ ಬಿದ್ದಾಗ ಬಾವಿ ತೋಡಿದರು' — ಕಷ್ಟ ಬಂದಾಗಲೇ ತುರ್ತಾಗಿ ಪರಿಹಾರ ಹುಡುಕಲು ಹೊರಡುವುದು ಮೂರ್ಖತನ, ಮೊದಲೇ ಸಿದ್ಧತೆ ಮಾಡಿಕೊಳ್ಳಬೇಕು.",
  },
  {
    dayNumber: 4,
    title: "ದಿನ ೪: ಕಥೆಯ ನೀತಿ ಬರೆಯಿರಿ (Moral of the Story)",
    typeBadge: "ಕಥೆಯ ನೀತಿ (Moral)",
    question: "ಸಣ್ಣ ಕಥೆ: ಕಾಗೆಯೊಂದು ಮಡಕೆಯಲ್ಲಿದ್ದ ನೀರು ಕುಡಿಯಲು ಕಲ್ಲುಗಳನ್ನು ಒಂದೊಂದಾಗಿ ತಂದು ಹಾಕಿ ನೀರು ಮೇಲಕ್ಕೆ ಬರುವಂತೆ ಮಾಡಿತು. ಈ ಕಥೆಯ ನೀತಿ ಏನು?",
    transliteration: "Story of the Thirsty Crow dropping pebbles into a pitcher until water rose. What is the moral?",
    englishHint: "What is the moral lesson of the thirsty crow fable?",
    options: [
      "ಉಪಾಯ ಬಲ್ಲವನಿಗೆ ಅಪಾಯವಿಲ್ಲ / ಪ್ರಯತ್ನವೇ ಯಶಸ್ಸಿನ ಮೂಲ (Where there is perseverance, intelligence finds a way)",
      "ಅತಿಯಾಸೆ ಗತಿಗೇಡು (Greed leads to ruin)",
      "ದೂರದ ಬೆಟ್ಟ ಕಣ್ಣಿಗೆ ನುಣ್ಣಗೆ (Distant hills look smooth)",
      "ಕೋಪದಲ್ಲಿ ಕೊಯ್ದ ಮೂಗು ಮತ್ತೆ ಬರುವುದಿಲ್ಲ (Decisions made in anger bring regret)"
    ],
    correctAnswer: 0,
    explanation: "ನೀತಿ: ಬುದ್ಧಿವಂತಿಕೆ ಮತ್ತು ಸತತ ಪ್ರಯತ್ನವಿದ್ದರೆ ಎಂತಹ ಕಠಿಣ ಸಮಸ್ಯೆಯನ್ನೂ ಪರಿಹರಿಸಬಹುದು.",
  },
  {
    dayNumber: 5,
    title: "ದಿನ ೫: ಕನ್ನಡ ಒಗಟು (Kannada Riddle)",
    typeBadge: "ಒಗಟು (Riddle)",
    question: "ಮೇಲೆ ಹಸಿರು ಹೊದಿಕೆ, ಒಳಗೆ ಕೆಂಪು ಹಾಸಿಗೆ, ಕಪ್ಪು ಮುತ್ತುಗಳ ರಾಶಿ. ಇದು ಯಾರು?",
    transliteration: "Mēle hasiru hodike, oḷage kempu hāsige, kappu muttugaḷa rāśi. Idu yāru?",
    englishHint: "Green blanket on the outside, red bed inside, heap of black pearls. What fruit is this?",
    options: ["ಕಲ್ಲಂಗಡಿ ಹಣ್ಣು (Watermelon)", "ದಾಳಿಂಬೆ (Pomegranate)", "ಸೇಬು (Apple)", "ಪಪ್ಪಾಯಿ (Papaya)"],
    correctAnswer: 0,
    explanation: "ಕಲ್ಲಂಗಡಿ (Watermelon) — ಹೊರಗೆ ಹಸಿರು, ಒಳಗೆ ಕೆಂಪು ತಿರುಳು ಮತ್ತು ಕಪ್ಪು ಬೀಜಗಳು.",
  },
  {
    dayNumber: 6,
    title: "ದಿನ ೬: ಗಾದೆ ಪೂರ್ಣಗೊಳಿಸಿ (Complete the Proverb)",
    typeBadge: "ಗಾದೆ ಪೂರ್ಣಗೊಳಿಸಿ (Proverb)",
    question: "ಹಾಸಿಗೆ ಇದ್ದಷ್ಟೇ __________ ಚಾಚು.",
    transliteration: "Hā奥行e iddaṣṭē __________ cācu.",
    englishHint: "Stretch your ______ only as far as your bed/mat permits.",
    options: ["ಕಾಲು (Legs/Feet)", "ಕೈ (Hands)", "ಬಟ್ಟೆ (Cloth)", "ತಲೆ (Head)"],
    correctAnswer: 0,
    explanation: "'ಹಾಸಿಗೆ ಇದ್ದಷ್ಟೇ ಕಾಲು ಚಾಚು' — ನಮ್ಮ ಆದಾಯ ಹಾಗೂ ಮಿತಿಗೆ ತಕ್ಕಂತೆ ನಾವು ಖರ್ಚು ಮಾಡಬೇಕು, ಜೀವನ ನಡೆಸಬೇಕು.",
  },
  {
    dayNumber: 7,
    title: "ದಿನ ೭: ಸನ್ನಿವೇಶಕ್ಕೆ ತಕ್ಕ ಗಾದೆ (Match Proverb to Situation)",
    typeBadge: "ಸನ್ನಿವೇಶ & ಗಾದೆ (Context Match)",
    question: "ಸನ್ನಿವೇಶ: ಒಬ್ಬ ವ್ಯಕ್ತಿಗೆ ಕೆಲಸ ಮಾಡಲು ಬಾರದಿದ್ದಾಗ 'ಉಪಕರಣಗಳು ಸರಿಯಿಲ್ಲ' ಎಂದು ಬೇರೆಯವರ ಮೇಲೆ ದೋಷ ಹೊರಿಸಿದ. ಇದಕ್ಕೆ ಸೂಕ್ತ ಗಾದೆ ಯಾವುದು?",
    transliteration: "A bad workman blaming his tools. Which Kannada proverb matches?",
    englishHint: "Blaming circumstances when one lacks the skill. Which proverb fits?",
    options: [
      "ಕುಣಿಯಲಾರದವಳು ನೆಲ ಡೊಂಕು ಅಂದಳಂತೆ (She who cannot dance blamed the floor)",
      "ಆಗಸಕ್ಕೆ ಏಣಿ ಹಾಕಿದ ಹಾಗೆ (Aiming for impossible without effort)",
      "ಆನೆ ಸತ್ತರೂ ಸಾವಿರ ಹೊನ್ನು (Inherent value persists)",
      "ಉಪ್ಪು ತಿಂದವನು ನೀರು ಕುಡಿಯಲೇಬೇಕು (Consequences are inevitable)"
    ],
    correctAnswer: 0,
    explanation: "'ಕುಣಿಯಲಾರದವಳು ನೆಲ ಡೊಂಕು ಅಂದಳಂತೆ' — ತನಗೆ ಕೆಲಸ ಮಾಡಲು ಬಾರದಿದ್ದಾಗ ಬೇರೆಯವರ ಮೇಲೆ ಅಥವಾ ಸನ್ನಿವೇಶದ ಮೇಲೆ ತಪ್ಪು ಹಾಕುವುದು.",
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
        particleCount: 60,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#16a34a", "#ca8a04", "#059669"],
      });
      const newPts = points + 30;
      setPoints(newPts);
      localStorage.setItem("kannada_daily_points", newPts.toString());
      setFeedback({
        isCorrect: true,
        text: "ಅದ್ಭುತ! ಸರಿಯಾದ ಉತ್ತರ! (+30 Points ಗಳಿಸಿದ್ದೀರಿ)",
      });
    } else {
      setFeedback({
        isCorrect: false,
        text: "ತಪ್ಪಾದ ಉತ್ತರ. ಕೆಳಗಿನ ವಿವರಣೆಯನ್ನು ಗಮನಿಸಿ ಕಲಿಯಿರಿ!",
      });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fefce8 0%, #f0fdf4 50%, #fef9c3 100%)",
        color: "#1e293b",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Top Header */}
      <header
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #bbf7d0",
          padding: "16px 24px",
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
              background: "#ffffff",
              border: "1px solid #bbf7d0",
              color: "#15803d",
              padding: "8px 14px",
              borderRadius: "12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.88rem",
              fontWeight: "600",
              boxShadow: "0 2px 6px rgba(22, 163, 74, 0.08)",
            }}
          >
            <ArrowLeft size={16} />
            <span>ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ (Dashboard)</span>
          </button>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <BookOpen size={22} color="#15803d" />
              <h1 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#14532d", margin: 0 }}>
                ಕನ್ನಡ ಕಲಿಕೆ (Learn Kannada)
              </h1>
            </div>
            <p style={{ fontSize: "0.78rem", color: "#16a34a", margin: "2px 0 0" }}>
              Warm Cream & Green Theme • Daily Calendar, Riddles & Moral Stories
            </p>
          </div>
        </div>

        {/* Streak & Points Badge */}
        <div
          style={{
            background: "#ffffff",
            border: "1.5px solid #86efac",
            padding: "8px 18px",
            borderRadius: "9999px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "0.92rem",
            fontWeight: "800",
            color: "#166534",
            boxShadow: "0 4px 14px rgba(22, 163, 74, 0.12)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Flame size={18} color="#ea580c" />
            <span>{visitedDays.length} Days Streak</span>
          </div>
          <div style={{ width: "1px", height: "16px", background: "#cbd5e1" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Trophy size={18} color="#ca8a04" />
            <span>{points} pts</span>
          </div>
        </div>
      </header>

      {/* Main Learning Workspace */}
      <div
        style={{
          flex: 1,
          maxWidth: "960px",
          width: "100%",
          margin: "0 auto",
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Weekly Calendar Strip */}
        <div
          style={{
            background: "#ffffff",
            border: "2px solid #bbf7d0",
            borderRadius: "20px",
            padding: "20px 24px",
            boxShadow: "0 6px 20px rgba(22, 163, 74, 0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1rem", fontWeight: 800, color: "#14532d" }}>
              <Calendar size={20} color="#15803d" />
              <span>ವಾರದ ಕಲಿಕಾ ಕ್ಯಾಲೆಂಡರ್ (Daily Check-in & Point Rewards)</span>
            </div>
            <span style={{ fontSize: "0.82rem", color: "#15803d", fontWeight: 600 }}>
              Visit daily to earn +20 streak points & unlock new challenges!
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "10px",
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
                    background: isSelected
                      ? "linear-gradient(135deg, #15803d 0%, #166534 100%)"
                      : isVisited
                      ? "#f0fdf4"
                      : "#ffffff",
                    color: isSelected ? "#ffffff" : isVisited ? "#15803d" : "#94a3b8",
                    border: isSelected
                      ? "2px solid #14532d"
                      : isVisited
                      ? "1.5px solid #86efac"
                      : "1.5px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "12px 6px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                    transition: "all 0.18s",
                    boxShadow: isSelected ? "0 4px 12px rgba(22, 163, 74, 0.3)" : "none",
                  }}
                >
                  <span style={{ fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700 }}>
                    ದಿನ {day}
                  </span>
                  <span style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                    {isVisited ? "✓" : `Day ${day}`}
                  </span>
                  <span style={{ fontSize: "0.7rem", opacity: 0.9, fontWeight: 600 }}>
                    {isVisited ? "+20 pts" : "Unlock"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Challenge Card */}
        <div
          style={{
            background: "#ffffff",
            border: "2px solid #bbf7d0",
            borderRadius: "24px",
            padding: "28px",
            boxShadow: "0 8px 30px rgba(22, 163, 74, 0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <span
              style={{
                background: "#dcfce7",
                color: "#15803d",
                border: "1px solid #86efac",
                borderRadius: "9999px",
                padding: "4px 14px",
                fontSize: "0.82rem",
                fontWeight: 800,
              }}
            >
              {currentChallenge.typeBadge}
            </span>
            <span style={{ fontSize: "0.84rem", color: "#166534", fontWeight: 600 }}>
              ಸವಾಲು (Challenge) #{activeDay} of 7
            </span>
          </div>

          <h2 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#14532d", marginBottom: "8px" }}>
            {currentChallenge.title}
          </h2>

          <div
            style={{
              background: "#f0fdf4",
              border: "1.5px solid #bbf7d0",
              borderRadius: "16px",
              padding: "18px 22px",
              fontSize: "1.12rem",
              color: "#166534",
              fontWeight: "700",
              lineHeight: "1.6",
              marginBottom: "10px",
            }}
          >
            {currentChallenge.question}
          </div>

          <p style={{ fontSize: "0.88rem", color: "#475569", fontStyle: "italic", marginBottom: "22px" }}>
            {currentChallenge.englishHint}
          </p>

          {/* Options List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "22px" }}>
            {currentChallenge.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentChallenge.correctAnswer;

              let bg = "#ffffff";
              let border = "#e2e8f0";
              let col = "#1e293b";

              if (isAnswered) {
                if (isCorrect) {
                  bg = "#dcfce7";
                  border = "#22c55e";
                  col = "#15803d";
                } else if (isSelected && !isCorrect) {
                  bg = "#fef2f2";
                  border = "#ef4444";
                  col = "#b91c1c";
                }
              } else if (isSelected) {
                border = "#16a34a";
                bg = "#f0fdf4";
              }

              return (
                <button
                  key={idx}
                  onClick={() => !isAnswered && setSelectedOption(idx)}
                  disabled={isAnswered}
                  style={{
                    background: bg,
                    border: `2px solid ${border}`,
                    color: col,
                    borderRadius: "14px",
                    padding: "16px 20px",
                    textAlign: "left",
                    fontSize: "1rem",
                    fontWeight: 600,
                    cursor: isAnswered ? "default" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.15s",
                  }}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrect && <CheckCircle2 size={20} color="#16a34a" />}
                </button>
              );
            })}
          </div>

          {!isAnswered ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              style={{
                background: "linear-gradient(135deg, #15803d 0%, #166534 100%)",
                border: "none",
                color: "#ffffff",
                borderRadius: "12px",
                padding: "12px 28px",
                fontWeight: "800",
                fontSize: "1rem",
                cursor: selectedOption === null ? "not-allowed" : "pointer",
                opacity: selectedOption === null ? 0.5 : 1,
                boxShadow: "0 4px 14px rgba(22, 163, 74, 0.3)",
              }}
            >
              ಉತ್ತರ ಸಲ್ಲಿಸಿ (Submit Answer)
            </button>
          ) : (
            <div
              style={{
                padding: "18px 22px",
                borderRadius: "16px",
                background: feedback?.isCorrect ? "#f0fdf4" : "#fef2f2",
                border: feedback?.isCorrect ? "1.5px solid #86efac" : "1.5px solid #fca5a5",
              }}
            >
              <div style={{ fontWeight: 800, color: feedback?.isCorrect ? "#15803d" : "#b91c1c", marginBottom: "8px", fontSize: "1.05rem" }}>
                {feedback?.text}
              </div>
              <div style={{ color: "#334155", fontSize: "0.92rem", lineHeight: "1.55" }}>
                <strong>ವಿವರಣೆ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ನೀತಿ:</strong> {currentChallenge.explanation}
              </div>
              <button
                onClick={() => handleSelectDay((activeDay % 7) + 1)}
                style={{
                  marginTop: "14px",
                  background: "#15803d",
                  border: "none",
                  color: "#ffffff",
                  padding: "8px 18px",
                  borderRadius: "10px",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 2px 8px rgba(22, 163, 74, 0.2)",
                }}
              >
                <span>ಮುಂದಿನ ದಿನದ ಸವಾಲು (Next Day)</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
