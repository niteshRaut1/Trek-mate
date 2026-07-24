import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Groups({ user }) {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [treks, setTreks] = useState([]);
  const [form, setForm] = useState({
    trek_id: "",
    name: "",
    description: "",
    max_members: ""
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/groups`)
      .then((res) => res.json())
      .then((data) => {
        setGroups(data);
        setLoading(false);
      });

    fetch(`${import.meta.env.VITE_API_URL}/api/treks`)
      .then((res) => res.json())
      .then((data) => setTreks(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.trek_id || !form.name || !form.description || !form.max_members) {
      alert("Please fill in all fields");
      return;
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/groups`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        trek_id: parseInt(form.trek_id),
        max_members: parseInt(form.max_members),
        created_by: user.user_metadata?.full_name || user.email
      })
    });

    if (res.ok) {
      const newGroup = await res.json();
      setGroups([...groups, ...newGroup]);
      setShowForm(false);
      setForm({ trek_id: "", name: "", description: "", max_members: "" });
    }
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", minHeight: "100vh", background: "#f8fafc" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1e3a5f, #2d6a4f)",
        color: "white",
        padding: "60px 40px",
        textAlign: "center"
      }}>
        <h2 style={{ fontSize: "40px", margin: 0 }}>👥 Trek Groups</h2>
        <p style={{ opacity: 0.85, fontSize: "18px", marginTop: "12px" }}>
          Find your trek family or create your own group
        </p>
        {user && (
          <button
            style={{ ...btnPrimary, marginTop: "24px", fontSize: "16px", padding: "12px 28px" }}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "+ Create Group"}
          </button>
        )}
        {!user && (
          <button
            style={{ ...btnPrimary, marginTop: "24px" }}
            onClick={() => navigate("/login")}
          >
            Login to Create Group
          </button>
        )}
      </div>

      {/* Create Group Form */}
      {showForm && (
        <div style={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px" }}>
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)"
          }}>
            <h3 style={{ marginBottom: "24px", color: "#1e3a5f" }}>Create New Group</h3>

            <label style={label}>Select Trek</label>
            <select name="trek_id" value={form.trek_id} onChange={handleChange} style={input}>
              <option value="">Choose a trek...</option>
              {treks.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>

            <label style={label}>Group Name</label>
            <input
              name="name"
              placeholder="e.g. Spring EBC Team 2026"
              value={form.name}
              onChange={handleChange}
              style={input}
            />

            <label style={label}>Description</label>
            <textarea
              name="description"
              placeholder="Describe your group..."
              value={form.description}
              onChange={handleChange}
              rows={3}
              style={{ ...input, resize: "vertical" }}
            />

            <label style={label}>Max Members</label>
            <input
              name="max_members"
              type="number"
              placeholder="e.g. 8"
              value={form.max_members}
              onChange={handleChange}
              style={input}
            />

            <button onClick={handleSubmit} style={btnPrimary}>
              Create Group
            </button>
          </div>
        </div>
      )}

      {/* Groups List */}
      <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "0 20px" }}>
        <h2 style={{ marginBottom: "24px" }}>
          Active Groups
          <span style={{ color: "#777", fontSize: "16px", marginLeft: "12px" }}>
            {groups.length} group{groups.length !== 1 ? "s" : ""}
          </span>
        </h2>

        {loading ? (
          <p>Loading groups...</p>
        ) : groups.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <p style={{ fontSize: "48px" }}>👥</p>
            <h3>No groups yet</h3>
            <p style={{ color: "#777" }}>Be the first to create a trek group!</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "24px"
          }}>
            {groups.map((group) => (
              <div key={group.id} style={card}>
                <div style={{ padding: "24px" }}>
                  <h3 style={{ margin: "0 0 8px", color: "#1e3a5f" }}>{group.name}</h3>
                  <p style={{ color: "#555", margin: "4px 0", fontSize: "14px" }}>
                    👤 Created by {group.created_by}
                  </p>
                  <p style={{ color: "#555", margin: "4px 0", fontSize: "14px" }}>
                    👥 Max {group.max_members} members
                  </p>
                  <p style={{ color: "#777", marginTop: "12px", fontSize: "14px" }}>
                    {group.description}
                  </p>
                  <button style={{ ...btnPrimary, marginTop: "16px", width: "100%" }}>
                    Join Group
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px"
};

const card = {
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  overflow: "hidden"
};

export default Groups;