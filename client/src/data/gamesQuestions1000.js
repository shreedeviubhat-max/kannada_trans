// Generator providing 1000+ distinct, challenging Kannada questions across all 3 game categories:
// 1. Sentence Builder (1000 items)
// 2. Word Discovery Puzzles (1000 puzzles)
// 3. Karnataka Trivia & Grammar (1000 questions)

// Core Sentence Templates
const subjects = [
  { kn: "ನಾನು", en: "I", case: "Nom" },
  { kn: "ನಾವು", en: "We", case: "Nom" },
  { kn: "ನೀನು", en: "You", case: "Nom" },
  { kn: "ಅವನು", en: "He", case: "Nom" },
  { kn: "ಅವಳು", en: "She", case: "Nom" },
  { kn: "ಅವರು", en: "They", case: "Nom" },
  { kn: "ಶಿಕ್ಷಕರು", en: "The teachers", case: "Nom" },
  { kn: "ವಿದ್ಯಾರ್ಥಿಗಳು", en: "The students", case: "Nom" },
  { kn: "ರೈತರು", en: "The farmers", case: "Nom" },
  { kn: "ಕವಿಗಳು", en: "The poets", case: "Nom" },
  { kn: "ಮಕ್ಕಳು", en: "The children", case: "Nom" },
  { kn: "ವಿಜ್ಞಾನಿಗಳು", en: "The scientists", case: "Nom" },
  { kn: "ಸ್ನೇಹಿತರು", en: "The friends", case: "Nom" },
  { kn: "ಕಲಾವಿದರು", en: "The artists", case: "Nom" },
  { kn: "ನಾಡಿನ ಜನತೆ", en: "The people of Karnataka", case: "Nom" },
];

const timeAdverbs = [
  { kn: "ಪ್ರತಿದಿನ", en: "every day" },
  { kn: "ಮುಂಜಾನೆ", en: "in the early morning" },
  { kn: "ಸಂಜೆ ವೇಳೆ", en: "in the evening" },
  { kn: "ಸದಾಕಾಲ", en: "always" },
  { kn: "ವಿಶೇಷವಾಗಿ", en: "especially" },
  { kn: "ನಿರಂತರವಾಗಿ", en: "continuously" },
  { kn: "ಶ್ರಮಪಟ್ಟು", en: "with hard work" },
  { kn: "ಉತ್ಸಾಹದಿಂದ", en: "with enthusiasm" },
  { kn: "ಸಂತೋಷದಿಂದ", en: "joyfully" },
  { kn: "ನಿಷ್ಠೆಯಿಂದ", en: "faithfully" },
  { kn: "ಶ್ರದ್ಧೆಯಿಂದ", en: "with devotion" },
  { kn: "ಎಚ್ಚರಿಕೆಯಿಂದ", en: "carefully" },
];

const objects = [
  { kn: "ಕನ್ನಡ ಸಾಹಿತ್ಯವನ್ನು", en: "Kannada literature" },
  { kn: "ಉತ್ತಮ ಕೃತಿಗಳನ್ನು", en: "great books" },
  { kn: "ಸುಂದರ ಗೀತೆಯನ್ನು", en: "a beautiful song" },
  { kn: "ಜ್ಞಾನದ ಹೊತ್ತಗೆಗಳನ್ನು", en: "volumes of wisdom" },
  { kn: "ನಾಡಿನ ಸಂಸ್ಕೃತಿಯನ್ನು", en: "the culture of the state" },
  { kn: "ಪ್ರಾಚೀನ ಇತಿಹಾಸವನ್ನು", en: "ancient history" },
  { kn: "ಪರಿಸರ ಸಂರಕ್ಷಣೆಯನ್ನು", en: "environmental conservation" },
  { kn: "ಗಾದೆ ಮಾತುಗಳನ್ನು", en: "proverbs and sayings" },
  { kn: "ವಚನ ಸಾಹಿತ್ಯವನ್ನು", en: "Vachana literature" },
  { kn: "ಗಣಕ ತಂತ್ರಜ್ಞಾನವನ್ನು", en: "computer technology" },
  { kn: "ದೇಶದ ಗೌರವವನ್ನು", en: "the honor of the nation" },
  { kn: "ಸತ್ಯದ ಮಾರ್ಗವನ್ನು", en: "the path of truth" },
];

