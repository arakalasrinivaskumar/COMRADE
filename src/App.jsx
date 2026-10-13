// src/App.jsx
import "./App.css";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";

// Pages
import Join from "./pages/Join";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
function Home() {
  return (
    <section className="home">
      <h1>Welcome to COMRADE</h1>
      <p>
        A simple app that lets visitors <strong>join</strong>,{" "}
        <strong>contact</strong> us, or <strong>log in / register</strong> with
        Supabase auth.
      </p>
      <ul>
        <li>
          <Link to="/join">Join COMRADE</Link>
        </li>
        <li>
          <Link to="/contact">Contact COMRADE</Link>
        </li>
        <li>
          <Link to="/auth">Login / Register</Link>
        </li>
        <li>
          <Link to="/admin">Admin Dashboard</Link>
        </li>
      </ul>
    </section>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/join" element={<Join />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<ProtectedRoute component={Admin} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
