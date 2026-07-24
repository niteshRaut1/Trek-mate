import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async () => {
    if (!email) { setError("Please enter your email"); return; }
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/reset-password"
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3a5f, #2d6a4f)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif"
      }}>
        <div style={{
          background: "white", borderRadius: "16px", padding: "40px",
          width: "100%", maxWidth: "400px", textAlign: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
        }}>
          <p style={{ fontSize: "64px" }}>📧</p>
          <h2 style={{ marginBottom: "12px" }}>Check your email!</h2>
          <p style={{ color: "#6e6e73", marginBottom: "24px" }}>
            We sent a password reset link to <strong>{email}</strong>
          </p>
          <button
            onClick={() => navigate("/login")}
            style={btnPrimary}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1e3a5f, #2d6a4f)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      <div style={{
        background: "white", borderRadius: "16px", padding: "40px",
        width: "100%", maxWidth: "400px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
      }}>
        <h1 style={{ textAlign: "center", marginBottom: "8px" }}>🏔️ TrekMate</h1>
        <h2 style={{ textAlign: "center", marginBottom: "8px", color: "#1d1d1f" }}>
          Reset Password
        </h2>
        <p style={{ textAlign: "center", color: "#6e6e73", marginBottom: "24px", fontSize: "14px" }}>
          Enter your email and we'll send you a reset link
        </p>

        {error && (
          <p style={{ color: "red", textAlign: "center", marginBottom: "16px" }}>{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <button
          onClick={handleReset}
          disabled={loading}
          style={{ ...btnPrimary, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p
          style={{ textAlign: "center", color: "#2d6a4f", cursor: "pointer", marginTop: "16px", fontSize: "14px" }}
          onClick={() => navigate("/login")}
        >
          ← Back to Login
        </p>
      </div>
    </div>
  );
}

const input = {
  width: "100%", padding: "12px", marginBottom: "16px",
  borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px",
  boxSizing: "border-box", outline: "none", fontFamily: "inherit"
};

const btnPrimary = {
  width: "100%", background: "#1d1d1f", color: "white", border: "none",
  padding: "14px", borderRadius: "8px", cursor: "pointer",
  fontWeight: "600", fontSize: "16px"
};

export default ForgotPassword;