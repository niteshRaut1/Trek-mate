import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddTrek({ user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    location: "",
    difficulty: "Easy",
    duration_days: "",
    description: ""
  });

  if (!user) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', sans-serif"
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "48px" }}>🔒</p>
          <h2>Login Required</h2>
          <p>You need to login to add a trek.</p>
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.location || !form.duration_days || !form.description) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("${import.meta.env.VITE_API_URL}/api/treks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        duration_days: parseInt(form.duration_days)
      })
    });

    if (res.ok) {
      navigate("/");
    } else {
      setError("Failed to add trek. Try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      fontFamily: "'Segoe UI', sans-serif",
      padding: "40px 20px"
    }}>
      <div style={{
        maxWidth: "600px",
        margin: "0 auto",
        background: "white",
        borderRadius: "16px",
        padding: "40px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)"
      }}>
        <h2 style={{ marginBottom: "24px", color: "#1e3a5f" }}>🏔️ Add New Trek</h2>

        {error && (
          <p style={{ color: "red", marginBottom: "16px" }}>{error}</p>
        )}

        <label style={label}>Trek Name</label>
        <input
          name="name"
          placeholder="e.g. Everest Base Camp"
          value={form.name}
          onChange={handleChange}
          style={input}
        />

        <label style={label}>Location</label>
        <input
          name="location"
          placeholder="e.g. Solukhumbu, Nepal"
          value={form.location}
          onChange={handleChange}
          style={input}
        />

        <label style={label}>Difficulty</label>
        <select
          name="difficulty"
          value={form.difficulty}
          onChange={handleChange}
          style={input}
        >
          <option>Easy</option>
          <option>Moderate</option>
          <option>Hard</option>
          <option>Expert</option>
        </select>

        <label style={label}>Duration (days)</label>
        <input
          name="duration_days"
          type="number"
          placeholder="e.g. 14"
          value={form.duration_days}
          onChange={handleChange}
          style={input}
        />

        <label style={label}>Description</label>
        <textarea
          name="description"
          placeholder="Describe the trek..."
          value={form.description}
          onChange={handleChange}
          rows={4}
          style={{ ...input, resize: "vertical" }}
        />

        <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ ...btnPrimary, flex: 1, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Adding..." : "Add Trek"}
          </button>
          <button
            onClick={() => navigate("/")}
            style={{ ...btnOutline, flex: 1 }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const label = {
  display: "block",
  marginBottom: "6px",
  fontWeight: "bold",
  color: "#333"
};

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
  background: "#2d6a4f",
  color: "white",
  border: "none",
  padding: "14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px"
};

const btnOutline = {
  background: "transparent",
  color: "#2d6a4f",
  border: "2px solid #2d6a4f",
  padding: "14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px"
};

export default AddTrek;