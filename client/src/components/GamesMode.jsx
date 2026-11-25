import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Trophy,
  HelpCircle,
  Puzzle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
  Gamepad2,
  Dice5,
  Flame
} from "lucide-react";

// 1. Sentence Formation Game Data
const SENTENCE_GAMES = [
  {
    id: 1,
    jumbledWords: ["ಹೋಗುತ್ತೇನೆ", "ಶಾಲೆಗೆ", "ನಾನು", "ದಿನವೂ"],
    correctOrder: ["ನಾನು", "ದಿನವೂ", "ಶಾಲೆಗೆ", "ಹೋಗುತ್ತೇನೆ"],
    transliteration: "Nānu dinavū śālege hōguttēne.",
    english: "I go to school every day.",
    grammarNote: "Subject (ನಾನು) + Adverb (ದಿನವೂ) + Indirect Object (ಶಾಲೆಗೆ) + Verb (ಹೋಗುತ್ತೇನೆ). Follows Kannada SOV order.",
  },
  {
    id: 2,
    jumbledWords: ["ಕುಡಿಯುತ್ತಾನೆ", "ಬೆಳಿಗ್ಗೆ", "ಹಾಲು", "ಅವನು"],
    correctOrder: ["ಅವನು", "ಬೆಳಿಗ್ಗೆ", "ಹಾಲು", "ಕುಡಿಯುತ್ತಾನೆ"],
    transliteration: "Avanu beḷigge hālu kuḍiyuttāne.",
    english: "He drinks milk in the morning.",
    grammarNote: "Subject (ಅವನು) + Time adverb (ಬೆಳಿಗ್ಗೆ) + Direct object (ಹಾಲು) + Verb (ಕುಡಿಯುತ್ತಾನೆ).",
  },
  {
    id: 3,
    jumbledWords: ["ಬರೆಯುತ್ತಾಳೆ", "ಪುಸ್ತಕವನ್ನು", "ರೇಖಾ", "ಚೆನ್ನಾಗಿ"],
    correctOrder: ["ರೇಖಾ", "ಪುಸ್ತಕವನ್ನು", "ಚೆನ್ನಾಗಿ", "ಬರೆಯುತ್ತಾಳೆ"],
    transliteration: "Rēkhā pustakavannu cennāgi bareyuttāḷe.",
    english: "Rekha writes the book well.",
    grammarNote: "Subject (ರೇಖಾ) + Accusative object with -ಅನ್ನು (ಪುಸ್ತಕವನ್ನು) + Adverb (ಚೆನ್ನಾಗಿ) + Verb (ಬರೆಯುತ್ತಾಳೆ).",
  },
];

// 2. Word Finding Puzzle Data
const WORD_PUZZLES = [
  {
    id: 1,
    letters: ["ಕ", "ಮ", "ಲ", "ನ", "ಗ", "ರ", "ಮ", "ನೆ"],
    hiddenWords: [
      { word: "ಕಮಲ", transliteration: "Kamala", meaning: "Lotus" },
      { word: "ನಗರ", transliteration: "Nagara", meaning: "City / Town" },
      { word: "ಮನೆ", transliteration: "Mane", meaning: "House / Home" },
    ],
  },
  {
    id: 2,
    letters: ["ಪು", "ಸ್ತ", "ಕ", "ಶಾ", "ಲೆ", "ಗು", "ರು"],
    hiddenWords: [
      { word: "ಪುಸ್ತಕ", transliteration: "Pustaka", meaning: "Book" },
      { word: "ಶಾಲೆ", transliteration: "Shāle", meaning: "School" },
      { word: "ಗುರು", transliteration: "Guru", meaning: "Teacher / Mentor" },
    ],
  },
];

