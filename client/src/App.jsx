import React, { useState } from "react";
import LandingScreen from "./components/LandingScreen";
import ChatboxMode from "./components/ChatboxMode";
import GamesMode from "./components/GamesMode";

export default function App() {
  const [currentMode, setCurrentMode] = useState("landing"); // 'landing' | 'chatbox' | 'games'

  return (
    <div style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
      {currentMode === "landing" && (
        <LandingScreen onSelectMode={(mode) => setCurrentMode(mode)} />
      )}

      {currentMode === "chatbox" && (
        <ChatboxMode onBackToHome={() => setCurrentMode("landing")} />
      )}

      {currentMode === "games" && (
        <GamesMode onBackToHome={() => setCurrentMode("landing")} />
      )}
    </div>
  );
}
