// src/pages/Contact.jsx
import { useState } from "react";
import supabase from "../lib/supabase";
import Toast from "../components/Toast";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    const { error } = await supabase
      .from("contact")
      .insert({ name, email, message });
    if (error) {
      console.error("Contact error:", error);
      setStatus("error");
      setToast({
        message: "❌ Failed to send – check console.",
        type: "error",
      });
    } else {
      setStatus("success");
      setToast({ message: "✅ Message sent!", type: "success" });
      setName("");
      setEmail("");
      setMessage("");
    }
  };

  return (
    <section className="contact-page">
      <h2>Contact COMRADE</h2>
      <form onSubmit={handleSubmit} className="contact-form">
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
        <div>
          <label>Message:</label>
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <button type="submit" disabled={status === "sending"}>
          Send{status === "sending" && <span className="spinner" />}
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