// 3. Karnataka GK Quiz Data
const GK_QUIZ = [
  {
    id: 1,
    question: "ಕನ್ನಡ ಸಾಹಿತ್ಯಕ್ಕೆ ಮೊದಲ ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿ ತಂದುಕೊಟ್ಟ ಮಹಾನ್ ಕವಿ ಯಾರು?",
    transliteration: "Kannaḍa sāhityakke modala jñānapīṭha praśasti tandukoṭṭa mahān kavi yāru?",
    options: ["ಕುವೆಂಪು (Kuvempu)", "ದ.ರಾ. ಬೇಂದ್ರೆ (Bendre)", "ಶಿವರಾಮ ಕಾರಂತ (Karanth)", "ಮಾಸ್ತಿ ವೆಂಕಟೇಶ ಅಯ್ಯಂಗಾರ್ (Masti)"],
    correctAnswer: 0,
    explanation: "ಕುವೆಂಪು (K. V. Puttappa) received the first Jnanpith award for Kannada in 1967 for 'ಶ್ರೀ ರಾಮಾಯಣ ದರ್ಶನಂ'.",
  },
  {
    id: 2,
    question: "ಕರ್ನಾಟಕದ ನಾಡಗೀತೆ 'ಜಯ ಭಾರತ ಜನನಿಯ ತನುಜಾತೆ' ರಚಿಸಿದವರು ಯಾರು?",
    transliteration: "Karnāṭakada nāḍagīte 'Jaya Bhārata Jananiya Tanujāte' racisidavaru yāru?",
    options: ["ಕುವೆಂಪು (Kuvempu)", "ಬಿ. ಎಂ. ಶ್ರೀಕಂಠಯ್ಯ (BM Sri)", "ಚನ್ನವೀರ ಕಣವಿ (Kanavi)", "ಜಿ. ಎಸ್. ಶಿವರುದ್ರಪ್ಪ (GSS)"],
    correctAnswer: 0,
    explanation: "Rashtrakavi Kuvempu penned Karnataka's official state anthem.",
  },
  {
    id: 3,
    question: "ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯದ ರಾಜಧಾನಿಯಾಗಿದ್ದ ಐತಿಹಾಸಿಕ ತಾಣ ಯಾವುದು?",
    transliteration: "Vijayanagara sāmrājyada rājadhāniyāgiddha aitihāsika tāṇa yāvudu?",
    options: ["ಹಂಪಿ (Hampi)", "ಬಾದಾಮಿ (Badami)", "ಬೇಲೂರು (Belur)", "ಪಟ್ಟದಕಲ್ಲು (Pattadakal)"],
    correctAnswer: 0,
    explanation: "ಹಂಪಿ (Hampi), situated on the banks of Tungabhadra, was the capital of the Vijayanagara Empire.",
  },
  {
    id: 4,
    question: "ಕನ್ನಡದ ಅತ್ಯಂತ ಪ್ರಾಚೀನ ಶಾಸನ ಯಾವುದು?",
    transliteration: "Kannaḍada atyanta prācīna śāsana yāvudu?",
    options: ["ಹಲ್ಮಿಡಿ ಶಾಸನ (Halmidi Inscription)", "ಬಾದಾಮಿ ಶಾಸನ (Badami)", "ಶ್ರವಣಬೆಳಗೊಳ ಶಾಸನ (Shravanabelagola)", "ಐಹೊಳೆ ಶಾಸನ (Aihole)"],
    correctAnswer: 0,
    explanation: "Halmidi inscription (c. 450 CE) during the Kadamba period is the earliest recorded Kannada stone inscription.",
  },
];

