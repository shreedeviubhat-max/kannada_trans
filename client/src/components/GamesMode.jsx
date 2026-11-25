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

// 1. Sentence Formation Game Data
const SENTENCE_GAMES = [
  {
    id: 1,
    jumbledWords: ["ಹೋಗುತ್ತೇನೆ", "ಶಾಲೆಗೆ", "ನಾನು", "ದಿನವೂ"],
    correctOrder: ["ನಾನು", "ದಿನವೂ", "ಶಾಲೆಗೆ", "ಹೋಗುತ್ತೇನೆ"],
    transliteration: "Nānu dinavū śālege hōguttēne.",
    english: "I go to school every day.",
    grammarNote: "Subject (ನಾನು) + Adverb (ದಿನವೂ) + Indirect Object (ಶಾಲೆಗೆ) + Verb (ಹೋಗುತ್ತೇನೆ). Standard Kannada SOV structure.",
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
    explanation: "ಹಂಪಿ (Hampi), situated along the Tungabhadra, was the historic capital of the Vijayanagara Empire.",
  },
  {
    id: 4,
    question: "ಕನ್ನಡದ ಅತ್ಯಂತ ಪ್ರಾಚೀನ ಶಾಸನ ಯಾವುದು?",
    transliteration: "Kannaḍada atyanta prācīna śāsana yāvudu?",
    options: ["ಹಲ್ಮಿಡಿ ಶಾಸನ (Halmidi Inscription)", "ಬಾದಾಮಿ ಶಾಸನ (Badami)", "ಶ್ರವಣಬೆಳಗೊಳ ಶಾಸನ (Shravanabelagola)", "ಐಹೊಳೆ ಶಾಸನ (Aihole)"],
    correctAnswer: 0,
    explanation: "The Halmidi stone inscription (c. 450 CE) during the Kadamba era is the earliest known Kannada inscription.",
  },
];

