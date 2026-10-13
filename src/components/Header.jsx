// src/components/Header.jsx
import React from "react";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import supabase from "../lib/supabase";

export default function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout error:", error);
    else {
      // optional: force a page reload so auth state updates UI
      window.location.reload();
    }
  };

  return (
    <header
      className="app-header"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.5rem 1rem",
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <h2 style={{ margin: 0 }}>COMRADE</h2>
      <div>
        <button onClick={toggleTheme} style={{ marginRight: "0.5rem" }}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}
