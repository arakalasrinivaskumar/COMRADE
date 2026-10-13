// src/components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../lib/supabase";

/**
 * Simple protection wrapper. If a user is logged in, renders the provided component.
 * Otherwise redirects to the login page ("/auth").
 */
export default function ProtectedRoute({ component: Component }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth", { replace: true });
        return;
      }
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      if (adminEmail && user.email !== adminEmail) {
        // Not an admin – redirect to auth or a not‑authorized page
        navigate("/auth", { replace: true });
        return;
      }
      setChecking(false);
    };
    checkAuth();
  }, [navigate]);

  if (checking) return null; // or a spinner if you prefer
  return <Component />;
}
