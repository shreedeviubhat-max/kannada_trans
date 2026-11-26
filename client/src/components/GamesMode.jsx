import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Trophy,
  HelpCircle,
  Puzzle,
  BookOpen,
  CheckCircle2,
  XCircle,
  RotateCcw
} from "lucide-react";
import {
  SENTENCE_GAMES_1000,
  WORD_PUZZLES_1000,
  GK_QUIZ_1000
} from "../data/gamesQuestions1000";

export default function GamesMode({ onBackToHome }) {
  const [activeTab, setActiveTab] = useState("sentence"); // 'sentence' | 'word' | 'quiz'
  const [totalScore, setTotalScore] = useState(0);

  // 1. Sentence Game State (1000 Questions)
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [placedWords, setPlacedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState(
    SENTENCE_GAMES_1000[0]?.jumbledWords || []
  );
  const [sentenceFeedback, setSentenceFeedback] = useState(null);

  // 2. Word Finding State (1000 Puzzles)
  const [currentPuzzleIdx, setCurrentPuzzleIdx] = useState(0);
  const [foundWords, setFoundWords] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [wordFeedback, setWordFeedback] = useState(null);

  // 3. Quiz State (1000 Trivia Questions)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 45,
      spread: 55,
      origin: { y: 0.75 },
      colors: ["#ea580c", "#f59e0b", "#10b981"],
    });
  };

  const handlePickWord = (word, index) => {
    setPlacedWords((prev) => [...prev, word]);
    setAvailableWords((prev) => prev.filter((_, i) => i !== index));
    setSentenceFeedback(null);
  };

  const handleRemovePlacedWord = (word, index) => {
    setPlacedWords((prev) => prev.filter((_, i) => i !== index));
    setAvailableWords((prev) => [...prev, word]);
    setSentenceFeedback(null);
  };

  const handleVerifySentence = () => {
    const current = SENTENCE_GAMES_1000[currentSentenceIdx];
    const isCorrect =
      placedWords.length === current.correctOrder.length &&
      placedWords.every((w, i) => w === current.correctOrder[i]);

    if (isCorrect) {
      triggerConfetti();
      setTotalScore((s) => s + 20);
      setSentenceFeedback({
        type: "success",
        msg: "ಸರಿಯಾದ ಉತ್ತರ! (Correct Answer: +20 pts)",
      });
    } else {
      setSentenceFeedback({
        type: "error",
        msg: "ತಪ್ಪಾದ ರಚನೆ. ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.",
      });
    }
  };

  const nextSentence = () => {
    const nextIdx = (currentSentenceIdx + 1) % SENTENCE_GAMES_1000.length;
    setCurrentSentenceIdx(nextIdx);
    setPlacedWords([]);
    setAvailableWords(SENTENCE_GAMES_1000[nextIdx].jumbledWords);
    setSentenceFeedback(null);
  };

  const handleLetterClick = (letter) => {
    setSelectedLetters((prev) => [...prev, letter]);
    setWordFeedback(null);
  };

  const handleClearLetters = () => {
    setSelectedLetters([]);
    setWordFeedback(null);
  };

  const handleCheckWord = () => {
    const formed = selectedLetters.join("");
    const puzzle = WORD_PUZZLES_1000[currentPuzzleIdx];
    const matched = puzzle.hiddenWords.find((item) => item.word === formed);

    if (matched) {
      if (foundWords.includes(matched.word)) {
        setWordFeedback({ type: "info", msg: `Already found: "${matched.word}"` });
      } else {
        triggerConfetti();
        setTotalScore((s) => s + 15);
        setFoundWords((prev) => [...prev, matched.word]);
        setWordFeedback({
          type: "success",
          msg: `ಸರಿ! "${matched.word}" (${matched.transliteration} - ${matched.meaning})`,
        });
      }
    } else {
      setWordFeedback({ type: "error", msg: `"${formed}" is not a valid word. Try again.` });
    }
    setSelectedLetters([]);
  };

  const handleSelectQuizOption = (idx) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitQuiz = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    const q = GK_QUIZ_1000[currentQuestionIdx];
    if (selectedOption === q.correctAnswer) {
      triggerConfetti();
      setTotalScore((s) => s + 25);
    }
  };

  const nextQuizQuestion = () => {
    const next = (currentQuestionIdx + 1) % GK_QUIZ_1000.length;
    setCurrentQuestionIdx(next);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fdf8f6",
        backgroundImage: `
          radial-gradient(at 15% 15%, rgba(240, 187, 187, 0.28) 0px, transparent 50%),
          radial-gradient(at 85% 85%, rgba(199, 95, 113, 0.15) 0px, transparent 50%),
          radial-gradient(at 50% 50%, rgba(255, 255, 227, 0.6) 0px, transparent 55%)
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
          borderBottom: "1px solid rgba(199, 95, 113, 0.25)",
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
              border: "1px solid rgba(199, 95, 113, 0.3)",
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
            <h1 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#c75f71", margin: 0 }}>
              ಭಾಷಾ ಆಟಗಳು <span style={{ fontWeight: "400", color: "#54463a" }}>/ Play Games</span>
            </h1>
          </div>
        </div>

        {/* Score pill */}
        <div
          style={{
            background: "rgba(240, 187, 187, 0.35)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(199, 95, 113, 0.35)",
            padding: "6px 14px",
            borderRadius: "9999px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.86rem",
            fontWeight: "700",
            color: "#c75f71",
          }}
        >
          <Trophy size={15} color="#c75f71" />
          <span>{totalScore} pts</span>
        </div>
      </header>

      {/* Main Content Workspace */}
      <div
        style={{
          flex: 1,
          maxWidth: "840px",
          width: "100%",
          margin: "0 auto",
          padding: "24px 16px 40px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Subtle Horizontal Tab Selector */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            borderBottom: "1px solid rgba(199, 95, 113, 0.25)",
            paddingBottom: "12px",
            marginBottom: "24px",
          }}
        >
          <button
            onClick={() => setActiveTab("sentence")}
            style={{
              background: activeTab === "sentence" ? "rgba(240, 187, 187, 0.45)" : "transparent",
              color: activeTab === "sentence" ? "#c75f71" : "#54463a",
              border: activeTab === "sentence" ? "1px solid rgba(199, 95, 113, 0.3)" : "none",
              borderRadius: "8px",
              padding: "8px 16px",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            Sentence Builder
          </button>
          <button
            onClick={() => setActiveTab("word")}
            style={{
              background: activeTab === "word" ? "rgba(240, 187, 187, 0.45)" : "transparent",
              color: activeTab === "word" ? "#c75f71" : "#54463a",
              border: activeTab === "word" ? "1px solid rgba(199, 95, 113, 0.3)" : "none",
              borderRadius: "8px",
              padding: "8px 16px",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            Word Discovery
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            style={{
              background: activeTab === "quiz" ? "rgba(240, 187, 187, 0.45)" : "transparent",
              color: activeTab === "quiz" ? "#c75f71" : "#54463a",
              border: activeTab === "quiz" ? "1px solid rgba(199, 95, 113, 0.3)" : "none",
              borderRadius: "8px",
              padding: "8px 16px",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            Karnataka Trivia
          </button>
        </div>

        {/* 1. Sentence Builder Tab (No remaining question count displayed) */}
        {activeTab === "sentence" && (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.78)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(199, 95, 113, 0.25)",
              borderRadius: "18px",
              padding: "28px",
              boxShadow: "0 8px 30px rgba(199, 95, 113, 0.08)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "0.82rem", color: "#c75f71", fontWeight: "700", textTransform: "uppercase" }}>
                Kannada Sentence Construction
              </span>
              <button
                onClick={nextSentence}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#c75f71",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Next ➔
              </button>
            </div>

            <p style={{ fontSize: "1.05rem", color: "#54463a", marginBottom: "20px" }}>
              Arrange the words to say: <strong style={{ color: "#c75f71" }}>"{SENTENCE_GAMES_1000[currentSentenceIdx].english}"</strong>
            </p>

            {/* Placed Words Slot */}
            <div
              style={{
                minHeight: "68px",
                background: "rgba(255, 255, 227, 0.55)",
                border: "1.5px dashed rgba(199, 95, 113, 0.4)",
                borderRadius: "12px",
                padding: "12px",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              {placedWords.length === 0 ? (
                <span style={{ color: "#a2ae9d", fontSize: "0.9rem" }}>
                  Select words below in correct sequence...
                </span>
              ) : (
                placedWords.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRemovePlacedWord(word, idx)}
                    style={{
                      background: "#c75f71",
                      border: "none",
                      color: "#ffffe3",
                      borderRadius: "8px",
                      padding: "8px 14px",
                      fontSize: "0.98rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(199, 95, 113, 0.25)",
                    }}
                    title="Click to remove"
                  >
                    {word} ✕
                  </button>
                ))
              )}
            </div>

            {/* Available Words Pool */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
              {availableWords.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePickWord(word, idx)}
                  style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    border: "1px solid rgba(199, 95, 113, 0.35)",
                    color: "#54463a",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontSize: "0.98rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#c75f71";
                    e.currentTarget.style.backgroundColor = "rgba(240, 187, 187, 0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(199, 95, 113, 0.35)";
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
                  }}
                >
                  {word}
                </button>
              ))}
            </div>

            <button
              onClick={handleVerifySentence}
              disabled={placedWords.length === 0}
              style={{
                background: placedWords.length > 0 ? "#c75f71" : "rgba(203, 203, 203, 0.3)",
                color: placedWords.length > 0 ? "#ffffe3" : "#cbcbcb",
                border: "none",
                borderRadius: "10px",
                padding: "11px 24px",
                fontSize: "0.92rem",
                fontWeight: "700",
                cursor: placedWords.length > 0 ? "pointer" : "not-allowed",
              }}
            >
              ಉತ್ತರ ಪರೀಕ್ಷಿಸಿ (Check Answer)
            </button>

            {sentenceFeedback && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "14px 18px",
                  borderRadius: "10px",
                  background: sentenceFeedback.type === "success" ? "rgba(240, 253, 244, 0.85)" : "rgba(254, 242, 242, 0.85)",
                  border: sentenceFeedback.type === "success" ? "1px solid #bbf7d0" : "1px solid #fecaca",
                  color: sentenceFeedback.type === "success" ? "#166534" : "#991b1b",
                  fontSize: "0.9rem",
                }}
              >
                <div style={{ fontWeight: "700" }}>{sentenceFeedback.msg}</div>
                {sentenceFeedback.type === "success" && (
                  <div style={{ marginTop: "6px", color: "#54463a", fontSize: "0.85rem" }}>
                    <div><strong>Reading:</strong> {SENTENCE_GAMES_1000[currentSentenceIdx].transliteration}</div>
                    <div style={{ marginTop: "2px" }}><strong>Grammar:</strong> {SENTENCE_GAMES_1000[currentSentenceIdx].grammarNote}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 2. Word Discovery Tab (No remaining question count displayed) */}
        {activeTab === "word" && (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.78)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(199, 95, 113, 0.25)",
              borderRadius: "18px",
              padding: "28px",
              boxShadow: "0 8px 30px rgba(199, 95, 113, 0.08)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ fontSize: "0.82rem", color: "#c75f71", fontWeight: "700", textTransform: "uppercase" }}>
                Word Search Challenge
              </span>
              <button
                onClick={() => {
                  setCurrentPuzzleIdx((prev) => (prev + 1) % WORD_PUZZLES_1000.length);
                  setFoundWords([]);
                  setSelectedLetters([]);
                  setWordFeedback(null);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#c75f71",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Next Puzzle ➔
              </button>
            </div>

            <p style={{ fontSize: "0.98rem", color: "#54463a", marginBottom: "16px" }}>
              Tap letters below to discover hidden Kannada words:
            </p>

            {/* Assembled Letters Bar */}
            <div
              style={{
                minHeight: "54px",
                background: "rgba(255, 255, 227, 0.6)",
                border: "1px solid rgba(199, 95, 113, 0.35)",
                borderRadius: "10px",
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "#c75f71" }}>
                {selectedLetters.join("") || <span style={{ color: "#a2ae9d", fontSize: "0.9rem", fontWeight: "400" }}>Selected letters appear here...</span>}
              </span>
              {selectedLetters.length > 0 && (
                <button
                  onClick={handleClearLetters}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#dc2626",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Letter Tiles Grid */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
              {WORD_PUZZLES_1000[currentPuzzleIdx].letters.map((letter, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLetterClick(letter)}
                  style={{
                    width: "52px",
                    height: "52px",
                    background: "rgba(255, 255, 255, 0.8)",
                    border: "1.5px solid rgba(199, 95, 113, 0.3)",
                    color: "#54463a",
                    borderRadius: "10px",
                    fontSize: "1.3rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {letter}
                </button>
              ))}
            </div>

            <button
              onClick={handleCheckWord}
              disabled={selectedLetters.length === 0}
              style={{
                background: selectedLetters.length > 0 ? "#c75f71" : "rgba(203, 203, 203, 0.3)",
                color: selectedLetters.length > 0 ? "#ffffe3" : "#cbcbcb",
                border: "none",
                borderRadius: "10px",
                padding: "11px 24px",
                fontSize: "0.92rem",
                fontWeight: "700",
                cursor: selectedLetters.length > 0 ? "pointer" : "not-allowed",
              }}
            >
              ಪದ ಪರೀಕ್ಷಿಸಿ (Submit Word)
            </button>

            {wordFeedback && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  background:
                    wordFeedback.type === "success"
                      ? "rgba(240, 253, 244, 0.85)"
                      : wordFeedback.type === "info"
                      ? "rgba(254, 249, 195, 0.85)"
                      : "rgba(254, 242, 242, 0.85)",
                  border:
                    wordFeedback.type === "success"
                      ? "1px solid #bbf7d0"
                      : wordFeedback.type === "info"
                      ? "1px solid #fde047"
                      : "1px solid #fecaca",
                  color:
                    wordFeedback.type === "success"
                      ? "#166534"
                      : wordFeedback.type === "info"
                      ? "#854d0e"
                      : "#991b1b",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
              >
                {wordFeedback.msg}
              </div>
            )}

            {/* Discovered Words Status */}
            <div style={{ marginTop: "24px", borderTop: "1px solid rgba(199, 95, 113, 0.2)", paddingTop: "16px" }}>
              <span style={{ fontSize: "0.85rem", color: "#54463a", fontWeight: "700", display: "block", marginBottom: "10px" }}>
                Discovered Words:
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {WORD_PUZZLES_1000[currentPuzzleIdx].hiddenWords.map((item, idx) => {
                  const isFound = foundWords.includes(item.word);
                  return (
                    <span
                      key={idx}
                      style={{
                        background: isFound ? "rgba(240, 253, 244, 0.85)" : "rgba(255, 255, 255, 0.6)",
                        border: isFound ? "1px solid #bbf7d0" : "1px solid rgba(203, 203, 203, 0.4)",
                        color: isFound ? "#15803d" : "#a2ae9d",
                        padding: "6px 14px",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                      }}
                    >
                      {isFound ? `${item.word} (${item.transliteration} - ${item.meaning})` : "•••"}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 3. Karnataka Trivia Tab (No remaining question count displayed) */}
        {activeTab === "quiz" && (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.78)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(199, 95, 113, 0.25)",
              borderRadius: "18px",
              padding: "28px",
              boxShadow: "0 8px 30px rgba(199, 95, 113, 0.08)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ fontSize: "0.82rem", color: "#c75f71", fontWeight: "700", textTransform: "uppercase" }}>
                Karnataka GK & Literature Trivia
              </span>
              <button
                onClick={nextQuizQuestion}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#c75f71",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Next ➔
              </button>
            </div>

            <h2 style={{ fontSize: "1.18rem", color: "#54463a", fontWeight: "700", lineHeight: "1.45", marginBottom: "4px" }}>
              {GK_QUIZ_1000[currentQuestionIdx].question}
            </h2>
            <p style={{ color: "#a2ae9d", fontSize: "0.85rem", fontStyle: "italic", marginBottom: "20px" }}>
              {GK_QUIZ_1000[currentQuestionIdx].transliteration}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              {GK_QUIZ_1000[currentQuestionIdx].options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === GK_QUIZ_1000[currentQuestionIdx].correctAnswer;

                let border = "rgba(199, 95, 113, 0.25)";
                let bg = "rgba(255, 255, 255, 0.75)";
                let textCol = "#54463a";

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    border = "#22c55e";
                    bg = "rgba(240, 253, 244, 0.9)";
                    textCol = "#15803d";
                  } else if (isSelected) {
                    border = "#ef4444";
                    bg = "rgba(254, 242, 242, 0.9)";
                    textCol = "#b91c1c";
                  }
                } else if (isSelected) {
                  border = "#c75f71";
                  bg = "rgba(255, 255, 227, 0.9)";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectQuizOption(idx)}
                    disabled={isAnswerSubmitted}
                    style={{
                      background: bg,
                      border: `1.5px solid ${border}`,
                      color: textCol,
                      borderRadius: "12px",
                      padding: "14px 18px",
                      fontSize: "0.95rem",
                      fontWeight: "500",
                      textAlign: "left",
                      cursor: isAnswerSubmitted ? "default" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span>{option}</span>
                    {isAnswerSubmitted && isCorrect && <CheckCircle2 size={18} color="#15803d" />}
                    {isAnswerSubmitted && isSelected && !isCorrect && <XCircle size={18} color="#b91c1c" />}
                  </button>
                );
              })}
            </div>

            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={selectedOption === null}
                style={{
                  background: selectedOption !== null ? "#c75f71" : "rgba(203, 203, 203, 0.3)",
                  color: selectedOption !== null ? "#ffffe3" : "#cbcbcb",
                  border: "none",
                  borderRadius: "10px",
                  padding: "11px 24px",
                  fontSize: "0.92rem",
                  fontWeight: "700",
                  cursor: selectedOption !== null ? "pointer" : "not-allowed",
                }}
              >
                ಉತ್ತರ ಪರೀಕ್ಷಿಸಿ (Submit)
              </button>
            ) : (
              <div
                style={{
                  background: "rgba(255, 255, 227, 0.7)",
                  border: "1px solid rgba(199, 95, 113, 0.3)",
                  borderRadius: "10px",
                  padding: "14px 18px",
                  color: "#54463a",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <strong>ವಿವರಣೆ (Note):</strong> {GK_QUIZ_1000[currentQuestionIdx].explanation}
                </div>
                <button
                  onClick={nextQuizQuestion}
                  style={{
                    background: "#c75f71",
                    color: "#ffffe3",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    flexShrink: 0,
                    marginLeft: "12px",
                  }}
                >
                  ಮುಂದಿನ ಪ್ರಶ್ನೆ ➔
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
