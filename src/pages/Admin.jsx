// src/pages/Admin.jsx
import { useEffect, useState } from "react";
import supabase from "../lib/supabase";
import Toast from "../components/Toast";

export default function Admin() {
  const [signups, setSignups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchSignups = async () => {
      try {
        const { data, error } = await supabase
          .from("join_comrade")
          .select("name, email, created_at")
          .order("created_at", { ascending: false })
          .limit(20);
        if (error) throw error;
        setSignups(data);
      } catch (e) {
        console.error(e);
        setToast({ message: "❌ Failed to load sign‑ups.", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchSignups();
  }, []);

  return (
    <section className="admin-page">
      <h2>Admin Dashboard – Recent Sign‑ups</h2>
      {loading ? (
        <p>
          Loading… <span className="spinner" />
        </p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
                Name
              </th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
                E‑mail
              </th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
                Joined
              </th>
            </tr>
          </thead>
          <tbody>
            {signups.map((s) => (
              <tr key={s.email}>
                <td style={{ padding: "0.4rem 0" }}>{s.name}</td>
                <td>{s.email}</td>
                <td>{new Date(s.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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
