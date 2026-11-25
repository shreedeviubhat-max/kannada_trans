import React, { useState } from "react";
import LandingScreen from "./components/LandingScreen";
import MainDashboard from "./components/MainDashboard";
import ChatboxMode from "./components/ChatboxMode";
import GamesMode from "./components/GamesMode";
import DailyLearnMode from "./components/DailyLearnMode";
import KannadaTalkMode from "./components/KannadaTalkMode";

export default function App() {
  // Routes: 'welcome' | 'dashboard' | 'bhashantara' | 'games' | 'daily_learn' | 'kannada_talk'
  const [currentView, setCurrentView] = useState("welcome");

  return (
    <div style={{ minHeight: "100vh", width: "100%" }}>
      {/* 1. Welcome Page with Kannada-themed design and ENTER button */}
      {currentView === "welcome" && (
        <LandingScreen onEnter={() => setCurrentView("dashboard")} />
      )}

      {/* 2. Main Dashboard with 4 distinct feature cards */}
      {currentView === "dashboard" && (
        <MainDashboard onNavigate={(mode) => setCurrentView(mode)} />
      )}

      {/* 3. Translation Page (Soft blue and white theme) */}
      {currentView === "bhashantara" && (
        <ChatboxMode onBackToHome={() => setCurrentView("dashboard")} />
      )}

      {/* 4. Play Games Page (Colourful, playful theme with illustrations) */}
      {currentView === "games" && (
        <GamesMode onBackToHome={() => setCurrentView("dashboard")} />
      )}

      {/* 5. Learn Kannada Page (Warm cream and green theme with calendar & books) */}
      {currentView === "daily_learn" && (
        <DailyLearnMode onBackToHome={() => setCurrentView("dashboard")} />
      )}

      {/* 6. Talk with AI Page (Modern purple and blue theme with spoken AI chat) */}
      {currentView === "kannada_talk" && (
        <KannadaTalkMode onBackToHome={() => setCurrentView("dashboard")} />
      )}
    </div>
  );
}