export default function GamesMode({ onBackToHome }) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [totalScore, setTotalScore] = useState(0);

  // 1. Sentence Game State
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [placedWords, setPlacedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState(SENTENCE_GAMES[0].jumbledWords);
  const [sentenceFeedback, setSentenceFeedback] = useState(null);

  // 2. Word Finding State
  const [currentPuzzleIdx, setCurrentPuzzleIdx] = useState(0);
  const [foundWords, setFoundWords] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [wordFeedback, setWordFeedback] = useState(null);

  // 3. Quiz State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#f59e0b", "#ef4444", "#10b981", "#8b5cf6"],
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
    const current = SENTENCE_GAMES[currentSentenceIdx];
    const isCorrect = placedWords.join(" ") === current.correctOrder.join(" ");

    if (isCorrect) {
      triggerConfetti();
      setTotalScore((s) => s + 20);
      setSentenceFeedback({
        type: "success",
        msg: "ಅದ್ಭುತ! ಸರಿಯಾದ ವಾಕ್ಯ ರಚನೆ! (Brilliant! Correct sentence structure!)",
      });
    } else {
      setSentenceFeedback({
        type: "error",
        msg: "ಇನ್ನೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ! (Try again! Observe Subject-Object-Verb order)",
      });
    }
  };

  const nextSentence = () => {
    const nextIdx = (currentSentenceIdx + 1) % SENTENCE_GAMES.length;
    setCurrentSentenceIdx(nextIdx);
    setPlacedWords([]);
    setAvailableWords(SENTENCE_GAMES[nextIdx].jumbledWords);
    setSentenceFeedback(null);
  };

  const handleLetterClick = (letter) => {
    setSelectedLetters((prev) => [...prev, letter]);
    setWordFeedback(null);
  };

  const handleClearLetters = () => {
    setSelectedLetters([]);
  };

  const handleCheckWord = () => {
    const formed = selectedLetters.join("");
    const puzzle = WORD_PUZZLES[currentPuzzleIdx];
    const matched = puzzle.hiddenWords.find((item) => item.word === formed);

    if (matched) {
      if (foundWords.includes(matched.word)) {
        setWordFeedback({ type: "info", msg: `ಈಗಾಗಲೇ ಕಂಡುಹಿಡಿಯಲಾಗಿದೆ: "${matched.word}"` });
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
      setWordFeedback({ type: "error", msg: `"${formed}" ಸರಿಯಾದ ಪದವಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ!` });
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
    const q = GK_QUIZ[currentQuestionIdx];
    if (selectedOption === q.correctAnswer) {
      triggerConfetti();
      setTotalScore((s) => s + 25);
    }
  };

  const nextQuizQuestion = () => {
    const next = (currentQuestionIdx + 1) % GK_QUIZ.length;
    setCurrentQuestionIdx(next);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 40%, #ffedd5 100%)",
        color: "#1e293b",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Top Navigation Bar */}
      <header
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #fde68a",
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
            onClick={selectedGame ? () => setSelectedGame(null) : onBackToHome}
            style={{
              background: "#ffffff",
              border: "1px solid #fde68a",
              color: "#b45309",
              padding: "8px 14px",
              borderRadius: "12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.88rem",
              fontWeight: "600",
              boxShadow: "0 2px 6px rgba(217, 119, 6, 0.08)",
            }}
          >
            <ArrowLeft size={16} />
            <span>{selectedGame ? "ಆಟಗಳ ಮೆನು (Games Menu)" : "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ (Dashboard)"}</span>
          </button>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Gamepad2 size={22} color="#d97706" />
              <h1 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#78350f", margin: 0 }}>
                ಕನ್ನಡ ಆಟಗಳು (Play Games)
              </h1>
            </div>
            <p style={{ fontSize: "0.78rem", color: "#b45309", margin: "2px 0 0" }}>
              Vibrant & Playful • Interactive Vocabulary, Sentence Building & Trivia
            </p>
          </div>
        </div>

        {/* Live Score Display */}
        <div
          style={{
            background: "linear-gradient(135deg, #fef3c7, #fed7aa)",
            border: "1.5px solid #f59e0b",
            padding: "8px 18px",
            borderRadius: "9999px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.92rem",
            fontWeight: "800",
            color: "#92400e",
            boxShadow: "0 4px 14px rgba(245, 158, 11, 0.2)",
          }}
        >
          <Trophy size={18} color="#d97706" />
          <span>ಅಂಕಗಳು: {totalScore}</span>
        </div>
      </header>

      {/* Main Container */}
      <div
        style={{
          flex: 1,
          maxWidth: "960px",
          width: "100%",
          margin: "0 auto",
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Games Menu Selection */}
        {!selectedGame && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 10px" }}>
              <h2 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#78350f", marginBottom: "8px" }}>
                ಆಟವಾಡಿ, ಕಲಿಯಿರಿ! 🎯
              </h2>
              <p style={{ fontSize: "0.98rem", color: "#92400e", lineHeight: "1.5" }}>
                Select a game mode below to exercise your grammar skills, spot hidden words, or compete in Karnataka trivia.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              {/* Game 1: Sentence Formation */}
              <div
                onClick={() => setSelectedGame("sentence")}
                style={{
                  background: "#ffffff",
                  border: "2px solid #fed7aa",
                  borderRadius: "20px",
                  padding: "24px",
                  cursor: "pointer",
                  transition: "all 0.25s",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  boxShadow: "0 6px 20px rgba(217, 119, 6, 0.08)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#ea580c";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#fed7aa";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: "#ffedd5",
                    color: "#ea580c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BookOpen size={24} />
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#7c2d12", margin: 0 }}>
                  1. Sentence Formation Game
                </h3>
                <span style={{ fontSize: "0.85rem", color: "#c2410c", fontWeight: 700 }}>ವಾಕ್ಯ ರಚನೆ ಆಟ</span>
                <p style={{ fontSize: "0.9rem", color: "#78350f", lineHeight: "1.5", margin: 0 }}>
                  Rearrange jumbled Kannada words to form grammatically correct Subject-Object-Verb sentences.
                </p>
              </div>

              {/* Game 2: Word Finding Puzzle */}
              <div
                onClick={() => setSelectedGame("word")}
                style={{
                  background: "#ffffff",
                  border: "2px solid #fde68a",
                  borderRadius: "20px",
                  padding: "24px",
                  cursor: "pointer",
                  transition: "all 0.25s",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  boxShadow: "0 6px 20px rgba(245, 158, 11, 0.08)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#d97706";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#fde68a";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: "#fef3c7",
                    color: "#d97706",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Puzzle size={24} />
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#78350f", margin: 0 }}>
                  2. Word Finding Puzzle
                </h3>
                <span style={{ fontSize: "0.85rem", color: "#b45309", fontWeight: 700 }}>ಪದ ಹುಡುಕಿ ಆಟ</span>
                <p style={{ fontSize: "0.9rem", color: "#78350f", lineHeight: "1.5", margin: 0 }}>
                  Tap letters and syllables from the colorful tile bank to extract authentic hidden Kannada words.
                </p>
              </div>

              {/* Game 3: Karnataka GK Quiz */}
              <div
                onClick={() => setSelectedGame("quiz")}
                style={{
                  background: "#ffffff",
                  border: "2px solid #ddd6fe",
                  borderRadius: "20px",
                  padding: "24px",
                  cursor: "pointer",
                  transition: "all 0.25s",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  boxShadow: "0 6px 20px rgba(124, 58, 237, 0.08)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#7c3aed";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#ddd6fe";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: "#ede9fe",
                    color: "#7c3aed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <HelpCircle size={24} />
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#4c1d95", margin: 0 }}>
                  3. Karnataka GK Quiz
                </h3>
                <span style={{ fontSize: "0.85rem", color: "#6d28d9", fontWeight: 700 }}>ಕರ್ನಾಟಕ ಸಾಮಾನ್ಯ ಜ್ಞಾನ</span>
                <p style={{ fontSize: "0.9rem", color: "#5b21b6", lineHeight: "1.5", margin: 0 }}>
                  Test your knowledge of Karnataka's rich literary titans, dynasties, geography and historic monuments.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 1. Sentence Formation Workspace */}
        {selectedGame === "sentence" && (
          <div style={{ background: "#ffffff", border: "2px solid #fed7aa", borderRadius: "24px", padding: "28px", boxShadow: "0 8px 30px rgba(217, 119, 6, 0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "1.3rem", color: "#7c2d12", fontWeight: "800", margin: 0 }}>
                ವಾಕ್ಯ ರಚಿಸಿ (Form the Sentence) • #{currentSentenceIdx + 1}
              </h2>
              <button
                onClick={nextSentence}
                style={{
                  background: "#ffedd5",
                  border: "1px solid #fed7aa",
                  color: "#c2410c",
                  padding: "6px 16px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: "700",
                }}
              >
                ಮುಂದಿನ ವಾಕ್ಯ (Next)
              </button>
            </div>

            <p style={{ color: "#78350f", fontSize: "0.95rem", marginBottom: "18px" }}>
              English Meaning: <strong style={{ color: "#c2410c" }}>"{SENTENCE_GAMES[currentSentenceIdx].english}"</strong>
            </p>

            {/* Placed Words Slot */}
            <div
              style={{
                minHeight: "75px",
                background: "#fff7ed",
                border: "2px dashed #fdba74",
                borderRadius: "16px",
                padding: "14px",
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              {placedWords.length === 0 ? (
                <span style={{ color: "#9a3412", fontSize: "0.92rem", fontStyle: "italic" }}>
                  ಕೆಳಗಿನ ಪದಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ ವಾಕ್ಯ ರಚಿಸಿ (Click words below to arrange here)...
                </span>
              ) : (
                placedWords.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRemovePlacedWord(word, idx)}
                    style={{
                      background: "linear-gradient(135deg, #ea580c, #c2410c)",
                      border: "none",
                      color: "#ffffff",
                      borderRadius: "10px",
                      padding: "8px 16px",
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(194, 65, 12, 0.25)",
                    }}
                    title="Click to remove"
                  >
                    {word} ✕
                  </button>
                ))
              )}
            </div>

            {/* Available Jumbled Words */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#9a3412", marginBottom: "10px" }}>
                ಲಭ್ಯವಿರುವ ಪದಗಳು (Available Words):
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {availableWords.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePickWord(word, idx)}
                    style={{
                      background: "#ffffff",
                      border: "2px solid #fed7aa",
                      color: "#7c2d12",
                      borderRadius: "12px",
                      padding: "10px 20px",
                      fontSize: "1.08rem",
                      fontWeight: "700",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#ea580c")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#fed7aa")}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleVerifySentence}
              disabled={placedWords.length === 0}
              style={{
                background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
                border: "none",
                color: "#ffffff",
                borderRadius: "12px",
                padding: "12px 26px",
                fontWeight: "800",
                fontSize: "0.98rem",
                cursor: placedWords.length === 0 ? "not-allowed" : "pointer",
                opacity: placedWords.length === 0 ? 0.5 : 1,
                boxShadow: "0 4px 14px rgba(194, 65, 12, 0.3)",
              }}
            >
              ಪರಿಶೀಲಿಸಿ (Verify Sentence)
            </button>

            {sentenceFeedback && (
              <div
                style={{
                  marginTop: "18px",
                  padding: "16px",
                  borderRadius: "14px",
                  background: sentenceFeedback.type === "success" ? "#f0fdf4" : "#fef2f2",
                  border: sentenceFeedback.type === "success" ? "1px solid #86efac" : "1px solid #fca5a5",
                  color: sentenceFeedback.type === "success" ? "#166534" : "#991b1b",
                }}
              >
                <div style={{ fontWeight: "800", marginBottom: "4px" }}>{sentenceFeedback.msg}</div>
                {sentenceFeedback.type === "success" && (
                  <div style={{ marginTop: "6px", color: "#1e293b", fontSize: "0.88rem", lineHeight: "1.5" }}>
                    <div><strong>ಉಚ್ಚಾರಣೆ:</strong> {SENTENCE_GAMES[currentSentenceIdx].transliteration}</div>
                    <div><strong>ವ್ಯಾಕರಣ ವಿವರಣೆ:</strong> {SENTENCE_GAMES[currentSentenceIdx].grammarNote}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 2. Word Finding Puzzle */}
        {selectedGame === "word" && (
          <div style={{ background: "#ffffff", border: "2px solid #fde68a", borderRadius: "24px", padding: "28px", boxShadow: "0 8px 30px rgba(245, 158, 11, 0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "1.3rem", color: "#78350f", fontWeight: "800", margin: 0 }}>
                ಪದ ಹುಡುಕಿ (Find Hidden Words) • #{currentPuzzleIdx + 1}
              </h2>
              <button
                onClick={() => {
                  setCurrentPuzzleIdx((prev) => (prev + 1) % WORD_PUZZLES.length);
                  setFoundWords([]);
                  setSelectedLetters([]);
                  setWordFeedback(null);
                }}
                style={{
                  background: "#fef3c7",
                  border: "1px solid #fde68a",
                  color: "#92400e",
                  padding: "6px 16px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: "700",
                }}
              >
                ಮುಂದಿನ ಒಗಟು (Next Puzzle)
              </button>
            </div>

            <p style={{ color: "#78350f", fontSize: "0.95rem", marginBottom: "18px" }}>
              Tap letters below to assemble a hidden Kannada word, then click <strong>"ಪದ ಸಲ್ಲಿಸಿ (Submit Word)"</strong>!
            </p>

            {/* Current Assembled Word */}
            <div
              style={{
                minHeight: "60px",
                background: "#fef3c7",
                border: "2px solid #fcd34d",
                borderRadius: "14px",
                padding: "12px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "#78350f" }}>
                {selectedLetters.join("") || <span style={{ color: "#b45309", fontSize: "0.95rem", fontStyle: "italic" }}>ಅಕ್ಷರಗಳನ್ನು ಆರಿಸಿ...</span>}
              </div>
              {selectedLetters.length > 0 && (
                <button
                  onClick={handleClearLetters}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#dc2626",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: "700",
                  }}
                >
                  ತೆರವುಗೊಳಿಸಿ (Clear)
                </button>
              )}
            </div>

            {/* Letter Tiles Grid */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
              {WORD_PUZZLES[currentPuzzleIdx].letters.map((letter, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLetterClick(letter)}
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "#ffffff",
                    border: "2px solid #fcd34d",
                    color: "#78350f",
                    borderRadius: "14px",
                    fontSize: "1.45rem",
                    fontWeight: "800",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    boxShadow: "0 3px 10px rgba(245, 158, 11, 0.15)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#d97706";
                    e.currentTarget.style.transform = "scale(1.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#fcd34d";
                    e.currentTarget.style.transform = "scale(1)";
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
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                border: "none",
                color: "#ffffff",
                borderRadius: "12px",
                padding: "12px 26px",
                fontWeight: "800",
                fontSize: "0.98rem",
                cursor: selectedLetters.length === 0 ? "not-allowed" : "pointer",
                opacity: selectedLetters.length === 0 ? 0.5 : 1,
                boxShadow: "0 4px 14px rgba(217, 119, 6, 0.25)",
                marginBottom: "20px",
              }}
            >
              ಪದ ಸಲ್ಲಿಸಿ (Submit Word)
            </button>

            {wordFeedback && (
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: wordFeedback.type === "success" ? "#f0fdf4" : "#fef2f2",
                  color: wordFeedback.type === "success" ? "#166534" : "#991b1b",
                  fontWeight: 700,
                  fontSize: "0.92rem",
                  marginBottom: "16px",
                }}
              >
                {wordFeedback.msg}
              </div>
            )}

            {/* Found Words List */}
            <div>
              <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#78350f", marginBottom: "8px" }}>
                ಕಂಡುಹಿಡಿದ ಪದಗಳು ({foundWords.length}/{WORD_PUZZLES[currentPuzzleIdx].hiddenWords.length}):
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {WORD_PUZZLES[currentPuzzleIdx].hiddenWords.map((item, idx) => {
                  const isFound = foundWords.includes(item.word);
                  return (
                    <span
                      key={idx}
                      style={{
                        background: isFound ? "#f0fdf4" : "#f8fafc",
                        border: isFound ? "1.5px solid #22c55e" : "1.5px solid #e2e8f0",
                        color: isFound ? "#15803d" : "#94a3b8",
                        padding: "8px 16px",
                        borderRadius: "10px",
                        fontSize: "0.92rem",
                        fontWeight: "700",
                      }}
                    >
                      {isFound ? `${item.word} (${item.transliteration} - ${item.meaning})` : "???"}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 3. Karnataka GK Quiz */}
        {selectedGame === "quiz" && (
          <div style={{ background: "#ffffff", border: "2px solid #ddd6fe", borderRadius: "24px", padding: "28px", boxShadow: "0 8px 30px rgba(124, 58, 237, 0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ fontSize: "0.9rem", color: "#7c3aed", fontWeight: "700" }}>
                ಪ್ರಶ್ನೆ {currentQuestionIdx + 1} / {GK_QUIZ.length}
              </span>
              <button
                onClick={nextQuizQuestion}
                style={{
                  background: "#ede9fe",
                  border: "1px solid #ddd6fe",
                  color: "#6d28d9",
                  padding: "6px 16px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: "700",
                }}
              >
                ಮುಂದಿನ ಪ್ರಶ್ನೆ (Next)
              </button>
            </div>

            <h2 style={{ fontSize: "1.25rem", color: "#4c1d95", fontWeight: "800", lineHeight: "1.5", marginBottom: "6px" }}>
              {GK_QUIZ[currentQuestionIdx].question}
            </h2>
            <p style={{ color: "#6b21a8", fontSize: "0.88rem", fontStyle: "italic", marginBottom: "22px" }}>
              {GK_QUIZ[currentQuestionIdx].transliteration}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "22px" }}>
              {GK_QUIZ[currentQuestionIdx].options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === GK_QUIZ[currentQuestionIdx].correctAnswer;

                let bg = "#ffffff";
                let border = "#e2e8f0";
                let textCol = "#1e293b";

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    bg = "#f0fdf4";
                    border = "#22c55e";
                    textCol = "#15803d";
                  } else if (isSelected && !isCorrect) {
                    bg = "#fef2f2";
                    border = "#ef4444";
                    textCol = "#b91c1c";
                  }
                } else if (isSelected) {
                  border = "#7c3aed";
                  bg = "#f5f3ff";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectQuizOption(idx)}
                    disabled={isAnswerSubmitted}
                    style={{
                      background: bg,
                      border: `2px solid ${border}`,
                      color: textCol,
                      borderRadius: "14px",
                      padding: "16px 20px",
                      textAlign: "left",
                      cursor: isAnswerSubmitted ? "default" : "pointer",
                      fontSize: "0.98rem",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.15s",
                    }}
                  >
                    <span>{option}</span>
                    {isAnswerSubmitted && isCorrect && <CheckCircle2 size={20} color="#16a34a" />}
                    {isAnswerSubmitted && isSelected && !isCorrect && <XCircle size={20} color="#dc2626" />}
                  </button>
                );
              })}
            </div>

            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={selectedOption === null}
                style={{
                  background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                  border: "none",
                  color: "#ffffff",
                  borderRadius: "12px",
                  padding: "12px 26px",
                  fontWeight: "800",
                  fontSize: "0.98rem",
                  cursor: selectedOption === null ? "not-allowed" : "pointer",
                  opacity: selectedOption === null ? 0.5 : 1,
                  boxShadow: "0 4px 14px rgba(124, 58, 237, 0.3)",
                }}
              >
                ಉತ್ತರ ಸಲ್ಲಿಸಿ (Submit Answer)
              </button>
            ) : (
              <div
                style={{
                  padding: "16px",
                  borderRadius: "14px",
                  background: selectedOption === GK_QUIZ[currentQuestionIdx].correctAnswer ? "#f0fdf4" : "#fef2f2",
                  border: selectedOption === GK_QUIZ[currentQuestionIdx].correctAnswer ? "1px solid #86efac" : "1px solid #fca5a5",
                }}
              >
                <div style={{ fontWeight: 800, color: selectedOption === GK_QUIZ[currentQuestionIdx].correctAnswer ? "#15803d" : "#b91c1c", marginBottom: "6px" }}>
                  {selectedOption === GK_QUIZ[currentQuestionIdx].correctAnswer ? "ಸರಿಯಾದ ಉತ್ತರ! (+25 Points ಗಳಿಸಿದ್ದೀರಿ!)" : "ತಪ್ಪಾದ ಉತ್ತರ"}
                </div>
                <p style={{ margin: 0, color: "#334155", fontSize: "0.9rem", lineHeight: "1.5" }}>
                  {GK_QUIZ[currentQuestionIdx].explanation}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
