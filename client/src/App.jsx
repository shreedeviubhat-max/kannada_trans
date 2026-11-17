import React from "react";
import ChatInterface from "./components/ChatInterface";

function App() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ChatInterface />
    </main>
  );
}

export default App;
