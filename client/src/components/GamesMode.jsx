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
  BookOpen
} from "lucide-react";

// 1. Sentence Formation Game Data
const SENTENCE_GAMES = [
  {
    id: 1,
    jumbledWords: ["ಹೋಗುತ್ತೇನೆ", "ಶಾಲೆಗೆ", "ನಾನು", "ದಿನವೂ"],
    correctOrder: ["ನಾನು", "ದಿನವೂ", "ಶಾಲೆಗೆ", "ಹೋಗುತ್ತೇನೆ"],
    transliteration: "Nānu dinavū śālege hōguttēne.",
    english: "I go to school every day.",
    grammarNote: "Subject (ನಾನು) + Adverb (ದಿನವೂ) + Indirect Object/Dative (ಶಾಲೆಗೆ - ಶಾಲಾ + ಗೆ dative) + Verb (ಹೋಗುತ್ತೇನೆ). Follows SOV word order.",
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
    grammarNote: "Subject (ರೇಖಾ) + Accusative object with -ಅನ್ನು suffix (ಪುಸ್ತಕವನ್ನು) + Adverb (ಚೆನ್ನಾಗಿ) + Verb (ಬರೆಯುತ್ತಾಳೆ).",
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
    explanation: "ಕುವೆಂಪು (K. V. Puttappa) received the first Jnanpith award for Kannada in 1967 for his epic 'ಶ್ರೀ ರಾಮಾಯಣ ದರ್ಶನಂ' (Sri Ramayana Darshanam).",
  },
  {
    id: 2,
    question: "ಕರ್ನಾಟಕದ ನಾಡಗೀತೆ 'ಜಯ ಭಾರತ ಜನನಿಯ ತನುಜಾತೆ' ರಚಿಸಿದವರು ಯಾರು?",
    transliteration: "Karnāṭakada nāḍagīte 'Jaya Bhārata Jananiya Tanujāte' racisidavaru yāru?",
    options: ["ಕುವೆಂಪು (Kuvempu)", "ಬಿ. ಎಂ. ಶ್ರೀಕಂಠಯ್ಯ (BM Sri)", "ಚನ್ನವೀರ ಕಣವಿ (Kanavi)", "ಜಿ. ಎಸ್. ಶಿವರುದ್ರಪ್ಪ (GSS)"],
    correctAnswer: 0,
    explanation: "Rashtrakavi Kuvempu penned Karnataka's official state anthem, celebrating Karnataka as the revered daughter of Mother India.",
  },
  {
    id: 3,
    question: "ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯದ ರಾಜಧಾನಿಯಾಗಿದ್ದ ಐತಿಹಾಸಿಕ ತಾಣ ಯಾವುದು?",
    transliteration: "Vijayanagara sāmrājyada rājadhāniyāgiddha aitihāsika tāṇa yāvudu?",
    options: ["ಹಂಪಿ (Hampi)", "ಬಾದಾಮಿ (Badami)", "ಬೇಲೂರು (Belur)", "ಪಟ್ಟದಕಲ್ಲು (Pattadakal)"],
    correctAnswer: 0,
    explanation: "ಹಂಪಿ (Hampi), situated on the banks of the Tungabhadra River, was the magnificent capital of the Vijayanagara Empire and is now a UNESCO World Heritage site.",
  },
  {
    id: 4,
    question: "ಕನ್ನಡದ ಅತ್ಯಂತ ಪ್ರಾಚೀನ ಶಾಸನ ಯಾವುದು?",
    transliteration: "Kannaḍada atyanta prācīna śāsana yāvudu?",
    options: ["ಹಲ್ಮಿಡಿ ಶಾಸನ (Halmidi Inscription)", "ಬಾದಾಮಿ ಶಾಸನ (Badami)", "ಶ್ರವಣಬೆಳಗೊಳ ಶಾಸನ (Shravanabelagola)", "ಐಹೊಳೆ ಶಾಸನ (Aihole)"],
    correctAnswer: 0,
    explanation: "The Halmidi inscription (ಹಲ್ಮಿಡಿ ಶಾಸನ), dated to around 450 CE during the Kadamba dynasty rule, is the earliest known Kannada stone inscription.",
  },
];

