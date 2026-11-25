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
  Flame
} from "lucide-react";

// Curated daily lessons covering:
// 1. ಒಗಟು (Kannada Riddle)
// 2. ಗಾದೆ ಪೂರ್ಣಗೊಳಿಸಿ (Complete the Proverb)
// 3. ಸನ್ನಿವೇಶಕ್ಕೆ ತಕ್ಕ ಗಾದೆ (Match Proverb to Situation)
// 4. ಕಥೆಯ ನೀತಿ (Moral of the Story)
const DAILY_CHALLENGES = [
  {
    dayNumber: 1,
    title: "ದಿನ ೧: ಕನ್ನಡ ಒಗಟು (Kannada Riddle)",
    type: "ogatu",
    typeBadge: "ಒಗಟು (Riddle)",
    question: "ಬಾಲ ಮುಟ್ಟಿದರೆ ಬಾಯಿ ತೆರೆಯುತ್ತೆ, ಕಣ್ಣಿಲ್ಲದಿದ್ದರೂ ದಾರಿ ತೋರಿಸುತ್ತೆ. ಇದು ಏನು?",
    transliteration: "Bāla muṭṭidare bāyi tereyutte, kaṇṇilladiddarū dāri tōrisutte. Idu ēnu?",
    englishHint: "Riddle: If you touch its tail it opens its mouth; it has no eyes yet shows you the way. What is it?",
    options: ["ಕತ್ತರಿ (Scissors)", "ಬೀಗ ಮತ್ತು ಕೀಲಿ (Lock & Key)", "ದೀಪ (Lamp)", "ಕನ್ನಡಿ (Mirror)"],
    correctAnswer: 0,
    explanation: "ಕತ್ತರಿ (Scissors) - ಕೈಹಿಡಿಯನ್ನು (ಬಾಲ) ಒತ್ತಿದಾಗ ಕತ್ತರಿಯ ಬಾಯಿ ತೆರೆಯುತ್ತದೆ, ಬಟ್ಟೆ ಕತ್ತರಿಸಿ ದಾರಿ ಮಾಡಿಕೊಡುತ್ತದೆ.",
  },
  {
    dayNumber: 2,
    title: "ದಿನ ೨: ಗಾದೆ ಮಾತು ಪೂರ್ಣಗೊಳಿಸಿ (Complete the Proverb)",
    type: "gade_fill",
    typeBadge: "ಗಾದೆ ಪೂರ್ಣಗೊಳಿಸಿ (Proverb)",
    question: "ಕೈ ಕೆಸರಾದರೆ, _________ ಗಟ್ಟಿ.",
    transliteration: "Kai kesarādare, _________ gaṭṭi.",
    englishHint: "If your hands get muddy (with hard work), the ______ will be thick/solid.",
    options: ["ಮೊಸರು (Yogurt/Butter)", "ಹಾಲು (Milk)", "ಬೆಣ್ಣೆ (Butter)", "ಅನ್ನ (Rice)"],
    correctAnswer: 0,
    explanation: "'ಕೈ ಕೆಸರಾದರೆ ಮೊಸರು ಗಟ್ಟಿ' — ಕಷ್ಟಪಟ್ಟು ಹೊಲದಲ್ಲಿ ದುಡಿದರೆ ಮಾತ್ರ ಸುಖದ ಫಲ (ಮೊಸರು/ಊಟ) ಸಿಗುತ್ತದೆ. ಕಾಯಕವೇ ಕೈಲಾಸ.",
  },
  {
    dayNumber: 3,
    title: "ದಿನ ೩: ಸನ್ನಿವೇಶಕ್ಕೆ ತಕ್ಕ ಗಾದೆ (Match Proverb to Situation)",
    type: "situation_gade",
    typeBadge: "ಸನ್ನಿವೇಶ & ಗಾದೆ (Context Match)",
    question: "ಸನ್ನಿವೇಶ: ರಾಜು ಪರೀಕ್ಷೆಗೆ ಒಂದು ದಿನ ಮೊದಲು ಮಾತ್ರ ಓದಲು ಆರಂಭಿಸಿದ. ಮೊದಲಿನಿಂದಲೂ ಓದಿದ್ದರೆ ಸುಲಭವಾಗಿ ಉತ್ತೀರ್ಣನಾಗಬಹುದಿತ್ತು. ಇದಕ್ಕೆ ಸರಿಹೊಂದುವ ಗಾದೆ ಯಾವುದು?",
    transliteration: "Situation: Raju started studying only one day before exams. Which Kannada proverb fits this situation best?",
    englishHint: "Raju started studying at the last second when disaster arrived. Which proverb matches?",
    options: [
      "ಮನೆಗೆ ಬೆಂಕಿ ಬಿದ್ದಾಗ ಬಾವಿ ತೋಡಿದರು (Digging a well after the house caught fire)",
      "ಹಾಸಿಗೆ ಇದ್ದಷ್ಟು ಕಾಲು ಚಾಚು (Stretch feet only as long as the mat)",
      "ಕುಂಬಳಕಾಯಿ ಕಳ್ಳ ಎಂದರೆ ಹೆಗಲು ಮುಟ್ಟಿ ನೋಡಿಕೊಂಡ (Touching shoulder when pumpkin thief is mentioned)",
      "ಊರಿಗೆ ಉಪಕಾರಿ, ಮನೆಗೆ ಮಾರಿ (Helpful to the village, plague to home)"
    ],
    correctAnswer: 0,
    explanation: "'ಮನೆಗೆ ಬೆಂಕಿ ಬಿದ್ದಾಗ ಬಾವಿ ತೋಡಿದರು' — ಕಷ್ಟ ಬಂದಾಗಲೇ ತುರ್ತಾಗಿ ಪರಿಹಾರ ಹುಡುಕಲು ಹೊರಡುವುದು ಮೂರ್ಖತನ, ಮೊದಲೇ ಸಿದ್ಧತೆ ಮಾಡಿಕೊಳ್ಳಬೇಕು.",
  },
  {
    dayNumber: 4,
    title: "ದಿನ ೪: ಕಥೆಯ ನೀತಿ ಬರೆಯಿರಿ (Moral of the Story)",
    type: "neeti",
    typeBadge: "ಕಥೆಯ ನೀತಿ (Moral)",
    question: "ಸಣ್ಣ ಕಥೆ: ಕಾಗೆಯೊಂದು ಮಡಕೆಯಲ್ಲಿದ್ದ ನೀರು ಕುಡಿಯಲು ಕಲ್ಲುಗಳನ್ನು ಒಂದೊಂದಾಗಿ ತಂದು ಹಾಕಿ ನೀರು ಮೇಲಕ್ಕೆ ಬರುವಂತೆ ಮಾಡಿತು. ಈ ಕಥೆಯ ನೀತಿ ಏನು?",
    transliteration: "Story of the Thirsty Crow dropping pebbles into a pitcher until the water rose. What is the moral?",
    englishHint: "What is the moral of the thirsty crow fable?",
    options: [
      "ಉಪಾಯ ಬಲ್ಲವನಿಗೆ ಅಪಾಯವಿಲ್ಲ / ಪ್ರಯತ್ನವೇ ಯಶಸ್ಸಿನ ಮೂಲ (Where there is a will, intelligence finds a way)",
      "ಅತಿಯಾಸೆ ಗತಿಗೇಡು (Greed leads to downfall)",
      "ದೂರದ ಬೆಟ್ಟ ಕಣ್ಣಿಗೆ ನುಣ್ಣಗೆ (Distant hills look smooth)",
      "ಕೋಪದಲ್ಲಿ ಕೊಯ್ದ ಮೂಗು ಮತ್ತೆ ಬರುವುದಿಲ್ಲ (A nose cut in anger never returns)"
    ],
    correctAnswer: 0,
    explanation: "ನೀತಿ: ಬುದ್ಧಿವಂತಿಕೆ ಮತ್ತು ಸತತ ಪ್ರಯತ್ನವಿದ್ದರೆ ಎಂತಹ ಕಠಿಣ ಸಮಸ್ಯೆಯನ್ನೂ ಪರಿಹರಿಸಬಹುದು. (Where there is perseverance and clever thought, obstacles disappear).",
  },
  {
    dayNumber: 5,
    title: "ದಿನ ೫: ಕನ್ನಡ ಒಗಟು (Kannada Riddle)",
    type: "ogatu",
    typeBadge: "ಒಗಟು (Riddle)",
    question: "ಮೇಲೆ ಹಸಿರು ಹೊದಿಕೆ, ಒಳಗೆ ಕೆಂಪು ಹಾಸಿಗೆ, ಕಪ್ಪು ಮುತ್ತುಗಳ ರಾಶಿ. ಇದು ಯಾರು?",
    transliteration: "Mēle hasiru hodike, oḷage kempu hāsige, kappu muttugaḷa rāśi. Idu yāru?",
    englishHint: "Green blanket on top, red bed inside, heap of black pearls. What fruit is this?",
    options: ["ಕಲ್ಲಂಗಡಿ ಹಣ್ಣು (Watermelon)", "ದಾಳಿಂಬೆ (Pomegranate)", "ಸೇಬು (Apple)", "ಪಪ್ಪಾಯಿ (Papaya)"],
    correctAnswer: 0,
    explanation: "ಕಲ್ಲಂಗಡಿ (Watermelon) — ಹೊರಗೆ ಹಸಿರು, ಒಳಗೆ ಕೆಂಪು ತಿರುಳು ಮತ್ತು ಕಪ್ಪು ಬೀಜಗಳು.",
  },
  {
    dayNumber: 6,
    title: "ದಿನ ೬: ಗಾದೆ ಪೂರ್ಣಗೊಳಿಸಿ (Complete the Proverb)",
    type: "gade_fill",
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
    type: "situation_gade",
    typeBadge: "ಸನ್ನಿವೇಶ & ಗಾದೆ (Context Match)",
    question: "ಸನ್ನಿವೇಶ: ಒಬ್ಬ ವ್ಯಕ್ತಿಗೆ ಸಂಗೀತ ಕಲಿಯುವ ಇಷ್ಟವಿರಲಿಲ್ಲ. ಆದರೆ 'ಗುರುಗಳು ಸರಿಯಾಗಿ ಹಾಡುತ್ತಿಲ್ಲ, ಕೊಠಡಿ ಸರಿಯಿಲ್ಲ' ಎಂದು ಇತರರ ಮೇಲೆ ದೋಷ ಹೊರಿಸಿದ. ಇದಕ್ಕೆ ಸೂಕ್ತ ಗಾದೆ ಯಾವುದು?",
    transliteration: "A person blames the room and instruments when they don't know how to perform. Which proverb matches?",
    englishHint: "A bad workman blames his tools. In Kannada?",
    options: [
      "ಕುಣಿಯಲಾರದವಳು ನೆಲ ಡೊಂಕು ಅಂದಳಂತೆ (She who cannot dance blamed the uneven floor)",
      "ಆಗಸಕ್ಕೆ ಏಣಿ ಹಾಕಿದ ಹಾಗೆ (Like placing a ladder to the sky)",
      "ಆನೆ ಸತ್ತರೂ ಸಾವಿರ ಹೊನ್ನು (An elephant is worth a thousand gold coins even dead)",
      "ಉಪ್ಪು ತಿಂದವನು ನೀರು ಕುಡಿಯಲೇಬೇಕು (One who eats salt must drink water)"
    ],
    correctAnswer: 0,
    explanation: "'ಕುಣಿಯಲಾರದವಳು ನೆಲ ಡೊಂಕು ಅಂದಳಂತೆ' — ತನಗೆ ಕೆಲಸ ಮಾಡಲು ಬಾರದಿದ್ದಾಗ ಬೇರೆಯವರ ಮೇಲೆ ಅಥವಾ ಸನ್ನಿವೇಶದ ಮೇಲೆ ತಪ್ಪು ಹಾಕುವುದು.",
  },
];