export default function GamesMode({ onBackToHome }) {
  const [activeTab, setActiveTab] = useState("sentence"); // 'sentence' | 'word' | 'quiz'
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
    const current = SENTENCE_GAMES[currentSentenceIdx];
    const isCorrect = placedWords.join(" ") === current.correctOrder.join(" ");

    if (isCorrect) {
      triggerConfetti();
      setTotalScore((s) => s + 20);
      setSentenceFeedback({
        type: "success",
        msg: "ಸರಿಯಾದ ರಚನೆ (Correct sentence structure)",
      });
    } else {
      setSentenceFeedback({
        type: "error",
        msg: "ಇನ್ನೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ (Try again — check SOV order)",
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
        backgroundColor: "#fffdf9", // Pastel peach canvas
        color: "#0f172a",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Top Header */}
      <header
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #fed7aa",
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
              border: "1px solid #cbd5e1",
              color: "#334155",
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
            <h1 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#9a3412", margin: 0 }}>
              ಭಾಷಾ ಆಟಗಳು <span style={{ fontWeight: "400", color: "#64748b" }}>/ Play Games</span>
            </h1>
          </div>
        </div>

        {/* Score pill */}
        <div
          style={{
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            padding: "6px 14px",
            borderRadius: "9999px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.86rem",
            fontWeight: "700",
            color: "#c2410c",
          }}
        >
          <Trophy size={15} color="#ea580c" />
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
            borderBottom: "1px solid #fed7aa",
            paddingBottom: "12px",
            marginBottom: "24px",
          }}
        >
          <button
            onClick={() => setActiveTab("sentence")}
            style={{
              background: activeTab === "sentence" ? "#ffedd5" : "transparent",
              color: activeTab === "sentence" ? "#9a3412" : "#64748b",
              border: "none",
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
              background: activeTab === "word" ? "#ffedd5" : "transparent",
              color: activeTab === "word" ? "#9a3412" : "#64748b",
              border: "none",
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
              background: activeTab === "quiz" ? "#ffedd5" : "transparent",
              color: activeTab === "quiz" ? "#9a3412" : "#64748b",
              border: "none",
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

        {/* 1. Sentence Builder Tab */}
        {activeTab === "sentence" && (
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #fed7aa",
              borderRadius: "14px",
              padding: "28px",
              boxShadow: "0 2px 10px rgba(234, 88, 12, 0.04)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "0.8rem", color: "#9a3412", fontWeight: "600", textTransform: "uppercase" }}>
                Exercise {currentSentenceIdx + 1} of {SENTENCE_GAMES.length}
              </span>
              <button
                onClick={nextSentence}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ea580c",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Next ➔
              </button>
            </div>

            <p style={{ fontSize: "1.05rem", color: "#334155", marginBottom: "20px" }}>
              Arrange the words to say: <strong style={{ color: "#0f172a" }}>"{SENTENCE_GAMES[currentSentenceIdx].english}"</strong>
            </p>

            {/* Placed Words Slot */}
            <div
              style={{
                minHeight: "68px",
                background: "#fffaf5",
                border: "1.5px dashed #fed7aa",
                borderRadius: "10px",
                padding: "12px",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              {placedWords.length === 0 ? (
                <span style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                  Select words below in correct sequence...
                </span>
              ) : (
                placedWords.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRemovePlacedWord(word, idx)}
                    style={{
                      background: "#ea580c",
                      border: "none",
                      color: "#ffffff",
                      borderRadius: "6px",
                      padding: "7px 14px",
                      fontSize: "0.98rem",
                      fontWeight: "600",
                      cursor: "pointer",
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
                    background: "#ffffff",
                    border: "1px solid #fed7aa",
                    color: "#7c2d12",
                    borderRadius: "8px",
                    padding: "9px 16px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#ea580c")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#fed7aa")}
                >
                  {word}
                </button>
              ))}
            </div>

            <button
              onClick={handleVerifySentence}
              disabled={placedWords.length === 0}
              style={{
                background: placedWords.length > 0 ? "#ea580c" : "#f1f5f9",
                color: placedWords.length > 0 ? "#ffffff" : "#94a3b8",
                border: "none",
                borderRadius: "8px",
                padding: "10px 22px",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: placedWords.length > 0 ? "pointer" : "not-allowed",
              }}
            >
              Check Answer
            </button>

            {sentenceFeedback && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "14px 16px",
                  borderRadius: "8px",
                  background: sentenceFeedback.type === "success" ? "#f0fdf4" : "#fef2f2",
                  border: sentenceFeedback.type === "success" ? "1px solid #bbf7d0" : "1px solid #fecaca",
                  color: sentenceFeedback.type === "success" ? "#166534" : "#991b1b",
                  fontSize: "0.9rem",
                }}
              >
                <div style={{ fontWeight: "700" }}>{sentenceFeedback.msg}</div>
                {sentenceFeedback.type === "success" && (
                  <div style={{ marginTop: "6px", color: "#334155", fontSize: "0.85rem" }}>
                    <div><strong>Reading:</strong> {SENTENCE_GAMES[currentSentenceIdx].transliteration}</div>
                    <div style={{ marginTop: "2px" }}><strong>Grammar:</strong> {SENTENCE_GAMES[currentSentenceIdx].grammarNote}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 2. Word Discovery Tab */}
        {activeTab === "word" && (
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #fed7aa",
              borderRadius: "14px",
              padding: "28px",
              boxShadow: "0 2px 10px rgba(234, 88, 12, 0.04)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ fontSize: "0.8rem", color: "#9a3412", fontWeight: "600", textTransform: "uppercase" }}>
                Puzzle {currentPuzzleIdx + 1} of {WORD_PUZZLES.length}
              </span>
              <button
                onClick={() => {
                  setCurrentPuzzleIdx((prev) => (prev + 1) % WORD_PUZZLES.length);
                  setFoundWords([]);
                  setSelectedLetters([]);
                  setWordFeedback(null);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ea580c",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Next Puzzle ➔
              </button>
            </div>

            <p style={{ fontSize: "0.98rem", color: "#475569", marginBottom: "16px" }}>
              Tap letters below to discover hidden Kannada words:
            </p>

            {/* Assembled Letters Bar */}
            <div
              style={{
                minHeight: "54px",
                background: "#fffaf5",
                border: "1px solid #fed7aa",
                borderRadius: "8px",
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "#7c2d12" }}>
                {selectedLetters.join("") || <span style={{ color: "#94a3b8", fontSize: "0.9rem", fontWeight: "400" }}>Selected letters appear here...</span>}
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
              {WORD_PUZZLES[currentPuzzleIdx].letters.map((letter, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLetterClick(letter)}
                  style={{
                    width: "52px",
                    height: "52px",
                    background: "#ffffff",
                    border: "1.5px solid #fed7aa",
                    color: "#7c2d12",
                    borderRadius: "10px",
                    fontSize: "1.3rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#ea580c";
                    e.currentTarget.style.backgroundColor = "#fff7ed";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#fed7aa";
                    e.currentTarget.style.backgroundColor = "#ffffff";
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
                background: selectedLetters.length > 0 ? "#ea580c" : "#f1f5f9",
                color: selectedLetters.length > 0 ? "#ffffff" : "#94a3b8",
                border: "none",
                borderRadius: "8px",
                padding: "9px 20px",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: selectedLetters.length > 0 ? "pointer" : "not-allowed",
                marginBottom: "18px",
              }}
            >
              Submit Word
            </button>

            {wordFeedback && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: wordFeedback.type === "success" ? "#f0fdf4" : "#fef2f2",
                  color: wordFeedback.type === "success" ? "#166534" : "#991b1b",
                  fontSize: "0.88rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                {wordFeedback.msg}
              </div>
            )}

            {/* Discovered Words list */}
            <div>
              <div style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: "600", marginBottom: "8px" }}>
                Found Words ({foundWords.length}/{WORD_PUZZLES[currentPuzzleIdx].hiddenWords.length}):
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {WORD_PUZZLES[currentPuzzleIdx].hiddenWords.map((item, idx) => {
                  const isFound = foundWords.includes(item.word);
                  return (
                    <span
                      key={idx}
                      style={{
                        background: isFound ? "#f0fdf4" : "#f8fafc",
                        border: isFound ? "1px solid #bbf7d0" : "1px solid #e2e8f0",
                        color: isFound ? "#15803d" : "#94a3b8",
                        padding: "6px 12px",
                        borderRadius: "6px",
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

        {/* 3. Karnataka Trivia Tab */}
        {activeTab === "quiz" && (
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #fed7aa",
              borderRadius: "14px",
              padding: "28px",
              boxShadow: "0 2px 10px rgba(234, 88, 12, 0.04)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ fontSize: "0.8rem", color: "#9a3412", fontWeight: "600", textTransform: "uppercase" }}>
                Question {currentQuestionIdx + 1} of {GK_QUIZ.length}
              </span>
              <button
                onClick={nextQuizQuestion}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ea580c",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Next ➔
              </button>
            </div>

            <h2 style={{ fontSize: "1.18rem", color: "#0f172a", fontWeight: "700", lineHeight: "1.45", marginBottom: "4px" }}>
              {GK_QUIZ[currentQuestionIdx].question}
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.85rem", fontStyle: "italic", marginBottom: "20px" }}>
              {GK_QUIZ[currentQuestionIdx].transliteration}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              {GK_QUIZ[currentQuestionIdx].options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === GK_QUIZ[currentQuestionIdx].correctAnswer;

                let border = "#e2e8f0";
                let bg = "#ffffff";
                let textCol = "#1e293b";

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    border = "#22c55e";
                    bg = "#f0fdf4";
                    textCol = "#15803d";
                  } else if (isSelected && !isCorrect) {
                    border = "#ef4444";
                    bg = "#fef2f2";
                    textCol = "#b91c1c";
                  }
                } else if (isSelected) {
                  border = "#ea580c";
                  bg = "#fff7ed";
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
                      borderRadius: "10px",
                      padding: "14px 18px",
                      textAlign: "left",
                      fontSize: "0.95rem",
                      fontWeight: "500",
                      cursor: isAnswerSubmitted ? "default" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{option}</span>
                    {isAnswerSubmitted && isCorrect && <CheckCircle2 size={18} color="#16a34a" />}
                    {isAnswerSubmitted && isSelected && !isCorrect && <XCircle size={18} color="#dc2626" />}
                  </button>
                );
              })}
            </div>

            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={selectedOption === null}
                style={{
                  background: selectedOption !== null ? "#ea580c" : "#f1f5f9",
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
                  background: selectedOption === GK_QUIZ[currentQuestionIdx].correctAnswer ? "#f0fdf4" : "#fef2f2",
                  border: selectedOption === GK_QUIZ[currentQuestionIdx].correctAnswer ? "1px solid #bbf7d0" : "1px solid #fecaca",
                  color: "#334155",
                  fontSize: "0.88rem",
                  lineHeight: "1.5",
                }}
              >
                <div style={{ fontWeight: "700", color: selectedOption === GK_QUIZ[currentQuestionIdx].correctAnswer ? "#15803d" : "#991b1b", marginBottom: "4px" }}>
                  {selectedOption === GK_QUIZ[currentQuestionIdx].correctAnswer ? "ಸರಿ (Correct!)" : "ತಪ್ಪು (Incorrect)"}
                </div>
                {GK_QUIZ[currentQuestionIdx].explanation}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