export default function GamesMode({ onBackToHome }) {
  const [selectedGame, setSelectedGame] = useState(null); // 'sentence' | 'word' | 'quiz'
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
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#ef4444", "#facc15", "#22c55e"],
    });
  };

  // Sentence formation handlers
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

  // Word puzzle handlers
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

  // Quiz handlers
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
      {/* Header */}
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
            onClick={selectedGame ? () => setSelectedGame(null) : onBackToHome}
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
            <span>{selectedGame ? "ಆಟಗಳ ಪಟ್ಟಿ (Games Menu)" : "ಹಿಂದೆ (Home)"}</span>
          </button>

          <div>
            <h1 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#ffffff" }}>
              ಕನ್ನಡ ಭಾಷಾ ಆಟಗಳು (Kannada Games)
            </h1>
            <p style={{ fontSize: "0.76rem", color: "#facc15" }}>
              "ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ" • Interactive Learning
            </p>
          </div>
        </div>

        {/* Live Score Counter */}
        <div
          style={{
            background: "linear-gradient(135deg, #18181b, #27272a)",
            border: "1px solid rgba(250, 204, 21, 0.4)",
            padding: "8px 16px",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.88rem",
            fontWeight: "700",
            color: "#facc15",
          }}
        >
          <Trophy size={16} color="#facc15" />
          <span>ಅಂಕಗಳು: {totalScore}</span>
        </div>
      </header>

      {/* Main Games Menu if none selected */}
      {!selectedGame && (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginTop: "12px" }}>
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#fef08a" }}>
              ಒಂದು ಆಟವನ್ನು ಆರಿಸಿ (Choose a Game to Play)
            </h2>
            <p style={{ fontSize: "0.88rem", color: "#a1a1aa", marginTop: "4px" }}>
              Select a game below to practice sentence grammar, test your vocabulary, or take a trivia quiz!
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "18px",
            }}
          >
            {/* Game 1: Sentence Formation */}
            <div
              onClick={() => setSelectedGame("sentence")}
              style={{
                background: "#121215",
                border: "1px solid #27272a",
                borderRadius: "16px",
                padding: "20px",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#ef4444";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#27272a";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  background: "rgba(239, 68, 68, 0.15)",
                  color: "#f87171",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BookOpen size={20} />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#ffffff" }}>
                1. Sentence Formation Game
              </h3>
              <p style={{ fontSize: "0.82rem", color: "#fca5a5" }}>ವಾಕ್ಯ ರಚನೆ ಆಟ</p>
              <p style={{ fontSize: "0.85rem", color: "#9ca3af", lineHeight: "1.4" }}>
                Rearrange randomized Kannada words to build a grammatically correct sentence adhering to Subject-Object-Verb (SOV) order.
              </p>
            </div>

            {/* Game 2: Word Finding Puzzle */}
            <div
              onClick={() => setSelectedGame("word")}
              style={{
                background: "#121215",
                border: "1px solid #27272a",
                borderRadius: "16px",
                padding: "20px",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#facc15";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#27272a";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  background: "rgba(250, 204, 21, 0.15)",
                  color: "#facc15",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Puzzle size={20} />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#ffffff" }}>
                2. Word Finding Puzzle
              </h3>
              <p style={{ fontSize: "0.82rem", color: "#fef08a" }}>ಪದ ಹುಡುಕಿ ಆಟ</p>
              <p style={{ fontSize: "0.85rem", color: "#9ca3af", lineHeight: "1.4" }}>
                Combine letters and syllables from the letter bank to discover hidden authentic Kannada words.
              </p>
            </div>

            {/* Game 3: Kannada GK Quiz */}
            <div
              onClick={() => setSelectedGame("quiz")}
              style={{
                background: "#121215",
                border: "1px solid #27272a",
                borderRadius: "16px",
                padding: "20px",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#60a5fa";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#27272a";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  background: "rgba(96, 165, 250, 0.15)",
                  color: "#60a5fa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <HelpCircle size={20} />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#ffffff" }}>
                3. Kannada GK Quiz
              </h3>
              <p style={{ fontSize: "0.82rem", color: "#93c5fd" }}>ಕರ್ನಾಟಕ ಸಾಮಾನ್ಯ ಜ್ಞಾನ</p>
              <p style={{ fontSize: "0.85rem", color: "#9ca3af", lineHeight: "1.4" }}>
                Trivia testing your knowledge on Karnataka's historic literature, poets, heritage, and geography.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* GAME 1: Sentence Formation Game */}
      {selectedGame === "sentence" && (
        <div style={{ background: "#121215", border: "1px solid #27272a", borderRadius: "16px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "1.2rem", color: "#ffffff", fontWeight: "700" }}>
              ವಾಕ್ಯ ರಚಿಸಿ (Form the Sentence) • #{currentSentenceIdx + 1}
            </h2>
            <button
              onClick={nextSentence}
              style={{
                background: "#27272a",
                border: "none",
                color: "#ffffff",
                padding: "6px 14px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              ಮುಂದಿನ ಪ್ರಶ್ನೆ (Next)
            </button>
          </div>

          <p style={{ color: "#a1a1aa", fontSize: "0.9rem", marginBottom: "16px" }}>
            Meaning in English: <strong style={{ color: "#fef08a" }}>"{SENTENCE_GAMES[currentSentenceIdx].english}"</strong>
          </p>

          {/* Formed Sentence Workspace */}
          <div
            style={{
              minHeight: "70px",
              background: "#18181b",
              border: "2px dashed #3f3f46",
              borderRadius: "12px",
              padding: "12px",
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            {placedWords.length === 0 ? (
              <span style={{ color: "#71717a", fontSize: "0.88rem" }}>
                ಕೆಳಗಿನ ಪದಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ ವಾಕ್ಯ ರಚಿಸಿ (Click words below to place here)...
              </span>
            ) : (
              placedWords.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRemovePlacedWord(word, idx)}
                  style={{
                    background: "#b91c1c",
                    border: "none",
                    color: "#ffffff",
                    borderRadius: "8px",
                    padding: "8px 14px",
                    fontSize: "1rem",
                    cursor: "pointer",
                  }}
                  title="Click to remove"
                >
                  {word} ✕
                </button>
              ))
            )}
          </div>

          {/* Pool of Available Jumbled Words */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "0.85rem", color: "#71717a", marginBottom: "8px" }}>
              ಲಭ್ಯವಿರುವ ಪದಗಳು (Available Words):
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {availableWords.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePickWord(word, idx)}
                  style={{
                    background: "#27272a",
                    border: "1px solid #3f3f46",
                    color: "#ffffff",
                    borderRadius: "8px",
                    padding: "10px 18px",
                    fontSize: "1.05rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#facc15")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#3f3f46")}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>

          {/* Verify Button */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button
              onClick={handleVerifySentence}
              disabled={placedWords.length === 0}
              style={{
                background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                border: "none",
                color: "#ffffff",
                borderRadius: "10px",
                padding: "10px 22px",
                fontWeight: "700",
                fontSize: "0.95rem",
                cursor: placedWords.length === 0 ? "not-allowed" : "pointer",
                opacity: placedWords.length === 0 ? 0.5 : 1,
              }}
            >
              ಪರಿಶೀಲಿಸಿ (Verify Sentence)
            </button>
          </div>

          {/* Feedback & Grammar Explanation */}
          {sentenceFeedback && (
            <div
              style={{
                marginTop: "16px",
                padding: "14px",
                borderRadius: "10px",
                background: sentenceFeedback.type === "success" ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                border: sentenceFeedback.type === "success" ? "1px solid #22c55e" : "1px solid #ef4444",
                color: sentenceFeedback.type === "success" ? "#86efac" : "#fca5a5",
                fontSize: "0.9rem",
              }}
            >
              <div style={{ fontWeight: "700", marginBottom: "4px" }}>{sentenceFeedback.msg}</div>
              {sentenceFeedback.type === "success" && (
                <div style={{ marginTop: "6px", color: "#e5e7eb", fontSize: "0.85rem", lineHeight: "1.5" }}>
                  <div><strong>Transliteration:</strong> {SENTENCE_GAMES[currentSentenceIdx].transliteration}</div>
                  <div><strong>Grammar Breakdown:</strong> {SENTENCE_GAMES[currentSentenceIdx].grammarNote}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* GAME 2: Word Finding Puzzle */}
      {selectedGame === "word" && (
        <div style={{ background: "#121215", border: "1px solid #27272a", borderRadius: "16px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "1.2rem", color: "#ffffff", fontWeight: "700" }}>
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
                background: "#27272a",
                border: "none",
                color: "#ffffff",
                padding: "6px 14px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              ಮುಂದಿನ ಒಗಟು (Next Puzzle)
            </button>
          </div>

          <p style={{ color: "#a1a1aa", fontSize: "0.9rem", marginBottom: "16px" }}>
            Click letters to assemble a valid Kannada word, then click <strong>"ಪದ ಸಲ್ಲಿಸಿ (Submit Word)"</strong>!
          </p>

          {/* Current Word Being Built */}
          <div
            style={{
              minHeight: "55px",
              background: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: "10px",
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <div style={{ fontSize: "1.3rem", fontWeight: "700", color: "#facc15" }}>
              {selectedLetters.join("") || <span style={{ color: "#71717a", fontSize: "0.9rem" }}>ಪದ ರಚಿಸಿ...</span>}
            </div>
            {selectedLetters.length > 0 && (
              <button
                onClick={handleClearLetters}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#f87171",
                  cursor: "pointer",
                  fontSize: "0.82rem",
                }}
              >
                ತೆರವುಗೊಳಿಸಿ (Clear)
              </button>
            )}
          </div>

          {/* Syllable / Letter Tiles */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
            {WORD_PUZZLES[currentPuzzleIdx].letters.map((letter, idx) => (
              <button
                key={idx}
                onClick={() => handleLetterClick(letter)}
                style={{
                  width: "55px",
                  height: "55px",
                  background: "#27272a",
                  border: "2px solid #3f3f46",
                  color: "#ffffff",
                  borderRadius: "12px",
                  fontSize: "1.3rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#facc15";
                  e.currentTarget.style.transform = "scale(1.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#3f3f46";
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
              background: "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)",
              border: "none",
              color: "#000000",
              borderRadius: "10px",
              padding: "10px 22px",
              fontWeight: "700",
              fontSize: "0.95rem",
              cursor: selectedLetters.length === 0 ? "not-allowed" : "pointer",
              opacity: selectedLetters.length === 0 ? 0.5 : 1,
              marginBottom: "16px",
            }}
          >
            ಪದ ಸಲ್ಲಿಸಿ (Submit Word)
          </button>

          {wordFeedback && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                background: wordFeedback.type === "success" ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                color: wordFeedback.type === "success" ? "#86efac" : "#fca5a5",
                fontSize: "0.88rem",
                marginBottom: "14px",
              }}
            >
              {wordFeedback.msg}
            </div>
          )}

          {/* Found Words List */}
          <div>
            <div style={{ fontSize: "0.85rem", color: "#a1a1aa", marginBottom: "6px" }}>
              ಕಂಡುಹಿಡಿದ ಪದಗಳು ({foundWords.length}/{WORD_PUZZLES[currentPuzzleIdx].hiddenWords.length}):
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {WORD_PUZZLES[currentPuzzleIdx].hiddenWords.map((item, idx) => {
                const isFound = foundWords.includes(item.word);
                return (
                  <span
                    key={idx}
                    style={{
                      background: isFound ? "rgba(34, 197, 94, 0.2)" : "#1f1f23",
                      border: isFound ? "1px solid #22c55e" : "1px solid #27272a",
                      color: isFound ? "#86efac" : "#71717a",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                    }}
                  >
                    {isFound ? `${item.word} (${item.transliteration})` : "???"}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* GAME 3: Karnataka GK Quiz */}
      {selectedGame === "quiz" && (
        <div style={{ background: "#121215", border: "1px solid #27272a", borderRadius: "16px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "0.85rem", color: "#60a5fa", fontWeight: "600" }}>
              ಪ್ರಶ್ನೆ {currentQuestionIdx + 1} of {GK_QUIZ.length}
            </span>
            <button
              onClick={nextQuizQuestion}
              style={{
                background: "#27272a",
                border: "none",
                color: "#ffffff",
                padding: "6px 14px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              ಮುಂದಿನ ಪ್ರಶ್ನೆ (Next)
            </button>
          </div>

          <h2 style={{ fontSize: "1.15rem", color: "#ffffff", fontWeight: "700", lineHeight: "1.5", marginBottom: "6px" }}>
            {GK_QUIZ[currentQuestionIdx].question}
          </h2>
          <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "20px" }}>
            <em>{GK_QUIZ[currentQuestionIdx].transliteration}</em>
          </p>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
            {GK_QUIZ[currentQuestionIdx].options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === GK_QUIZ[currentQuestionIdx].correctAnswer;

              let bg = "#18181b";
              let border = "#27272a";
              let textCol = "#ffffff";

              if (isAnswerSubmitted) {
                if (isCorrect) {
                  bg = "rgba(34, 197, 94, 0.2)";
                  border = "#22c55e";
                  textCol = "#86efac";
                } else if (isSelected && !isCorrect) {
                  bg = "rgba(239, 68, 68, 0.2)";
                  border = "#ef4444";
                  textCol = "#fca5a5";
                }
              } else if (isSelected) {
                border = "#60a5fa";
                bg = "rgba(96, 165, 250, 0.1)";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectQuizOption(idx)}
                  disabled={isAnswerSubmitted}
                  style={{
                    background: bg,
                    border: `1px solid ${border}`,
                    color: textCol,
                    borderRadius: "10px",
                    padding: "14px 18px",
                    textAlign: "left",
                    cursor: isAnswerSubmitted ? "default" : "pointer",
                    fontSize: "0.95rem",
                    transition: "all 0.15s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{option}</span>
                  {isAnswerSubmitted && isCorrect && <CheckCircle2 size={18} color="#22c55e" />}
                  {isAnswerSubmitted && isSelected && !isCorrect && <XCircle size={18} color="#ef4444" />}
                </button>
              );
            })}
          </div>

          {!isAnswerSubmitted ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={selectedOption === null}
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                border: "none",
                color: "#ffffff",
                borderRadius: "10px",
                padding: "10px 22px",
                fontWeight: "700",
                fontSize: "0.95rem",
                cursor: selectedOption === null ? "not-allowed" : "pointer",
                opacity: selectedOption === null ? 0.5 : 1,
              }}
            >
              ಉತ್ತರ ಸಲ್ಲಿಸಿ (Submit Answer)
            </button>
          ) : (
            <div
              style={{
                padding: "14px",
                borderRadius: "10px",
                background: selectedOption === GK_QUIZ[currentQuestionIdx].correctAnswer ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                border: selectedOption === GK_QUIZ[currentQuestionIdx].correctAnswer ? "1px solid #22c55e" : "1px solid #ef4444",
                fontSize: "0.88rem",
                color: "#e5e7eb",
              }}
            >
              <div style={{ fontWeight: "700", color: selectedOption === GK_QUIZ[currentQuestionIdx].correctAnswer ? "#86efac" : "#fca5a5", marginBottom: "6px" }}>
                {selectedOption === GK_QUIZ[currentQuestionIdx].correctAnswer ? "ಸರಿಯಾದ ಉತ್ತರ! (Correct Answer!)" : "ತಪ್ಪಾದ ಉತ್ತರ! (Incorrect Answer)"}
              </div>
              <p style={{ lineHeight: "1.4" }}>{GK_QUIZ[currentQuestionIdx].explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