export default function DailyLearnMode({ onBackToHome }) {
  // Calendar check-in points stored in localStorage
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

  // Check in today
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
        colors: ["#facc15", "#ef4444", "#22c55e"],
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
        text: "ತಪ್ಪಾದ ಉತ್ತರ. ವಿವರಣೆಯನ್ನು ಗಮನಿಸಿ ಕಲಿಯಿರಿ!",
      });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#000000",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "960px",
        margin: "0 auto",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      {/* Top Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "14px",
          borderBottom: "1px solid #1f1f23",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={onBackToHome}
            style={{
              background: "#18181b",
              border: "1px solid #27272a",
              color: "#d4d4d8",
              padding: "8px 12px",
              borderRadius: "10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.85rem",
            }}
          >
            <ArrowLeft size={16} />
            <span>ಹಿಂದೆ (Home)</span>
          </button>

          <div>
            <h1 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#ffffff" }}>
              ದೈನಂದಿನ ಕನ್ನಡ ಕಲಿಕೆ (Daily Learn Kannada)
            </h1>
            <p style={{ fontSize: "0.76rem", color: "#facc15" }}>
              ಪ್ರತಿದಿನ ಭೇಟಿ ನೀಡಿ • ಒಗಟು, ಗಾದೆ ಮಾತು, ಸನ್ನಿವೇಶ ಮತ್ತು ನೀತಿ ಕಲಿಯಿರಿ
            </p>
          </div>
        </div>

        {/* Total Points & Streak Badge */}
        <div
          style={{
            background: "linear-gradient(135deg, #18181b, #27272a)",
            border: "1px solid rgba(250, 204, 21, 0.4)",
            padding: "8px 16px",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "0.88rem",
            fontWeight: "700",
            color: "#facc15",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Flame size={16} color="#ef4444" />
            <span>{visitedDays.length} Days Streak</span>
          </div>
          <div style={{ width: "1px", height: "16px", background: "#3f3f46" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Trophy size={16} color="#facc15" />
            <span>{points} pts</span>
          </div>
        </div>
      </header>

      {/* Calendar Strip: 7 Days of the Week */}
      <div
        style={{
          background: "#121215",
          border: "1px solid #27272a",
          borderRadius: "16px",
          padding: "16px 20px",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.92rem", fontWeight: 700, color: "#ffffff" }}>
            <Calendar size={18} color="#facc15" />
            <span>ಕಲಿಕಾ ಕ್ಯಾಲೆಂಡರ್ (Daily Check-in & Learning Calendar)</span>
          </div>
          <span style={{ fontSize: "0.78rem", color: "#a1a1aa" }}>
            Visit daily to unlock new challenges & earn reward points!
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "8px",
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
                    ? "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)"
                    : isVisited
                    ? "#1e293b"
                    : "#18181b",
                  color: isSelected ? "#000000" : isVisited ? "#facc15" : "#71717a",
                  border: isSelected
                    ? "2px solid #ffffff"
                    : isVisited
                    ? "1px solid #3b82f6"
                    : "1px solid #27272a",
                  borderRadius: "12px",
                  padding: "10px 4px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  transition: "all 0.2s",
                }}
              >
                <span style={{ fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 600 }}>
                  ದಿನ {day}
                </span>
                <span style={{ fontSize: "1.1rem", fontWeight: 800 }}>
                  {isVisited ? "✓" : `Day ${day}`}
                </span>
                <span style={{ fontSize: "0.68rem", opacity: 0.85 }}>
                  {isVisited ? "+20 pts" : "Unlock"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Challenge Card for the Active Day */}
      <div
        style={{
          background: "#121215",
          border: "1px solid #27272a",
          borderRadius: "16px",
          padding: "24px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Challenge Header & Category Badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
          <span
            style={{
              background: "rgba(234, 179, 8, 0.15)",
              color: "#facc15",
              border: "1px solid rgba(234, 179, 8, 0.4)",
              borderRadius: "20px",
              padding: "4px 12px",
              fontSize: "0.8rem",
              fontWeight: 700,
            }}
          >
            {currentChallenge.typeBadge}
          </span>
          <span style={{ fontSize: "0.82rem", color: "#9ca3af" }}>
            Challenge #{activeDay} of 7
          </span>
        </div>

        {/* Question Title */}
        <h2 style={{ fontSize: "1.22rem", fontWeight: "700", color: "#ffffff", marginBottom: "6px", lineHeight: "1.4" }}>
          {currentChallenge.title}
        </h2>
        <div
          style={{
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "12px",
            padding: "16px",
            fontSize: "1.08rem",
            color: "#fef08a",
            fontWeight: "600",
            lineHeight: "1.5",
            marginBottom: "10px",
          }}
        >
          {currentChallenge.question}
        </div>

        <p style={{ fontSize: "0.85rem", color: "#a1a1aa", fontStyle: "italic", marginBottom: "18px" }}>
          {currentChallenge.englishHint}
        </p>

        {/* Multiple Choice Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
          {currentChallenge.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentChallenge.correctAnswer;

            let bg = "#18181b";
            let border = "#27272a";
            let col = "#ffffff";

            if (isAnswered) {
              if (isCorrect) {
                bg = "rgba(34, 197, 94, 0.2)";
                border = "#22c55e";
                col = "#86efac";
              } else if (isSelected && !isCorrect) {
                bg = "rgba(239, 68, 68, 0.2)";
                border = "#ef4444";
                col = "#fca5a5";
              }
            } else if (isSelected) {
              border = "#facc15";
              bg = "rgba(250, 204, 21, 0.1)";
            }

            return (
              <button
                key={idx}
                onClick={() => !isAnswered && setSelectedOption(idx)}
                disabled={isAnswered}
                style={{
                  background: bg,
                  border: `1px solid ${border}`,
                  color: col,
                  borderRadius: "10px",
                  padding: "14px 18px",
                  textAlign: "left",
                  fontSize: "0.96rem",
                  fontWeight: 600,
                  cursor: isAnswered ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.15s",
                }}
              >
                <span>{opt}</span>
                {isAnswered && isCorrect && <CheckCircle2 size={18} color="#22c55e" />}
              </button>
            );
          })}
        </div>

        {/* Submit Button */}
        {!isAnswered ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedOption === null}
            style={{
              background: "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)",
              border: "none",
              color: "#000000",
              borderRadius: "10px",
              padding: "12px 24px",
              fontWeight: "800",
              fontSize: "0.98rem",
              cursor: selectedOption === null ? "not-allowed" : "pointer",
              opacity: selectedOption === null ? 0.5 : 1,
              alignSelf: "flex-start",
            }}
          >
            ಉತ್ತರ ಸಲ್ಲಿಸಿ (Submit Answer)
          </button>
        ) : (
          <div
            style={{
              padding: "16px",
              borderRadius: "12px",
              background: feedback?.isCorrect ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
              border: feedback?.isCorrect ? "1px solid #22c55e" : "1px solid #ef4444",
              marginTop: "4px",
            }}
          >
            <div style={{ fontWeight: 800, color: feedback?.isCorrect ? "#86efac" : "#fca5a5", marginBottom: "8px", fontSize: "1rem" }}>
              {feedback?.text}
            </div>
            <div style={{ color: "#e5e7eb", fontSize: "0.88rem", lineHeight: "1.5" }}>
              <strong>ವಿವರಣೆ (Explanation & Cultural Meaning):</strong> {currentChallenge.explanation}
            </div>
            <button
              onClick={() => handleSelectDay((activeDay % 7) + 1)}
              style={{
                marginTop: "12px",
                background: "#27272a",
                border: "none",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>ಮುಂದಿನ ದಿನದ ಸವಾಲು (Next Day)</span>
              <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
