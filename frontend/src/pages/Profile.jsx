import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile({ user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [activeTab, setActiveTab] = useState("edit");
  const [form, setForm] = useState({
    full_name: "",
    bio: "",
    location: "",
    experience: "Beginner",
    treks_completed: 0
  });

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:3001/api/profiles/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setForm({
            full_name: data.full_name || "",
            bio: data.bio || "",
            location: data.location || "",
            experience: data.experience || "Beginner",
            treks_completed: data.treks_completed || 0
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch(`http://localhost:3001/api/followers/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setFollowers(data.followers);
        setFollowing(data.following);
      });
  }, [user]);

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "48px" }}>🔒</p>
          <h2>Login Required</h2>
          <p style={{ color: "#6e6e73" }}>You need to login to view your profile.</p>
          <button style={btnPrimary} onClick={() => navigate("/login")}>Go to Login</button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    const res = await fetch("http://localhost:3001/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, ...form, treks_completed: parseInt(form.treks_completed) })
    });
    if (res.ok) { setSuccess(true); setSaving(false); }
    else setSaving(false);
  };

  if (loading) return <p style={{ padding: "40px" }}>Loading profile...</p>;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f7", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}>

        {/* Profile Header */}
        <div style={{
          background: "linear-gradient(135deg, #1e3a5f, #2d6a4f)",
          borderRadius: "20px", padding: "40px",
          textAlign: "center", color: "white", marginBottom: "24px"
        }}>
          {/* Avatar */}
          <div style={{
            width: "90px", height: "90px", borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "40px", margin: "0 auto 16px",
            border: "3px solid rgba(255,255,255,0.4)"
          }}>
            {form.full_name?.[0] || "👤"}
          </div>

          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>
            {form.full_name || user.email}
          </h2>
          <p style={{ opacity: 0.75, marginTop: "4px", fontSize: "14px" }}>{user.email}</p>

          {form.bio && (
            <p style={{ opacity: 0.9, marginTop: "12px", fontSize: "15px", maxWidth: "400px", margin: "12px auto 0" }}>
              {form.bio}
            </p>
          )}

          {form.location && (
            <p style={{ opacity: 0.75, marginTop: "8px", fontSize: "14px" }}>
              📍 {form.location}
            </p>
          )}

          {/* Stats Bar */}
          <div style={{
            display: "flex", justifyContent: "center", gap: "0",
            marginTop: "24px", paddingTop: "24px",
            borderTop: "1px solid rgba(255,255,255,0.2)"
          }}>
            {[
              { value: followers, label: "Followers" },
              { value: following, label: "Following" },
              { value: form.treks_completed, label: "Treks" },
            ].map((stat, i) => (
              <div key={stat.label} style={{
                flex: 1, textAlign: "center",
                borderRight: i < 2 ? "1px solid rgba(255,255,255,0.2)" : "none",
                padding: "0 16px"
              }}>
                <p style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>{stat.value}</p>
                <p style={{ margin: "4px 0 0", opacity: 0.75, fontSize: "13px" }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Experience Badge */}
          <div style={{
            display: "inline-block", marginTop: "16px",
            background: "rgba(255,255,255,0.15)",
            borderRadius: "999px", padding: "6px 16px",
            fontSize: "13px", fontWeight: "600"
          }}>
            🏔️ {form.experience} Trekker
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", background: "white", borderRadius: "14px",
          padding: "6px", marginBottom: "24px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
        }}>
          {[
            { id: "edit", label: "✏️ Edit Profile" },
            { id: "activity", label: "📊 Activity" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, background: activeTab === tab.id ? "#1d1d1f" : "transparent",
                color: activeTab === tab.id ? "white" : "#6e6e73",
                border: "none", padding: "10px", borderRadius: "10px",
                cursor: "pointer", fontSize: "14px", fontWeight: "500"
              }}
            >{tab.label}</button>
          ))}
        </div>

        {/* Edit Tab */}
        {activeTab === "edit" && (
          <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            {success && (
              <p style={{ color: "#2d6a4f", marginBottom: "16px", fontWeight: "600" }}>
                ✅ Profile saved successfully!
              </p>
            )}

            <label style={label}>Full Name</label>
            <input name="full_name" placeholder="Your full name" value={form.full_name} onChange={handleChange} style={input} />

            <label style={label}>Bio</label>
            <textarea name="bio" placeholder="Tell other trekkers about yourself..." value={form.bio} onChange={handleChange} rows={3} style={{ ...input, resize: "vertical" }} />

            <label style={label}>Location</label>
            <input name="location" placeholder="e.g. Kathmandu, Nepal" value={form.location} onChange={handleChange} style={input} />

            <label style={label}>Experience Level</label>
            <select name="experience" value={form.experience} onChange={handleChange} style={input}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Experienced</option>
              <option>Expert</option>
            </select>

            <label style={label}>Treks Completed</label>
            <input name="treks_completed" type="number" placeholder="0" value={form.treks_completed} onChange={handleChange} style={input} />

            <button onClick={handleSave} disabled={saving} style={{ ...btnPrimary, width: "100%", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <h3 style={{ marginBottom: "24px", color: "#1d1d1f" }}>Your Activity</h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
              {[
                { icon: "👥", label: "Followers", value: followers, color: "#2d6a4f" },
                { icon: "➕", label: "Following", value: following, color: "#1e3a5f" },
                { icon: "🏔️", label: "Treks Done", value: form.treks_completed, color: "#f59e0b" },
                { icon: "📍", label: "Location", value: form.location || "Not set", color: "#ef4444" }
              ].map((stat) => (
                <div key={stat.label} style={{
                  background: "#f5f5f7", borderRadius: "16px", padding: "20px",
                  textAlign: "center"
                }}>
                  <p style={{ fontSize: "32px", margin: "0 0 8px" }}>{stat.icon}</p>
                  <p style={{ fontSize: "24px", fontWeight: "700", color: stat.color, margin: 0 }}>{stat.value}</p>
                  <p style={{ fontSize: "13px", color: "#6e6e73", margin: "4px 0 0" }}>{stat.label}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "24px", background: "#f5f5f7", borderRadius: "16px", padding: "20px" }}>
              <p style={{ fontWeight: "600", marginBottom: "8px", color: "#1d1d1f" }}>🏆 Experience Level</p>
              <div style={{ background: "#e5e5e5", borderRadius: "999px", height: "8px", marginBottom: "8px" }}>
                <div style={{
                  height: "8px", borderRadius: "999px", background: "#2d6a4f",
                  width: form.experience === "Beginner" ? "25%" :
                    form.experience === "Intermediate" ? "50%" :
                    form.experience === "Experienced" ? "75%" : "100%",
                  transition: "width 0.5s ease"
                }} />
              </div>
              <p style={{ fontSize: "13px", color: "#6e6e73", margin: 0 }}>{form.experience}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const label = {
  display: "block", marginBottom: "6px",
  fontWeight: "600", fontSize: "14px", color: "#333"
};

const input = {
  width: "100%", padding: "12px 16px", marginBottom: "16px",
  borderRadius: "10px", border: "1px solid #e5e5e5",
  fontSize: "15px", boxSizing: "border-box", outline: "none", fontFamily: "inherit"
};

const btnPrimary = {
  background: "#1d1d1f", color: "white", border: "none",
  padding: "14px", borderRadius: "10px", cursor: "pointer",
  fontWeight: "600", fontSize: "15px"
};

export default Profile;