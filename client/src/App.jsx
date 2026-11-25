import React, { useState } from "react";
import LandingScreen from "./components/LandingScreen";
import ChatboxMode from "./components/ChatboxMode";
import GamesMode from "./components/GamesMode";
import DailyLearnMode from "./components/DailyLearnMode";
import KannadaTalkMode from "./components/KannadaTalkMode";

export default function App() {
  const [currentMode, setCurrentMode] = useState("landing"); // 'landing' | 'bhashantara' | 'games' | 'daily_learn' | 'kannada_talk'

  return (
    <div style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
      {currentMode === "landing" && (
        <LandingScreen onSelectMode={(mode) => setCurrentMode(mode)} />
      )}

      {currentMode === "bhashantara" && (
        <ChatboxMode onBackToHome={() => setCurrentMode("landing")} />
      )}

      {currentMode === "games" && (
        <GamesMode onBackToHome={() => setCurrentMode("landing")} />
      )}

      {currentMode === "daily_learn" && (
        <DailyLearnMode onBackToHome={() => setCurrentMode("landing")} />
      )}

      {currentMode === "kannada_talk" && (
        <KannadaTalkMode onBackToHome={() => setCurrentMode("landing")} />
      )}
    </div>
  );
}
