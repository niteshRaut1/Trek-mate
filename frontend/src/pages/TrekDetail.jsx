import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function TrekDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trek, setTrek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [comment, setComment] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [activeTab, setActiveTab] = useState("about");
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/treks/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTrek(data);
        setLoading(false);
        if (data.latitude && data.longitude) {
          setWeatherLoading(true);
         fetch(`${import.meta.env.VITE_API_URL}/api/weather/${data.latitude}/${data.longitude}`)
            .then((res) => res.json())
            .then((w) => {
              setWeather(w);
              setWeatherLoading(false);
            });
        }
      });

    fetch(`${import.meta.env.VITE_API_URL}/api/comments/${id}`)
      .then((res) => res.json())
      .then((data) => setComments(data));

    fetch(`${import.meta.env.VITE_API_URL}/api/photos/${id}`)
      .then((res) => res.json())
      .then((data) => setPhotos(data));
  }, [id]);

  const handleComment = async () => {
    if (!comment.trim()) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trek_id: parseInt(id),
        user_id: user?.id || "anonymous",
        user_name: user?.user_metadata?.full_name || user?.email || "Anonymous",
        content: comment
      })
    });
    if (res.ok) {
      const newComment = await res.json();
      setComments([newComment[0], ...comments]);
      setComment("");
    }
  };

  const handlePhoto = async () => {
    if (!photoUrl.trim()) return;
const res = await fetch(`${import.meta.env.VITE_API_URL}/api/photos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trek_id: parseInt(id),
        user_id: user?.id || "anonymous",
        user_name: user?.user_metadata?.full_name || user?.email || "Anonymous",
        photo_url: photoUrl,
        caption
      })
    });
    if (res.ok) {
      const newPhoto = await res.json();
      setPhotos([newPhoto[0], ...photos]);
      setPhotoUrl("");
      setCaption("");
    }
  };

  const handleLike = async (photoId) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/photos/${photoId}/like`, {
      method: "POST"
    });
    if (res.ok) {
      setPhotos(photos.map((p) =>
        p.id === photoId ? { ...p, likes: p.likes + 1 } : p
      ));
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#6e6e73" }}>Loading trek...</p>
    </div>
  );

  if (!trek) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#6e6e73" }}>Trek not found.</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" }}>

      {/* Hero Image */}
      <div style={{
        height: "60vh", minHeight: "400px",
        backgroundImage: trek.image_url ? `url(${trek.image_url})` : "linear-gradient(135deg, #1e3a5f, #2d6a4f)",
        backgroundSize: "cover", backgroundPosition: "center", position: "relative"
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))" }} />
        <button
          onClick={() => navigate("/")}
          style={{
            position: "absolute", top: "24px", left: "24px",
            background: "rgba(255,255,255,0.9)", border: "none",
            padding: "10px 20px", borderRadius: "999px", cursor: "pointer",
            fontSize: "14px", fontWeight: "500"
          }}
        >← Back</button>
        <div style={{ position: "absolute", bottom: "40px", left: "40px", right: "40px", color: "white" }}>
          <span style={{
            background: difficultyColor(trek.difficulty), color: "white",
            padding: "6px 14px", borderRadius: "999px", fontSize: "12px",
            fontWeight: "600", marginBottom: "16px", display: "inline-block"
          }}>{trek.difficulty}</span>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: "700", letterSpacing: "-1px", margin: "8px 0" }}>
            {trek.name}
          </h1>
          <p style={{ fontSize: "18px", opacity: 0.9 }}>📍 {trek.location}</p>
        </div>
      </div>

     {/* Tabs */}