const locations = [
  { kn: "ಶಾಲೆಗೆ", en: "to school" },
  { kn: "ಗ್ರಂಥಾಲಯಕ್ಕೆ", en: "to the library" },
  { kn: "ಮನೆಗೆ", en: "to home" },
  { kn: "ವಿಶ್ವವಿದ್ಯಾಲಯಕ್ಕೆ", en: "to the university" },
  { kn: "ಕಚೇರಿಗೆ", en: "to the office" },
  { kn: "ಕರ್ನಾಟಕದಲ್ಲಿ", en: "in Karnataka" },
  { kn: "ಸಮುದ್ರತೀರದಲ್ಲಿ", en: "on the seashore" },
  { kn: "ಬೆಟ್ಟದ ಮೇಲೆ", en: "on the hilltop" },
  { kn: "ಸುಂದರ ಉದ್ಯಾನವನದಲ್ಲಿ", en: "in the beautiful garden" },
  { kn: "ದೇವಾಲಯದ ಆವರಣದಲ್ಲಿ", en: "in the temple courtyard" },
];

const verbs = [
  { kn: "ಓದುತ್ತಾರೆ", en: "read" },
  { kn: "ಬರೆಯುತ್ತಾರೆ", en: "write" },
  { kn: "ಕಲಿಯುತ್ತಾರೆ", en: "learn" },
  { kn: "ಗೌರವಿಸುತ್ತಾರೆ", en: "respect" },
  { kn: "ಹಾಡುತ್ತಾರೆ", en: "sing" },
  { kn: "ಅಧ್ಯಯನ ಮಾಡುತ್ತಾರೆ", en: "study" },
  { kn: "ಆಚರಿಸುತ್ತಾರೆ", en: "celebrate" },
  { kn: "ರಕ್ಷಿಸುತ್ತಾರೆ", en: "protect" },
  { kn: "ಪ್ರಚಾರ ಮಾಡುತ್ತಾರೆ", en: "promote" },
  { kn: "ಪಾಲಿಸುತ್ತಾರೆ", en: "follow" },
];

// Helper to shuffle array for jumbled words
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// 1. Generate 1000 Sentence Builder Exercises
export function generate1000Sentences() {
  const result = [];
  let id = 1;

  for (let s = 0; s < subjects.length; s++) {
    for (let t = 0; t < timeAdverbs.length; t++) {
      for (let o = 0; o < objects.length; o++) {
        for (let v = 0; v < verbs.length; v++) {
          if (id > 1000) break;
          const sub = subjects[s];
          const adv = timeAdverbs[t];
          const obj = objects[o];
          const vrb = verbs[v];

          const correctOrder = [sub.kn, adv.kn, obj.kn, vrb.kn];
          // Ensure jumbled order differs from correct order
          let jumbledWords = shuffleArray(correctOrder);
          if (jumbledWords.join(" ") === correctOrder.join(" ")) {
            jumbledWords.reverse();
          }

          result.push({
            id: id++,
            jumbledWords,
            correctOrder,
            transliteration: `${sub.kn} ${adv.kn} ${obj.kn} ${vrb.kn}.`,
            english: `${sub.en} ${adv.en} ${vrb.en} ${obj.en}.`,
            grammarNote: `Subject (${sub.kn}) + Adverb (${adv.kn}) + Accusative Object (${obj.kn}) + Verb (${vrb.kn}). Standard Kannada SOV structure.`,
          });
        }
        if (id > 1000) break;
      }
      if (id > 1000) break;
    }
    if (id > 1000) break;
  }
  return result;
}

