import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Sparkles,
  Trophy,
  Award
} from "lucide-react";
import { DAILY_BANK } from "../data/dailyBank";

// Helper to get 10 problems for any given day
const getProblemsForDay = (dayNum) => {
  if (DAILY_BANK[dayNum]) return DAILY_BANK[dayNum];
  // Modulo wrap fallback so all 7 days have 10 full problems
  const baseDay = ((dayNum - 1) % 3) + 1;
  return DAILY_BANK[baseDay] || DAILY_BANK[1];
};

export default function DailyLearnMode({ onBackToHome }) {
  // Current calendar day (1 - 31)
  const todayDate = new Date();
  const currentCalendarDay = todayDate.getDate(); // e.g., 26
  const activeCycleDay = ((currentCalendarDay - 1) % 7) + 1; // 1 to 7

  // Calculate remaining time until next midnight (24h unlock)
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diffMs = tomorrow - now;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, []);

  const [points, setPoints] = useState(() => {
    try {
      const saved = localStorage.getItem("kannada_daily_points");
      return saved ? parseInt(saved, 10) : 100;
    } catch {
      return 100;
    }
  });

  // Track completed questions for the current day
  const [completedProblems, setCompletedProblems] = useState(() => {
    try {
      const saved = localStorage.getItem(`kannada_completed_day_${currentCalendarDay}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Active question index (0 to 9) out of the 10 problems
  const [activeProblemIdx, setActiveProblemIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const dailyProblems = getProblemsForDay(activeCycleDay);
  const currentProblem = dailyProblems[activeProblemIdx] || dailyProblems[0];

  const handleSelectOption = (optIdx) => {
    if (isAnswered) return;
    setSelectedOption(optIdx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);

    const isCorrect = selectedOption === currentProblem.correctAnswer;
    if (isCorrect) {
      confetti({
        particleCount: 40,
        spread: 55,
        origin: { y: 0.75 },
        colors: ["#c75f71", "#a2ae9d", "#f0bbbb"],
      });

      const newPts = points + 20;
      setPoints(newPts);
      localStorage.setItem("kannada_daily_points", newPts.toString());

      if (!completedProblems.includes(currentProblem.id)) {
        const updated = [...completedProblems, currentProblem.id];
        setCompletedProblems(updated);
        localStorage.setItem(`kannada_completed_day_${currentCalendarDay}`, JSON.stringify(updated));
      }

      setFeedback({
        isCorrect: true,
        text: "ಸರಿಯಾದ ಉತ್ತರ! (+20 ಅಂಕಗಳು)",
      });
    } else {
      setFeedback({
        isCorrect: false,
        text: "ತಪ್ಪಾದ ಉತ್ತರ. ಕೆಳಗಿನ ವಿವರಣೆ ಗಮನಿಸಿ.",
      });
    }
  };

  const nextProblem = () => {
    if (activeProblemIdx < dailyProblems.length - 1) {
      setActiveProblemIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setFeedback(null);
    }
  };

  const prevProblem = () => {
    if (activeProblemIdx > 0) {
      setActiveProblemIdx((prev) => prev - 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setFeedback(null);
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
              ದಿನದ ಕಲಿಕೆ <span style={{ fontWeight: "400", color: "#a2ae9d" }}>/ 10 Daily Problems</span>
            </h1>
          </div>
        </div>

        {/* 24-Hour Countdown & Points Pill */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            title="Next 10 questions unlock after 24 hours (Midnight)"
            style={{
              background: "rgba(255, 255, 227, 0.75)",
              border: "1px solid rgba(203, 203, 203, 0.45)",
              padding: "6px 12px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.82rem",
              fontWeight: "600",
              color: "#54463a",
            }}
          >
            <Clock size={14} color="#6d8196" />
            <span>Next set in: {timeLeft}</span>
          </div>

          <div
            style={{
              background: "rgba(162, 174, 157, 0.25)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(162, 174, 157, 0.4)",
              padding: "6px 14px",
              borderRadius: "9999px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.86rem",
              fontWeight: "700",
              color: "#54463a",
            }}
          >
            <Trophy size={15} color="#54463a" />
            <span>{points} pts</span>
          </div>
        </div>
      </header>

      {/* Main Learning Workspace */}
      <div
        style={{
          flex: 1,
          maxWidth: "840px",
          width: "100%",
          margin: "0 auto",
          padding: "24px 16px 40px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Calendar Today Status Strip */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(162, 174, 157, 0.35)",
            borderRadius: "14px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 4px 16px rgba(84, 70, 58, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Calendar size={18} color="#54463a" />
            <span style={{ fontWeight: "700", fontSize: "0.95rem" }}>
              ಇಂದಿನ ದಿನಾಂಕ (Date: {todayDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })})
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", fontWeight: "600", color: "#a2ae9d" }}>
            <span>Completed: {completedProblems.length} / 10</span>
          </div>
        </div>

        {/* 10 Problem Step Indicator Bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(10, 1fr)",
            gap: "6px",
          }}
        >
          {dailyProblems.map((prob, idx) => {
            const isDone = completedProblems.includes(prob.id);
            const isCurrent = activeProblemIdx === idx;
            return (
              <button
                key={prob.id}
                onClick={() => {
                  setActiveProblemIdx(idx);
                  setSelectedOption(null);
                  setIsAnswered(false);
                  setFeedback(null);
                }}
                style={{
                  background: isCurrent
                    ? "#54463a"
                    : isDone
                    ? "rgba(162, 174, 157, 0.45)"
                    : "rgba(255, 255, 255, 0.7)",
                  color: isCurrent ? "#ffffe3" : "#54463a",
                  border: isCurrent
                    ? "1.5px solid #54463a"
                    : "1px solid rgba(162, 174, 157, 0.35)",
                  borderRadius: "8px",
                  padding: "8px 0",
                  fontSize: "0.82rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  textAlign: "center",
                }}
              >
                Q{idx + 1}
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
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
              {currentProblem.badge}
            </span>

            <span style={{ fontSize: "0.85rem", color: "#a2ae9d", fontWeight: "600" }}>
              Problem {activeProblemIdx + 1} of 10
            </span>
          </div>

          <h2 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#54463a", marginBottom: "12px" }}>
            {currentProblem.title}
          </h2>

          <div
            style={{
              background: "rgba(255, 255, 227, 0.65)",
              borderLeft: "3.5px solid #a2ae9d",
              padding: "16px 18px",
              borderRadius: "0 10px 10px 0",
              fontSize: "1.08rem",
              color: "#54463a",
              fontWeight: "600",
              lineHeight: "1.6",
              marginBottom: "8px",
            }}
          >
            {currentProblem.question}
          </div>

          <p style={{ fontSize: "0.86rem", color: "#54463a", opacity: 0.75, fontStyle: "italic", marginBottom: "22px" }}>
            {currentProblem.englishHint}
          </p>

          {/* Multiple Choice Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
            {currentProblem.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              let optBg = "rgba(255, 255, 255, 0.7)";
              let borderCol = "rgba(162, 174, 157, 0.35)";

              if (isAnswered) {
                if (idx === currentProblem.correctAnswer) {
                  optBg = "rgba(220, 252, 231, 0.85)";
                  borderCol = "#22c55e";
                } else if (isSelected) {
                  optBg = "rgba(254, 226, 226, 0.85)";
                  borderCol = "#ef4444";
                }
              } else if (isSelected) {
                optBg = "rgba(255, 255, 227, 0.9)";
                borderCol = "#54463a";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  style={{
                    background: optBg,
                    border: `1.5px solid ${borderCol}`,
                    borderRadius: "12px",
                    padding: "14px 18px",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    color: "#54463a",
                    textAlign: "left",
                    cursor: isAnswered ? "default" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span>{option}</span>
                  {isAnswered && idx === currentProblem.correctAnswer && (
                    <CheckCircle2 size={18} color="#15803d" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Detailed Explanation */}
          {feedback && (
            <div
              style={{
                background: feedback.isCorrect ? "rgba(240, 253, 244, 0.85)" : "rgba(254, 242, 242, 0.85)",
                border: `1px solid ${feedback.isCorrect ? "#bbf7d0" : "#fecaca"}`,
                borderRadius: "12px",
                padding: "16px 20px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "0.95rem",
                  color: feedback.isCorrect ? "#15803d" : "#b91c1c",
                  marginBottom: "4px",
                }}
              >
                {feedback.text}
              </div>
              <p style={{ fontSize: "0.88rem", color: "#475569", margin: 0, lineHeight: "1.5" }}>
                <strong>ವಿವರಣೆ (Explanation):</strong> {currentProblem.explanation}
              </p>
            </div>
          )}

          {/* Action Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              onClick={prevProblem}
              disabled={activeProblemIdx === 0}
              style={{
                background: "transparent",
                border: "1px solid rgba(162, 174, 157, 0.4)",
                color: activeProblemIdx === 0 ? "#cbcbcb" : "#54463a",
                padding: "10px 18px",
                borderRadius: "10px",
                fontSize: "0.86rem",
                fontWeight: "600",
                cursor: activeProblemIdx === 0 ? "not-allowed" : "pointer",
              }}
            >
              ◀ ಹಿಂದಿನ ಪ್ರಶ್ನೆ
            </button>

            {!isAnswered ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                style={{
                  background: selectedOption !== null ? "#54463a" : "rgba(203, 203, 203, 0.3)",
                  color: selectedOption !== null ? "#ffffe3" : "#cbcbcb",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px 24px",
                  fontSize: "0.92rem",
                  fontWeight: "700",
                  cursor: selectedOption !== null ? "pointer" : "not-allowed",
                  boxShadow: selectedOption !== null ? "0 4px 14px rgba(84, 70, 58, 0.2)" : "none",
                }}
              >
                ಉತ್ತರ ಪರೀಕ್ಷಿಸಿ (Submit)
              </button>
            ) : (
              <button
                onClick={nextProblem}
                disabled={activeProblemIdx === dailyProblems.length - 1}
                style={{
                  background: activeProblemIdx < dailyProblems.length - 1 ? "#54463a" : "rgba(203, 203, 203, 0.3)",
                  color: activeProblemIdx < dailyProblems.length - 1 ? "#ffffe3" : "#cbcbcb",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px 24px",
                  fontSize: "0.92rem",
                  fontWeight: "700",
                  cursor: activeProblemIdx < dailyProblems.length - 1 ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>ಮುಂದಿನ ಪ್ರಶ್ನೆ ➔</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
