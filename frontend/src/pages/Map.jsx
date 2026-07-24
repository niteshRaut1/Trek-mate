import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function Map() {
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/api/treks")
      .then((res) => res.json())
      .then((data) => {
        const withCoords = data.filter((t) => t.latitude && t.longitude);
        setTreks(withCoords);
        setLoading(false);
      });
  }, []);

  const difficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy": return "#2d6a4f";
      case "Moderate": return "#f59e0b";
      case "Hard": return "#ef4444";
      case "Expert": return "#7c3aed";
      default: return "#555";
    }
  };

  const trailColor = (difficulty) => {
    switch (difficulty) {
      case "Easy": return "#2d6a4f";
      case "Moderate": return "#f59e0b";
      case "Hard": return "#ef4444";
      case "Expert": return "#7c3aed";
      default: return "#1e3a5f";
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f7", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" }}>

      {/* Header */}
      <div style={{
        background: "white",
        padding: "24px 40px",
        borderBottom: "1px solid #e5e5e5"
      }}>
        <h2 style={{ fontSize: "32px", fontWeight: "700", letterSpacing: "-1px", margin: 0 }}>
          🗺️ Trek Map
        </h2>
        <p style={{ color: "#6e6e73", margin: "8px 0 0" }}>
          Explore all trek routes across Nepal
        </p>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 140px)" }}>

        {/* Sidebar */}
        <div style={{
          width: "320px",
          background: "white",
          borderRight: "1px solid #e5e5e5",
          overflowY: "auto",
          flexShrink: 0
        }}>
          <div style={{ padding: "16px" }}>
            <p style={{ color: "#6e6e73", fontSize: "13px", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
              {treks.length} Trek Routes
            </p>

            {/* Legend */}
            <div style={{ background: "#f5f5f7", borderRadius: "12px", padding: "12px 16px", marginBottom: "16px" }}>
              <p style={{ fontSize: "12px", fontWeight: "600", marginBottom: "8px", color: "#1d1d1f" }}>DIFFICULTY</p>
              {["Easy", "Moderate", "Hard", "Expert"].map((d) => (
                <div key={d} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <div style={{ width: "24px", height: "3px", background: difficultyColor(d), borderRadius: "2px" }} />
                  <span style={{ fontSize: "13px", color: "#6e6e73" }}>{d}</span>
                </div>
              ))}
            </div>

            {loading ? (
              <p style={{ color: "#6e6e73" }}>Loading...</p>
            ) : (
              treks.map((trek) => (
                <div
                  key={trek.id}
                  onClick={() => setSelected(trek)}
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    marginBottom: "8px",
                    cursor: "pointer",
                    background: selected?.id === trek.id ? "#f0fdf4" : "#f5f5f7",
                    border: `2px solid ${selected?.id === trek.id ? "#2d6a4f" : "transparent"}`,
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "600" }}>{trek.name}</h3>
                    <span style={{
                      background: difficultyColor(trek.difficulty),
                      color: "white", padding: "3px 10px",
                      borderRadius: "999px", fontSize: "11px", fontWeight: "600"
                    }}>{trek.difficulty}</span>
                  </div>
                  <p style={{ color: "#6e6e73", fontSize: "13px", margin: "0 0 4px" }}>📍 {trek.location}</p>
                  <p style={{ color: "#6e6e73", fontSize: "13px", margin: 0 }}>📅 {trek.duration_days} days</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Map */}
        <div style={{ flex: 1, position: "relative" }}>
          <MapContainer
            center={[28.3949, 84.1240]}
            zoom={7}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />

            {treks.map((trek) => (
              <>
                {/* Trail Line */}
                {trek.trail_coordinates && (
                  <Polyline
                    key={`trail-${trek.id}`}
                    positions={trek.trail_coordinates}
                    color={trailColor(trek.difficulty)}
                    weight={selected?.id === trek.id ? 5 : 3}
                    opacity={selected?.id === trek.id ? 1 : 0.6}
                    eventHandlers={{ click: () => setSelected(trek) }}
                  />
                )}

                {/* Marker */}
                <Marker
                  key={`marker-${trek.id}`}
                  position={[trek.latitude, trek.longitude]}
                  eventHandlers={{ click: () => setSelected(trek) }}
                >
                  <Popup>
                    <div style={{ minWidth: "200px" }}>
                      <h3 style={{ margin: "0 0 8px", fontSize: "16px" }}>{trek.name}</h3>
                      <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#555" }}>📍 {trek.location}</p>
                      <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#555" }}>⛰️ {trek.difficulty}</p>
                      <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#555" }}>📅 {trek.duration_days} days</p>
                      <button
                        onClick={() => navigate(`/treks/${trek.id}`)}
                        style={{
                          background: "#1d1d1f", color: "white", border: "none",
                          padding: "8px 16px", borderRadius: "8px", cursor: "pointer",
                          fontSize: "13px", fontWeight: "500", width: "100%"
                        }}
                      >View Details</button>
                    </div>
                  </Popup>
                </Marker>
              </>
            ))}
          </MapContainer>

          {/* Selected Trek Info */}
          {selected && (
            <div style={{
              position: "absolute",
              bottom: "24px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "white",
              borderRadius: "16px",
              padding: "20px 24px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              zIndex: 1000,
              minWidth: "300px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px"
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <div style={{ width: "24px", height: "3px", background: trailColor(selected.difficulty), borderRadius: "2px" }} />
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>{selected.name}</h3>
                </div>
                <p style={{ margin: 0, color: "#6e6e73", fontSize: "13px" }}>
                  {selected.difficulty} · {selected.duration_days} days · {selected.location}
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    background: "#f5f5f7", color: "#1d1d1f", border: "none",
                    padding: "10px 16px", borderRadius: "10px", cursor: "pointer",
                    fontSize: "14px"
                  }}
                >✕</button>
                <button
                  onClick={() => navigate(`/treks/${selected.id}`)}
                  style={{
                    background: "#1d1d1f", color: "white", border: "none",
                    padding: "10px 20px", borderRadius: "10px", cursor: "pointer",
                    fontSize: "14px", fontWeight: "500", whiteSpace: "nowrap"
                  }}
                >View →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Map;