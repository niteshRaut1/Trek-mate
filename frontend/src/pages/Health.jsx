import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SYMPTOMS = [
  "Headache", "Nausea", "Dizziness", "Shortness of breath",
  "Fatigue", "Loss of appetite", "Sleep trouble", "None"
];

function Health({ user }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState({
    fitness_level: "Moderate",
    medical_conditions: "",
    medications: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    blood_type: ""
  });
  const [checkins, setCheckins] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [checkin, setCheckin] = useState({
    altitude_m: "",
    symptoms: [],
    severity: "Mild",
    notes: ""
  });
  const [sosActive, setSosActive] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:3001/api/health-profile/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setProfile({
            fitness_level: data.fitness_level || "Moderate",
            medical_conditions: data.medical_conditions || "",
            medications: data.medications || "",
            emergency_contact_name: data.emergency_contact_name || "",
            emergency_contact_phone: data.emergency_contact_phone || "",
            blood_type: data.blood_type || ""
          });
        }
      });
    fetchCheckins();
  }, [user]);

  const fetchCheckins = () => {
    fetch(`http://localhost:3001/api/health-checkins/${user.id}`)
      .then((res) => res.json())
      .then((data) => setCheckins(data));
  };

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "48px" }}>🔒</p>
          <h2>Login Required</h2>
          <p style={{ color: "#6e6e73" }}>You need to login to access health monitoring.</p>
          <button onClick={() => navigate("/login")} style={btnPrimary}>Go to Login</button>
        </div>
      </div>
    );
  }

  const saveProfile = async () => {
    setSaving(true);
    setSaved(false);
    const res = await fetch("http://localhost:3001/api/health-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, ...profile })
    });
    if (res.ok) setSaved(true);
    setSaving(false);
  };

  const toggleSymptom = (s) => {
    setCheckin((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(s)
        ? prev.symptoms.filter((x) => x !== s)
        : [...prev.symptoms, s]
    }));
  };

  const submitCheckin = async (status = "ok") => {
    const res = await fetch("http://localhost:3001/api/health-checkins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        trek_id: null,
        altitude_m: checkin.altitude_m ? parseInt(checkin.altitude_m) : null,
        symptoms: checkin.symptoms.join(", "),
        severity: checkin.severity,
        notes: checkin.notes,
        status
      })
    });
    if (res.ok) {
      fetchCheckins();
      setCheckin({ altitude_m: "", symptoms: [], severity: "Mild", notes: "" });
      if (status === "sos") {
        setSosActive(true);
        setTimeout(() => setSosActive(false), 4000);
      }
    }
  };

  const severityColor = (s) => {
    switch (s) {
      case "Mild": return "#f59e0b";
      case "Moderate": return "#ef4444";
      case "Severe": return "#7c3aed";
      default: return "#2d6a4f";
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f7", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "40px 20px" }}>

        <h2 style={{ fontSize: "32px", fontWeight: "700", letterSpacing: "-1px", marginBottom: "8px" }}>
          🩺 Health & Safety
        </h2>
        <p style={{ color: "#6e6e73", marginBottom: "32px" }}>
          Track your fitness, log symptoms, and stay safe on the trail
        </p>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", background: "white", padding: "6px", borderRadius: "14px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          {[
            { id: "profile", label: "📋 Health Profile" },
            { id: "checkin", label: "🫁 Daily Check-in" },
            { id: "history", label: "📊 History" }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1,
                background: tab === t.id ? "#1d1d1f" : "transparent",
                color: tab === t.id ? "white" : "#6e6e73",
                border: "none",
                padding: "10px",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500"
              }}
            >{t.label}</button>
          ))}
        </div>

        {/* SOS Button - always visible */}
        <div style={{
          background: sosActive ? "#ef4444" : "linear-gradient(135deg, #dc2626, #ef4444)",
          borderRadius: "16px",
          padding: "20px 24px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white"
        }}>
          <div>
            <p style={{ margin: 0, fontWeight: "700", fontSize: "16px" }}>
              {sosActive ? "🚨 SOS Sent! Stay calm, help is on the way." : "Emergency Situation?"}
            </p>
            <p style={{ margin: "4px 0 0", fontSize: "13px", opacity: 0.9 }}>
              {sosActive ? "Your emergency contact and group have been notified." : "Send an instant SOS check-in"}
            </p>
          </div>
          {!sosActive && (
            <button
              onClick={() => submitCheckin("sos")}
              style={{
                background: "white", color: "#ef4444", border: "none",
                padding: "12px 24px", borderRadius: "999px", cursor: "pointer",
                fontWeight: "700", fontSize: "14px", whiteSpace: "nowrap"
              }}
            >🆘 SOS</button>
          )}
        </div>

        {/* Profile Tab */}
        {tab === "profile" && (
          <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            {saved && <p style={{ color: "#2d6a4f", fontWeight: "600", marginBottom: "16px" }}>✅ Health profile saved!</p>}

            <label style={label}>Fitness Level</label>
            <select
              value={profile.fitness_level}
              onChange={(e) => setProfile({ ...profile, fitness_level: e.target.value })}
              style={input}
            >
              <option>Beginner</option>
              <option>Moderate</option>
              <option>Good</option>
              <option>Excellent</option>
            </select>

            <label style={label}>Blood Type</label>
            <select
              value={profile.blood_type}
              onChange={(e) => setProfile({ ...profile, blood_type: e.target.value })}
              style={input}
            >
              <option value="">Select...</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bt) => (
                <option key={bt}>{bt}</option>
              ))}
            </select>

            <label style={label}>Medical Conditions</label>
            <textarea
              placeholder="e.g. Asthma, high blood pressure, none..."
              value={profile.medical_conditions}
              onChange={(e) => setProfile({ ...profile, medical_conditions: e.target.value })}
              rows={2}
              style={{ ...input, resize: "vertical" }}
            />

            <label style={label}>Current Medications</label>
            <input
              placeholder="e.g. Diamox, none..."
              value={profile.medications}
              onChange={(e) => setProfile({ ...profile, medications: e.target.value })}
              style={input}
            />

            <label style={label}>Emergency Contact Name</label>
            <input
              placeholder="e.g. Family member name"
              value={profile.emergency_contact_name}
              onChange={(e) => setProfile({ ...profile, emergency_contact_name: e.target.value })}
              style={input}
            />

            <label style={label}>Emergency Contact Phone</label>
            <input
              placeholder="e.g. +977..."
              value={profile.emergency_contact_phone}
              onChange={(e) => setProfile({ ...profile, emergency_contact_phone: e.target.value })}
              style={input}
            />

            <button onClick={saveProfile} disabled={saving} style={{ ...btnPrimary, width: "100%", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving..." : "Save Health Profile"}
            </button>
          </div>
        )}

        {/* Check-in Tab */}
        {tab === "checkin" && (
          <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <h3 style={{ marginBottom: "20px", fontSize: "18px" }}>How are you feeling today?</h3>

            <label style={label}>Current Altitude (meters)</label>
            <input
              type="number"
              placeholder="e.g. 4200"
              value={checkin.altitude_m}
              onChange={(e) => setCheckin({ ...checkin, altitude_m: e.target.value })}
              style={input}
            />

            <label style={label}>Symptoms (select any)</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
              {SYMPTOMS.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSymptom(s)}
                  style={{
                    background: checkin.symptoms.includes(s) ? "#1d1d1f" : "#f5f5f7",
                    color: checkin.symptoms.includes(s) ? "white" : "#1d1d1f",
                    border: "none", padding: "8px 14px", borderRadius: "999px",
                    cursor: "pointer", fontSize: "13px", fontWeight: "500"
                  }}
                >{s}</button>
              ))}
            </div>

            <label style={label}>Severity</label>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              {["Mild", "Moderate", "Severe"].map((s) => (
                <button
                  key={s}
                  onClick={() => setCheckin({ ...checkin, severity: s })}
                  style={{
                    flex: 1,
                    background: checkin.severity === s ? severityColor(s) : "#f5f5f7",
                    color: checkin.severity === s ? "white" : "#1d1d1f",
                    border: "none", padding: "10px", borderRadius: "10px",
                    cursor: "pointer", fontSize: "14px", fontWeight: "500"
                  }}
                >{s}</button>
              ))}
            </div>

            <label style={label}>Notes</label>
            <textarea
              placeholder="Anything else to note..."
              value={checkin.notes}
              onChange={(e) => setCheckin({ ...checkin, notes: e.target.value })}
              rows={3}
              style={{ ...input, resize: "vertical" }}
            />

            <button onClick={() => submitCheckin("ok")} style={{ ...btnPrimary, width: "100%" }}>
              Submit Check-in
            </button>

            {checkin.symptoms.length > 0 && checkin.severity === "Severe" && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", padding: "16px", marginTop: "16px" }}>
                <p style={{ color: "#dc2626", fontSize: "14px", margin: 0, fontWeight: "600" }}>
                  ⚠️ Severe symptoms can indicate altitude sickness. Consider descending and seeking help immediately.
                </p>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {tab === "history" && (
          <div>
            {checkins.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "20px" }}>
                <p style={{ fontSize: "48px" }}>📊</p>
                <h3>No check-ins yet</h3>
                <p style={{ color: "#6e6e73" }}>Submit your first daily check-in</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {checkins.map((c) => (
                  <div key={c.id} style={{
                    background: "white", borderRadius: "16px", padding: "20px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    borderLeft: c.status === "sos" ? "4px solid #ef4444" : `4px solid ${severityColor(c.severity)}`
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontWeight: "600", fontSize: "14px" }}>
                        {c.status === "sos" ? "🆘 SOS Alert" : `🫁 Check-in`}
                      </span>
                      <span style={{ color: "#6e6e73", fontSize: "12px" }}>
                        {new Date(c.created_at).toLocaleString()}
                      </span>
                    </div>
                    {c.altitude_m && <p style={{ margin: "4px 0", fontSize: "13px", color: "#6e6e73" }}>⛰️ Altitude: {c.altitude_m}m</p>}
                    {c.symptoms && <p style={{ margin: "4px 0", fontSize: "13px", color: "#6e6e73" }}>Symptoms: {c.symptoms || "None"}</p>}
                    <p style={{ margin: "4px 0", fontSize: "13px", color: "#6e6e73" }}>Severity: {c.severity}</p>
                    {c.notes && <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#1d1d1f" }}>{c.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const label = {
  display: "block",
  marginBottom: "6px",
  fontWeight: "600",
  fontSize: "14px",
  color: "#333"
};

const input = {
  width: "100%",
  padding: "12px 16px",
  marginBottom: "16px",
  borderRadius: "10px",
  border: "1px solid #e5e5e5",
  fontSize: "15px",
  boxSizing: "border-box",
  outline: "none",
  fontFamily: "inherit"
};

const btnPrimary = {
  background: "#1d1d1f",
  color: "white",
  border: "none",
  padding: "14px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "15px"
};

export default Health;