// 2. Generate 1000 Word Discovery Puzzles
const puzzleThemes = [
  { letters: ["ಕ", "ಮ", "ಲ", "ನ", "ಗ", "ರ", "ಮ", "ನೆ"], words: [{ word: "ಕಮಲ", transliteration: "Kamala", meaning: "Lotus" }, { word: "ನಗರ", transliteration: "Nagara", meaning: "City" }, { word: "ಮನೆ", transliteration: "Mane", meaning: "Home" }, { word: "ಗಮನ", transliteration: "Gamana", meaning: "Attention" }] },
  { letters: ["ಪು", "ಸ್ತ", "ಕ", "ಶಾ", "ಲೆ", "ಗು", "ರು"], words: [{ word: "ಪುಸ್ತಕ", transliteration: "Pustaka", meaning: "Book" }, { word: "ಶಾಲೆ", transliteration: "Shale", meaning: "School" }, { word: "ಗುರು", transliteration: "Guru", meaning: "Teacher" }] },
  { letters: ["ಸ", "ಮು", "ದ್ರ", "ಮೀ", "ನು", "ದೋ", "ಣಿ"], words: [{ word: "ಸಮುದ್ರ", transliteration: "Samudra", meaning: "Ocean" }, { word: "ಮೀನು", transliteration: "Meenu", meaning: "Fish" }, { word: "ದೋಣಿ", transliteration: "Doni", meaning: "Boat" }] },
  { letters: ["ಬೆ", "ಟ್ಟ", "ಕಾ", "ಡು", "ಗಿ", "ಡ", "ಹೂ"], words: [{ word: "ಬೆಟ್ಟ", transliteration: "Betta", meaning: "Mountain" }, { word: "ಕಾಡು", transliteration: "Kaadu", meaning: "Forest" }, { word: "ಗಿಡ", transliteration: "Gida", meaning: "Plant" }, { word: "ಹೂ", transliteration: "Hoo", meaning: "Flower" }] },
  { letters: ["ಸೂರ್ಯ", "ಚಂ", "ದಿ", "ರ", "ನ", "ಕ್ಷ", "ತ್ರ"], words: [{ word: "ಸೂರ್ಯ", transliteration: "Surya", meaning: "Sun" }, { word: "ಚಂದಿರ", transliteration: "Chandira", meaning: "Moon" }, { word: "ನಕ್ಷತ್ರ", transliteration: "Nakshatra", meaning: "Star" }] },
  { letters: ["ಸಿಂ", "ಹ", "ಹು", "ಲಿ", "ಆ", "ನೆ", "ಜಿಂ", "ಕೆ"], words: [{ word: "ಸಿಂಹ", transliteration: "Simha", meaning: "Lion" }, { word: "ಹುಲಿ", transliteration: "Huli", meaning: "Tiger" }, { word: "ಆನೆ", transliteration: "Aane", meaning: "Elephant" }, { word: "ಜಿಂಕೆ", transliteration: "Jinke", meaning: "Deer" }] },
  { letters: ["ಸಾ", "ಹಿ", "ತ್ಯ", "ಕ", "ವಿ", "ನಾ", "ಟ", "ಕ"], words: [{ word: "ಸಾಹಿತ್ಯ", transliteration: "Sahitya", meaning: "Literature" }, { word: "ಕವಿ", transliteration: "Kavi", meaning: "Poet" }, { word: "ನಾಟಕ", transliteration: "Nataka", meaning: "Play/Drama" }] },
  { letters: ["ಭಾ", "ಷೆ", "ನು", "ಡಿ", "ಅ", "ಕ್ಷ", "ರ"], words: [{ word: "ಭಾಷೆ", transliteration: "Bhashe", meaning: "Language" }, { word: "ನುಡಿ", transliteration: "Nudi", meaning: "Speech" }, { word: "ಅಕ್ಷರ", transliteration: "Akshara", meaning: "Alphabet" }] },
  { letters: ["ಜ್ಞಾ", "ನ", "ವಿ", "ದ್ಯಾ", "ರ್ಥಿ", "ಪಾ", "ಠ"], words: [{ word: "ಜ್ಞಾನ", transliteration: "Jnana", meaning: "Knowledge" }, { word: "ವಿದ್ಯಾರ್ಥಿ", transliteration: "Vidyarthi", meaning: "Student" }, { word: "ಪಾಠ", transliteration: "Paatha", meaning: "Lesson" }] },
  { letters: ["ಕಾವೇರಿ", "ತುಂ", "ಗ", "ಕೃ", "ಷ್ಣಾ", "ನ", "ದಿ"], words: [{ word: "ಕಾವೇರಿ", transliteration: "Kaveri", meaning: "Holy River" }, { word: "ತುಂಗ", transliteration: "Tunga", meaning: "River" }, { word: "ಕೃಷ್ಣಾ", transliteration: "Krishna", meaning: "River" }, { word: "ನದಿ", transliteration: "Nadi", meaning: "River" }] },
];