<div style={{ borderBottom: "1px solid #e5e5e5", background: "white", position: "sticky", top: "64px", zIndex: 100 }}>
  <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 40px", display: "flex", gap: "32px" }}>
    {["about", "photos", "chat"].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        style={{
          background: "transparent", border: "none",
          padding: "16px 0", fontSize: "15px", fontWeight: "500",
          color: activeTab === tab ? "#1d1d1f" : "#6e6e73",
          borderBottom: activeTab === tab ? "2px solid #1d1d1f" : "2px solid transparent",
          cursor: "pointer", textTransform: "capitalize"
        }}
      >
        {tab === "about" ? "📋 About" : tab === "photos" ? `📸 Photos (${photos?.length || 0})` : `💬 Chat (${comments?.length || 0})`}
      </button>
    ))}
  </div>
</div>

      {/* Content */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px" }}>

        {/* About Tab */}
        {activeTab === "about" && (
          <div>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "32px" }}>
              {[
                { icon: "📅", label: "Duration", value: `${trek.duration_days} days` },
                { icon: "⛰️", label: "Difficulty", value: trek.difficulty },
                { icon: "📍", label: "Location", value: trek.location }
              ].map((stat) => (
                <div key={stat.label} style={{ background: "#f5f5f7", borderRadius: "16px", padding: "24px", textAlign: "center" }}>
                  <p style={{ fontSize: "32px", margin: "0 0 8px" }}>{stat.icon}</p>
                  <p style={{ color: "#6e6e73", fontSize: "12px", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "1px" }}>{stat.label}</p>
                  <p style={{ fontWeight: "600", fontSize: "16px", margin: 0 }}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Weather Widget */}
            {weatherLoading && (
              <div style={{ background: "#f5f5f7", borderRadius: "16px", padding: "20px", marginBottom: "24px", textAlign: "center" }}>
                <p style={{ color: "#6e6e73" }}>🌤️ Loading weather...</p>
              </div>
            )}
            {weather && !weather.error && (
              <div style={{
                background: "linear-gradient(135deg, #1e3a5f, #2d6a4f)",
                borderRadius: "16px", padding: "24px", marginBottom: "32px", color: "white"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: "13px", opacity: 0.8, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>
                      Current Weather
                    </p>
                    <p style={{ fontSize: "48px", fontWeight: "700", margin: "0 0 4px" }}>{weather.temp}°C</p>
                    <p style={{ opacity: 0.9, textTransform: "capitalize", margin: 0 }}>{weather.description}</p>
                  </div>
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                    alt="weather"
                    style={{ width: "80px", height: "80px" }}
                  />
                </div>
                <div style={{
                  display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px",
                  marginTop: "20px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.2)"
                }}>
                  {[
                    { value: `${weather.humidity}%`, label: "Humidity" },
                    { value: `${weather.wind_speed} m/s`, label: "Wind" },
                    { value: `${weather.feels_like}°C`, label: "Feels Like" }
                  ].map((w) => (
                    <div key={w.label} style={{ textAlign: "center" }}>
                      <p style={{ fontSize: "20px", fontWeight: "700", margin: 0 }}>{w.value}</p>
                      <p style={{ fontSize: "12px", opacity: 0.75, margin: "4px 0 0" }}>{w.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <h2 style={{ fontSize: "28px", fontWeight: "700", letterSpacing: "-0.5px", marginBottom: "16px" }}>
              About this Trek
            </h2>
            <p style={{ color: "#6e6e73", fontSize: "17px", lineHeight: "1.8", marginBottom: "40px" }}>
              {trek.description}
            </p>

            {/* CTA */}
            <div style={{ background: "linear-gradient(135deg, #1e3a5f, #2d6a4f)", borderRadius: "20px", padding: "40px", textAlign: "center", color: "white" }}>
              <h3 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "12px" }}>Ready to Trek? 🏔️</h3>
              <p style={{ opacity: 0.85, marginBottom: "24px" }}>Join a group or create your own trekking team</p>
              <button
                onClick={() => navigate("/groups")}
                style={{ background: "white", color: "#1d1d1f", border: "none", padding: "14px 32px", borderRadius: "999px", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}
              >Find a Group →</button>
            </div>
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === "photos" && (
          <div>
            {user ? (
              <div style={{ background: "#f5f5f7", borderRadius: "16px", padding: "24px", marginBottom: "32px" }}>
                <h3 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>📸 Share a Photo</h3>
                <input
                  placeholder="Paste image URL..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  style={inputStyle}
                />
                <input
                  placeholder="Add a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  style={inputStyle}
                />
                {photoUrl && (
                  <img
                    src={photoUrl} alt="preview"
                    style={{ width: "100%", borderRadius: "12px", marginBottom: "12px", maxHeight: "200px", objectFit: "cover" }}
                    onError={(e) => e.target.style.display = "none"}
                  />
                )}
                <button onClick={handlePhoto} style={btnPrimary}>Share Photo</button>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "24px", background: "#f5f5f7", borderRadius: "16px", marginBottom: "32px" }}>
                <p style={{ color: "#6e6e73", marginBottom: "12px" }}>Login to share photos</p>
                <button onClick={() => navigate("/login")} style={btnPrimary}>Login</button>
              </div>
            )}
            {photos.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px" }}>
                <p style={{ fontSize: "48px" }}>📸</p>
                <h3>No photos yet</h3>
                <p style={{ color: "#6e6e73" }}>Be the first to share a photo!</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
                {photos.map((photo) => (
                  <div key={photo.id} style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid #e5e5e5" }}>
                    <img src={photo.photo_url} alt={photo.caption} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                    <div style={{ padding: "16px" }}>
                      {photo.caption && <p style={{ fontSize: "14px", marginBottom: "8px" }}>{photo.caption}</p>}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", color: "#6e6e73" }}>by {photo.user_name}</span>
                        <button onClick={() => handleLike(photo.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#6e6e73" }}>
                          ❤️ {photo.likes}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div>
            {user ? (
              <div style={{ background: "#f5f5f7", borderRadius: "16px", padding: "24px", marginBottom: "32px" }}>
                <h3 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>💬 Join the conversation</h3>
                <textarea
                  placeholder="Share your experience or ask a question..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
                <button onClick={handleComment} style={btnPrimary}>Post Comment</button>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "24px", background: "#f5f5f7", borderRadius: "16px", marginBottom: "32px" }}>
                <p style={{ color: "#6e6e73", marginBottom: "12px" }}>Login to join the conversation</p>
                <button onClick={() => navigate("/login")} style={btnPrimary}>Login</button>
              </div>
            )}
            {comments.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px" }}>
                <p style={{ fontSize: "48px" }}>💬</p>
                <h3>No comments yet</h3>
                <p style={{ color: "#6e6e73" }}>Be the first to comment!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {comments.map((c) => (
                  <div key={c.id} style={{ background: "#f5f5f7", borderRadius: "16px", padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontWeight: "600", fontSize: "14px" }}>👤 {c.user_name}</span>
                      <span style={{ color: "#6e6e73", fontSize: "12px" }}>{new Date(c.created_at).toLocaleDateString()}</span>
                    </div>
                    <p style={{ color: "#1d1d1f", lineHeight: "1.6", margin: 0 }}>{c.content}</p>
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

function difficultyColor(difficulty) {
  switch (difficulty) {
    case "Easy": return "#2d6a4f";
    case "Moderate": return "#f59e0b";
    case "Hard": return "#ef4444";
    case "Expert": return "#7c3aed";
    default: return "#555";
  }
}

const inputStyle = {
  width: "100%", padding: "12px 16px", borderRadius: "10px",
  border: "1px solid #e5e5e5", fontSize: "15px", marginBottom: "12px",
  outline: "none", boxSizing: "border-box", background: "white"
};

const btnPrimary = {
  background: "#1d1d1f", color: "white", border: "none",
  padding: "12px 24px", borderRadius: "10px", fontSize: "15px",
  fontWeight: "500", cursor: "pointer"
};

export default TrekDetail;