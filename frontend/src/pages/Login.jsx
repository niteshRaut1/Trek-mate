import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [trekking, setTrekking] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleTrek = () => {
    setTrekking(true);
    setTimeout(() => setShowForm(true), 2000);
  };

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill in all fields"); return; }
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); }
    else navigate("/");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #87CEEB 0%, #87CEEB 60%, #8B7355 60%, #8B7355 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      overflow: "hidden",
      position: "relative"
    }}>

      {/* Mountains background */}
      <svg style={{ position: "absolute", bottom: "40%", left: 0, width: "100%" }} viewBox="0 0 800 200" preserveAspectRatio="none">
        <polygon points="0,200 150,50 300,150 450,20 600,120 750,60 800,100 800,200" fill="#4a7c59" />
        <polygon points="0,200 100,80 250,130 400,40 550,100 700,50 800,90 800,200" fill="#2d6a4f" opacity="0.8" />
        {/* Snow caps */}
        <polygon points="150,50 130,80 170,80" fill="white" />
        <polygon points="450,20 425,60 475,60" fill="white" />
        <polygon points="750,60 730,90 770,90" fill="white" />
      </svg>

      {/* Ground */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "40%", background: "#8B7355"
      }}>
        {/* Path/Trail */}
        <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} viewBox="0 0 800 200">
          <path d="M 0 80 Q 200 60 400 80 Q 600 100 800 70" fill="none" stroke="#a0856a" strokeWidth="20" />
          {/* Rocks */}
          <ellipse cx="100" cy="90" rx="15" ry="8" fill="#6b5a3e" />
          <ellipse cx="300" cy="70" rx="10" ry="6" fill="#6b5a3e" />
          <ellipse cx="600" cy="85" rx="12" ry="7" fill="#6b5a3e" />
          {/* Trees */}
          <polygon points="650,30 640,70 660,70" fill="#1a4a2e" />
          <polygon points="700,20 688,65 712,65" fill="#1a4a2e" />
          <rect x="648" y="70" width="4" height="15" fill="#5a3e2b" />
          <rect x="698" y="65" width="4" height="15" fill="#5a3e2b" />
        </svg>
      </div>

      {/* Sun */}
      <div style={{
        position: "absolute", top: "40px", right: "80px",
        width: "60px", height: "60px", borderRadius: "50%",
        background: "#FFD700",
        boxShadow: "0 0 30px rgba(255,215,0,0.6)"
      }} />

      {/* Clouds */}
      {[{ left: "10%", top: "8%" }, { left: "40%", top: "5%" }, { left: "70%", top: "10%" }].map((pos, i) => (
        <div key={i} style={{ position: "absolute", left: pos.left, top: pos.top }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: "80px", height: "30px", background: "white", borderRadius: "15px", opacity: 0.9 }} />
            <div style={{ position: "absolute", top: "-15px", left: "15px", width: "50px", height: "40px", background: "white", borderRadius: "50%", opacity: 0.9 }} />
          </div>
        </div>
      ))}

      {/* Trekker */}
      <div style={{
        position: "absolute",
        bottom: "38%",
        left: trekking ? "calc(50% - 20px)" : "10%",
        transition: "left 2s ease-in-out",
        zIndex: 10
      }}>
        <svg width="60" height="100" viewBox="0 0 60 100">
          {/* Backpack */}
          <rect x="22" y="25" width="18" height="22" rx="4" fill="#8B4513" />
          <rect x="24" y="28" width="14" height="8" rx="2" fill="#A0522D" />

          {/* Body */}
          <rect x="20" y="30" width="20" height="25" rx="4" fill="#2d6a4f" />

          {/* Head */}
          <circle cx="30" cy="18" r="12" fill="#FDBCB4" />

          {/* Hat */}
          <ellipse cx="30" cy="8" rx="14" ry="4" fill="#8B4513" />
          <rect x="23" y="4" width="14" height="8" rx="2" fill="#A0522D" />

          {/* Sunglasses */}
          <rect x="23" y="17" width="7" height="4" rx="2" fill="#1a1a1a" />
          <rect x="32" y="17" width="7" height="4" rx="2" fill="#1a1a1a" />
          <line x1="30" y1="19" x2="32" y2="19" stroke="#1a1a1a" strokeWidth="1" />

          {/* Arms */}
          <line
            x1="20" y1="38"
            x2={trekking ? "8" : "12"}
            y2={trekking ? "50" : "48"}
            stroke="#2d6a4f" strokeWidth="5" strokeLinecap="round"
            style={{ transition: "all 0.5s ease" }}
          />
          <line
            x1="40" y1="38"
            x2={trekking ? "52" : "48"}
            y2={trekking ? "50" : "48"}
            stroke="#2d6a4f" strokeWidth="5" strokeLinecap="round"
            style={{ transition: "all 0.5s ease" }}
          />

          {/* Trekking pole */}
          <line x1="48" y1="48" x2="55" y2="75" stroke="#8B4513" strokeWidth="3" strokeLinecap="round" />

          {/* Legs */}
          <line
            x1="25" y1="55"
            x2={trekking ? "18" : "22"}
            y2="75"
            stroke="#1e3a5f" strokeWidth="6" strokeLinecap="round"
            style={{ transition: "all 0.3s ease" }}
          />
          <line
            x1="35" y1="55"
            x2={trekking ? "42" : "38"}
            y2="75"
            stroke="#1e3a5f" strokeWidth="6" strokeLinecap="round"
            style={{ transition: "all 0.3s ease" }}
          />

          {/* Boots */}
          <ellipse cx={trekking ? "18" : "22"} cy="76" rx="7" ry="4" fill="#4a3728" style={{ transition: "all 0.3s ease" }} />
          <ellipse cx={trekking ? "42" : "38"} cy="76" rx="7" ry="4" fill="#4a3728" style={{ transition: "all 0.3s ease" }} />
        </svg>

        {/* Speech bubble */}
        {!trekking && (
          <div style={{
            position: "absolute", top: "-50px", left: "50px",
            background: "white", borderRadius: "12px", padding: "8px 12px",
            fontSize: "12px", fontWeight: "600", color: "#1d1d1f",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)", whiteSpace: "nowrap"
          }}>
            Click me to start trekking! 🏔️
            <div style={{
              position: "absolute", bottom: "-6px", left: "10px",
              width: "12px", height: "12px", background: "white",
              transform: "rotate(45deg)"
            }} />
          </div>
        )}
      </div>

      {/* Click area when not trekking */}
      {!trekking && (
        <div
          onClick={handleTrek}
          style={{
            position: "absolute", bottom: "38%", left: "10%",
            width: "80px", height: "100px", cursor: "pointer", zIndex: 11
          }}
        />
      )}

      {/* Login Form */}
      {showForm && (
        <div style={{
          position: "relative", zIndex: 20,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px", padding: "40px",
          width: "100%", maxWidth: "400px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          animation: "slideUp 0.5s ease"
        }}>
          <h2 style={{ textAlign: "center", marginBottom: "4px", fontSize: "24px", color: "#1d1d1f" }}>
            🏔️ TrekMate
          </h2>
          <p style={{ textAlign: "center", color: "#6e6e73", marginBottom: "24px", fontSize: "14px" }}>
            You made it! Now login to continue 🎉
          </p>

          {error && (
            <p style={{ color: "red", textAlign: "center", marginBottom: "16px", fontSize: "14px" }}>{error}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={input}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ ...btnPrimary, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Logging in..." : "Login 🏔️"}
          </button>

          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <span style={{ color: "#6e6e73", fontSize: "14px" }}>Don't have an account? </span>
            <span
              onClick={() => navigate("/signup")}
              style={{ color: "#2d6a4f", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}
            >Sign Up</span>
          </div>

          <p
            onClick={() => navigate("/forgot-password")}
            style={{ textAlign: "center", color: "#6e6e73", cursor: "pointer", marginTop: "12px", fontSize: "13px" }}
          >
            Forgot password?
          </p>
        </div>
      )}

      {/* Start Trek button */}
      {!trekking && (
        <div style={{ position: "relative", zIndex: 20, textAlign: "center", marginTop: "60%" }}>
          <button
            onClick={handleTrek}
            style={{
              background: "linear-gradient(135deg, #2d6a4f, #1e3a5f)",
              color: "white", border: "none", padding: "16px 40px",
              borderRadius: "999px", fontSize: "18px", fontWeight: "700",
              cursor: "pointer", boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
            }}
          >
            🥾 Start Trekking!
          </button>
          <p style={{ color: "white", marginTop: "12px", fontSize: "14px", opacity: 0.8 }}>
            Click to begin your journey
          </p>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const input = {
  width: "100%", padding: "12px 16px", marginBottom: "16px",
  borderRadius: "10px", border: "1px solid #e5e5e5",
  fontSize: "15px", boxSizing: "border-box", outline: "none",
  fontFamily: "inherit", background: "white", color: "#1d1d1f"
};

const btnPrimary = {
  width: "100%",
  background: "linear-gradient(135deg, #2d6a4f, #1e3a5f)",
  color: "white", border: "none", padding: "14px",
  borderRadius: "10px", cursor: "pointer",
  fontWeight: "700", fontSize: "16px"
};

export default Login;