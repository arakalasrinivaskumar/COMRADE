// src/pages/Auth.jsx
import { useState } from "react";
import supabase from "../lib/supabase";
import Toast from "../components/Toast";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [toast, setToast] = useState(null);

  // ------- Login -------------------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus("processing");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error(error);
      setErrorMsg(error.message);
      setStatus("error");
      setToast({ message: error.message, type: "error" });
    } else {
      await notifyAdmin(email, false);
      setStatus("success");
      setToast({ message: "✅ Logged in! Admin notified.", type: "success" });
    }
  };

  // ------- Register -----------------------------------------------
  const handleRegister = async (e) => {
    e.preventDefault();
    setStatus("processing");
    setErrorMsg("");
    const { error } = await supabase.auth.signUp(
      { email, password },
      { emailRedirectTo: "http://localhost:5173" },
    );
    if (error) {
      console.error(error);
      if (error.message.includes("already registered")) {
        setErrorMsg(
          "This e‑mail is already registered. Please log in instead.",
        );
        setToast({
          message: "This e‑mail is already registered.",
          type: "error",
        });
      } else {
        setErrorMsg(error.message);
        setToast({ message: error.message, type: "error" });
      }
      setStatus("error");
    } else {
      await sendWelcomeEmail(email);
      await notifyAdmin(email, true);
      setStatus("registered");
      setToast({
        message: "✅ Registration successful – check your e‑mail.",
        type: "success",
      });
    }
  };

  // ------- Helper: send welcome e‑mail to the user ----------------
  const sendWelcomeEmail = async (userEmail) => {
    const payload = {
      to: userEmail,
      subject: "Welcome to COMRADE!",
      message: `Hi ${userEmail},\n\nThank you for registering at COMRADE. We're excited to have you on board.\n\nIf you have any questions, feel free to reply to this e‑mail.\n\nBest regards,\nThe COMRADE Team`,
    };
    try {
      const { error } = await supabase.functions.invoke("send-email", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (error) console.error("Welcome e‑mail error:", error);
    } catch (e) {
      console.error(e);
    }
  };

  // ------- Helper: notify admin (kept for logging purposes) -----
  const notifyAdmin = async (userEmail, isNew = false) => {
    const payload = {
      to: import.meta.env.VITE_ADMIN_EMAIL,
      subject: isNew ? "New COMRADE registration" : "COMRADE login",
      message: `User ${userEmail} has ${isNew ? "registered" : "logged in"} to COMRADE.`,
    };
    try {
      const { error } = await supabase.functions.invoke("send-email", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (error) console.error("Admin notify error:", error);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="auth-page">
      <h2>
        {status === "registered"
          ? "Check your inbox for a welcome e‑mail"
          : "COMRADE Login / Register"}
      </h2>
      <form className="auth-form">
        <div>
          <label>E‑mail:</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleLogin} disabled={status === "processing"}>
          Login{status === "processing" && <span className="spinner" />}
        </button>
        <button onClick={handleRegister} disabled={status === "processing"}>
          Register{status === "processing" && <span className="spinner" />}
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
