import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3a5f, #2d6a4f)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', sans-serif"
      }}>
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "40px",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
        }}>
          <p style={{ fontSize: "64px" }}>✅</p>
          <h2>Account Created!</h2>
          <p style={{ color: "#555" }}>Check your email to confirm your account then login.</p>
          <button
            style={btnPrimary}
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1e3a5f, #2d6a4f)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "40px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
      }}>
        <h1 style={{ textAlign: "center", marginBottom: "8px" }}>🏔️ TrekMate</h1>
        <h2 style={{ textAlign: "center", marginBottom: "24px", color: "#1e3a5f" }}>Create Account</h2>

        {error && (
          <p style={{ color: "red", textAlign: "center", marginBottom: "16px" }}>{error}</p>
        )}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={input}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          style={{ ...btnPrimary, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p style={{ textAlign: "center", marginTop: "16px", color: "#555" }}>
          Already have an account?{" "}
          <span
            style={{ color: "#2d6a4f", cursor: "pointer", fontWeight: "bold" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

        <p
          style={{ textAlign: "center", color: "#2d6a4f", cursor: "pointer", marginTop: "8px" }}
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </p>
      </div>
    </div>
  );
}

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "16px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "16px",
  boxSizing: "border-box"
};

const btnPrimary = {
  width: "100%",
  background: "#2d6a4f",
  color: "white",
  border: "none",
  padding: "14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px"
};

export default Signup;