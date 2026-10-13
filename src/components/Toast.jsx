import React, { useEffect, useState } from "react";

// Simple toast that auto‑dismisses after 3 seconds
// Props: `message` (string), `type` ("success" | "error"), `onClose` (callback)
export default function Toast({ message, type = "info", onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  const bg =
    type === "success" ? "#4caf50" : type === "error" ? "#f44336" : "#333";
  const style = {
    position: "fixed",
    bottom: "2rem",
    right: "2rem",
    backgroundColor: bg,
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "4px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    zIndex: 1000,
  };

  return <div style={style}>{message}</div>;
}
