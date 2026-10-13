// src/pages/Join.jsx
import { useState } from "react";
import supabase from "../lib/supabase";
import Toast from "../components/Toast";

export default function Join() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    const { error } = await supabase
      .from("join_comrade")
      .insert({ name, email });
    if (error) {
      if (error.code === "23505") {
        setStatus("duplicate");
        setToast({
          message: "⚠️ This e‑mail is already registered.",
          type: "error",
        });
      } else {
        console.error("Join error:", error);
        setStatus("error");
        setToast({ message: "❌ Something went wrong.", type: "error" });
      }
    } else {
      setStatus("success");
      setToast({ message: "✅ Joined successfully!", type: "success" });
      setName("");
      setEmail("");
    }
  };

  return (
    <section className="join-page">
      <h2>Join COMRADE</h2>
      <form onSubmit={handleSubmit} className="join-form">
        <div>
          <label>Name:</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" disabled={status === "sending"}>
          Join{status === "sending" && <span className="spinner" />}
        </button>
      </form>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
}