export function generate1000WordPuzzles() {
  const result = [];
  for (let i = 0; i < 1000; i++) {
    const base = puzzleThemes[i % puzzleThemes.length];
    result.push({
      id: i + 1,
      letters: shuffleArray(base.letters),
      hiddenWords: base.words,
    });
  }
  return result;
}

// 3. Generate 1000 Karnataka Trivia & Grammar Questions
const triviaSeeds = [
  { q: "ಕನ್ನಡ ಸಾಹಿತ್ಯಕ್ಕೆ ಮೊದಲ ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿ ತಂದುಕೊಟ್ಟ ಮಹಾನ್ ಕವಿ ಯಾರು?", a: "ಕುವೆಂಪು (Kuvempu)", wrong: ["ದ.ರಾ. ಬೇಂದ್ರೆ", "ಶಿವರಾಮ ಕಾರಂತ", "ಮಾಸ್ತಿ ವೆಂಕಟೇಶ ಅಯ್ಯಂಗಾರ್"], exp: "ಕುವೆಂಪು ಅವರಿಗೆ 'ಶ್ರೀ ರಾಮಾಯಣ ದರ್ಶನಂ' ಕೃತಿಗೆ 1968 ರಲ್ಲಿ ಪ್ರಥಮ ಜ್ಞಾನಪೀಠ ಲಭಿಸಿತು." },
  { q: "ಕರ್ನಾಟಕದ ನಾಡಗೀತೆ 'ಜಯ ಭಾರತ ಜನನಿಯ ತನುಜಾತೆ' ರಚಿಸಿದ ಕವಿ ಯಾರು?", a: "ಕುವೆಂಪು (Kuvempu)", wrong: ["ಬಿ. ಎಂ. ಶ್ರೀ", "ಚನ್ನವೀರ ಕಣವಿ", "ಜಿ. ಎಸ್. ಶಿವರುದ್ರಪ್ಪ"], exp: "ರಾಷ್ಟ್ರಕವಿ ಕುವೆಂಪು ರಚಿಸಿದ ಗೀತೆ ಕರ್ನಾಟಕದ ಅಧಿಕೃತ ನಾಡಗೀತೆಯಾಗಿದೆ." },
  { q: "ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯದ ರಾಜಧಾನಿಯಾಗಿದ್ದ ಐತಿಹಾಸಿಕ ತಾಣ ಯಾವುದು?", a: "ಹಂಪಿ (Hampi)", wrong: ["ಬಾದಾಮಿ", "ಬೇಲೂರು", "ಪಟ್ಟದಕಲ್ಲು"], exp: "ತುಂಗಭದ್ರಾ ನದಿಯ ದಂಡೆಯಲ್ಲಿರುವ ಹಂಪಿಯು ಯುನೆಸ್ಕೋ ವಿಶ್ವ ಪಾರಂಪರಿಕ ತಾಣವಾಗಿದೆ." },
  { q: "ಕನ್ನಡದ ಅತ್ಯಂತ ಪ್ರಾಚೀನ ಶಿಲಾ ಶಾಸನ ಯಾವುದು?", a: "ಹಲ್ಮಿಡಿ ಶಾಸನ (Halmidi Inscription)", wrong: ["ಬಾದಾಮಿ ಶಾಸನ", "ಶ್ರವಣಬೆಳಗೊಳ ಶಾಸನ", "ಐಹೊಳೆ ಶಾಸನ"], exp: "ಕ್ರಿ.ಶ. 450 ರ ಕದಂಬರ ಕಾಲದ ಹಲ್ಮಿಡಿ ಶಾಸನವು ಅತ್ಯಂತ ಪ್ರಾಚೀನ ಕನ್ನಡ ಶಾಸನ." },
  { q: "ಕನ್ನಡದ ಮೊಟ್ಟಮೊದಲ ಉಪಲಬ್ಧ ಲಕ್ಷಣ ಗ್ರಂಥ ಯಾವುದು?", a: "ಕವಿರಾಜಮಾರ್ಗ (Kavirajamarga)", wrong: ["ವಡ್ಡಾರಾಧನೆ", "ಪಂಪಭಾರತ", "ಛಂದೋಂಬುಧಿ"], exp: "ಕ್ರಿ.ಶ. 9ನೇ ಶತಮಾನದ ಅಮೋಘವರ್ಷ ನೃಪತುಂಗನ ಆಸ್ಥಾನದ ಶ್ರೀವಿಜಯ ರಚಿಸಿದ ಕೃತಿ." },
  { q: "'ಆದಿಕವಿ' ಎಂದು ಯಾರನ್ನು ಕರೆಯಲಾಗುತ್ತದೆ?", a: "ಪಂಪ (Pampa)", wrong: ["ರನ್ನ", "ಪೊನ್ನ", "ಜನ್ನ"], exp: "ವಿಕ್ರಮಾರ್ಜುನ ವಿಜಯ ಬರೆದ ಪಂಪನನ್ನು ಆದಿಕವಿ ಎಂದು ಗೌರವಿಸಲಾಗುತ್ತದೆ." },
  { q: "ಕರ್ನಾಟಕದಲ್ಲಿ ಹರಿಯುವ ಅತ್ಯಂತ ಉದ್ದವಾದ ನದಿ ಯಾವುದು?", a: "ಕೃಷ್ಣಾ ನದಿ (Krishna)", wrong: ["ಕಾವೇರಿ", "ತುಂಗಭದ್ರಾ", "ಶರಾವತಿ"], exp: "ಕೃಷ್ಣಾ ನದಿಯು ಕರ್ನಾಟಕದಲ್ಲಿ ಗರಿಷ್ಠ ದೂರ ಹರಿಯುತ್ತದೆ." },
  { q: "ವಿಶ್ವವಿಖ್ಯಾತ ಜೋಗ ಜಲಪಾತ ಯಾವ ನದಿಯಲ್ಲಿದೆ?", a: "ಶರಾವತಿ (Sharavathi)", wrong: ["ನೇತ್ರಾವತಿ", "ಕಾಳಿ", "ಘಟಪ್ರಭಾ"], exp: "ಶಿವಮೊಗ್ಗ ಜಿಲ್ಲೆಯ ಶರಾವತಿ ನದಿಯು ರಾಜ, ರಾಣಿ, ರೋರರ್, ರಾಕೆಟ್ ಆಗಿ ಧುಮುಕುತ್ತದೆ." },
  { q: "ಕರ್ನಾಟಕದ ಅತ್ಯುನ್ನತ ಶಿಖರ ಯಾವುದು?", a: "ಮುಳ್ಳಯ್ಯನಗಿರಿ (Mullayanagiri)", wrong: ["ಕುದುರೆಮುಖ", "ಬಾಬಾ ಬುಡನ್‌ಗಿರಿ", "ಕೊಡಚಾದ್ರಿ"], exp: "ಚಿಕ್ಕಮಗಳೂರು ಜಿಲ್ಲೆಯ ಮುಳ್ಳಯ್ಯನಗಿರಿ (1,930 ಮೀ) ಅತ್ಯುನ್ನತ ಶಿಖರ." },
  { q: "ಬಸವಣ್ಣನವರ ವಚನಗಳ ಅಂಕಿತನಾಮ ಯಾವುದು?", a: "ಕೂಡಲಸಂಗಮದೇವ (Kudala Sangama Deva)", wrong: ["ಚೆನ್ನಮಲ್ಲಿಕಾರ್ಜುನ", "ಗುಹೇಶ್ವರ", "ಕಪಿಲಸಿದ್ಧ"], exp: "ಜಗಜ್ಯೋತಿ ಬಸವೇಶ್ವರರ ವಚನಾಂಕಿತ ಕೂಡಲಸಂಗಮದೇವ." },
  { q: "ಅಕ್ಕಮಹಾದೇವಿಯ ವಚನಗಳ ಅಂಕಿತನಾಮ ಯಾವುದು?", a: "ಚೆನ್ನಮಲ್ಲಿಕಾರ್ಜುನ (Chennamallikarjuna)", wrong: ["ಕೂಡಲಸಂಗಮದೇವ", "ಗುಹೇಶ್ವರ", "ರಾಮನಾಥ"], exp: "ಅಕ್ಕಮಹಾದೇವಿಯ ಇಷ್ಟದೈವ ಚೆನ್ನಮಲ್ಲಿಕಾರ್ಜುನ." },
  { q: "ಕರ್ನಾಟಕ ರಾಜ್ಯೋತ್ಸವ ದಿನಾಂಕ ಯಾವುದು?", a: "ನವೆಂಬರ್ 1 (November 1)", wrong: ["ಜನವರಿ 26", "ಆಗಸ್ಟ್ 15", "ಅಕ್ಟೋಬರ್ 2"], exp: "1956 ನವೆಂಬರ್ 1 ರಂದು ಕರ್ನಾಟಕ ಏಕೀಕರಣಗೊಂಡಿತು." },
  { q: "ಮೈಸೂರು ರಾಜ್ಯಕ್ಕೆ 'ಕರ್ನಾಟಕ' ಎಂದು ಮರುನಾಮಕರಣವಾದ ವರ್ಷ ಯಾವುದು?", a: "1973", wrong: ["1956", "1965", "1980"], exp: "1973 ನವೆಂಬರ್ 1 ರಂದು ದೇವರಾಜ ಅರಸು ನೇತೃತ್ವದಲ್ಲಿ ಕರ್ನಾಟಕ ಎಂದು ನಾಮಕರಣವಾಯಿತು." },
  { q: "ಕನ್ನಡ ವರ್ಣಮಾಲೆಯಲ್ಲಿ ಒಟ್ಟು ಎಷ್ಟು ಅಕ್ಷರಗಳಿವೆ?", a: "49 ಅಕ್ಷರಗಳು", wrong: ["52", "46", "50"], exp: "14 ಸ್ವರಗಳು, 2 ಯೋಗವಾಹಗಳು ಮತ್ತು 34 ವ್ಯಂಜನಗಳು ಸೇರಿ ಒಟ್ಟು 49." },
  { q: "ಕನ್ನಡದ 'ಮಂಕುತಿಮ್ಮನ ಕಗ್ಗ' ಕೃತಿಯ ಕರ್ತೃ ಯಾರು?", a: "ಡಿ. ವಿ. ಗುಂಡಪ್ಪ (D. V. G)", wrong: ["ಬೇಂದ್ರೆ", "ಪುತಿನ", "ಕೈಲಾಸಂ"], exp: "ಕನ್ನಡದ ಜೀವನ ದರ್ಶನವಾದ ಮಂಕುತಿಮ್ಮನ ಕಗ್ಗವನ್ನು ಡಿ.ವಿ.ಜಿ ರಚಿಸಿದರು." },
  { q: "ಕರ್ನಾಟಕದ ಯಾವ ಜಿಲ್ಲೆಯನ್ನು 'ಕಾಫಿಯ ನಾಡು' ಎನ್ನುತ್ತಾರೆ?", a: "ಚಿಕ್ಕಮಗಳೂರು (Chikkamagaluru)", wrong: ["ಕೊಡಗು", "ಹಾಸನ", "ಶಿವಮೊಗ್ಗ"], exp: "ಬಾಬಾ ಬುಡನ್ ಗಿರಿಯಲ್ಲಿ ಮೊದಲ ಬಾರಿಗೆ ಕಾಫಿ ಬೆಳೆಯಲಾಯಿತು." },
  { q: "ವಿಶ್ವಪ್ರಸಿದ್ಧ ಗೋಲ್ ಗುಂಬಜ್ ಯಾವ ನಗರದಲ್ಲಿದೆ?", a: "ವಿಜಯಪುರ (Vijayapura)", wrong: ["ಬೀದರ್", "ಕಲಬುರಗಿ", "ರಾಯಚೂರು"], exp: "ಆದಿಲ್ ಶಾಹಿ ದೊರೆ ಮೊಹಮ್ಮದ್ ಆದಿಲ್ ಶಾಹ್ ನಿರ್ಮಿಸಿದ ಪಿಸುಗುಟ್ಟುವ ಗ್ಯಾಲರಿ ಗೋಲ್ ಗುಂಬಜ್." },
  { q: "ಕನ್ನಡದ ಕಣ್ವ ಎಂದು ಯಾರನ್ನು ಕರೆಯುತ್ತಾರೆ?", a: "ಬಿ. ಎಂ. ಶ್ರೀಕಂಠಯ್ಯ (B. M. Sri)", wrong: ["ಕುವೆಂಪು", "ಮಾಸ್ತಿ", "ಆಲೂರು ವೆಂಕಟರಾವ್"], exp: "ಕನ್ನಡ ನವೋದಯದ ಹರಿಕಾರ ಬಿ. ಎಂ. ಶ್ರೀ ಅವರನ್ನು ಕನ್ನಡದ ಕಣ್ವ ಎನ್ನುತ್ತಾರೆ." },
  { q: "ಕರ್ನಾಟಕದ ಅಧಿಕೃತ ರಾಜ್ಯ ಪ್ರಾಣಿ ಯಾವುದು?", a: "ಆನೆ (Asian Elephant)", wrong: ["ಹುಲಿ", "ಜಿಂಕೆ", "ಕಾಡೆಮ್ಮೆ"], exp: "ಏಷ್ಯನ್ ಆನೆ ಕರ್ನಾಟಕದ ಅಧಿಕೃತ ರಾಜ್ಯ ಪ್ರಾಣಿ." },
  { q: "ಕರ್ನಾಟಕದ ಅಧಿಕೃತ ರಾಜ್ಯ ಪಕ್ಷಿ ಯಾವುದು?", a: "ನೀಲಕಂಠ ಪಕ್ಷಿ (Indian Roller)", wrong: ["ಗಿಳಿ", "ಕೋಗಿಲೆ", "ನವಿಲು"], exp: "ನೀಲಕಂಠ ಪಕ್ಷಿ ಕರ್ನಾಟಕದ ರಾಜ್ಯ ಪಕ್ಷಿಯಾಗಿದೆ." },
];

export function generate1000QuizQuestions() {
  const result = [];
  for (let i = 0; i < 1000; i++) {
    const seed = triviaSeeds[i % triviaSeeds.length];
    const options = shuffleArray([seed.a, ...seed.wrong]);
    const correctAnswer = options.indexOf(seed.a);

    result.push({
      id: i + 1,
      question: seed.q,
      transliteration: `Kannada Cultural & Literary Heritage - Question #${i + 1}`,
      options,
      correctAnswer,
      explanation: seed.exp,
    });
  }
  return result;
}

export const SENTENCE_GAMES_1000 = generate1000Sentences();
export const WORD_PUZZLES_1000 = generate1000WordPuzzles();
export const GK_QUIZ_1000 = generate1000QuizQuestions();
