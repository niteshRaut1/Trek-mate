import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #e9ecef", paddingBottom: "16px", marginBottom: "16px" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", background: "none", border: "none",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 0", cursor: "pointer", textAlign: "left"
        }}
      >
        <span style={{ fontWeight: "600", fontSize: "16px", color: "#1a1a2e" }}>{question}</span>
        <span style={{ fontSize: "20px", color: "#2d6a4f", transition: "transform 0.3s", transform: open ? "rotate(45deg)" : "rotate(0)" }}>+</span>
      </button>
      {open && (
        <p style={{ color: "#6c757d", fontSize: "15px", lineHeight: "1.7", paddingBottom: "8px" }}>
          {answer}
        </p>
      )}
    </div>
  );
}

function Home({ user }) {
  const [treks, setTreks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [hoveredId, setHoveredId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/api/treks")
      .then((res) => res.json())
      .then((data) => { setTreks(data); setFiltered(data); setLoading(false); });
  }, []);

  useEffect(() => {
    let results = treks;
    if (search) results = results.filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase())
    );
    if (difficulty !== "All") results = results.filter((t) => t.difficulty === difficulty);
    setFiltered(results);
  }, [search, difficulty, treks]);

  const difficultyColor = (d) => {
    switch (d) {
      case "Easy": return { bg: "#dcfce7", text: "#166534" };
      case "Moderate": return { bg: "#fef9c3", text: "#854d0e" };
      case "Hard": return { bg: "#fee2e2", text: "#991b1b" };
      case "Expert": return { bg: "#ede9fe", text: "#5b21b6" };
      default: return { bg: "#f3f4f6", text: "#374151" };
    }
  };

  const heliTours = [
    { name: "Everest Base Camp", altitude: "5,364m", price: "$1,400", duration: "4-5 hrs", emoji: "🏔️", image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600" },
    { name: "Annapurna Base Camp", altitude: "4,130m", price: "$2,000", duration: "3-4 hrs", emoji: "⛰️", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600" },
    { name: "Langtang Valley", altitude: "3,870m", price: "$2,200", duration: "2-3 hrs", emoji: "🌿", image: "https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=600" },
    { name: "Gokyo Lakes", altitude: "4,750m", price: "$4,200", duration: "4-5 hrs", emoji: "💎", image: "https://images.unsplash.com/photo-1606117331085-5760e3b58520?w=600" },
    { name: "Muktinath Temple", altitude: "3,800m", price: "$4,000", duration: "4-5 hrs", emoji: "🛕", image: "https://images.unsplash.com/photo-1585016495481-8ca707ef2b4a?w=600" },
    { name: "Poon Hill", altitude: "3,210m", price: "$2,850", duration: "2-3 hrs", emoji: "🌄", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600" }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff" }}>

      {/* Hero */}
      <div style={{
        position: "relative", height: "92vh", minHeight: "600px",
        overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url(https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1800)",
          backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.45)"
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(26,26,46,0.3) 0%, rgba(26,26,46,0.7) 100%)"
        }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 20px", maxWidth: "800px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.2)", borderRadius: "999px",
            padding: "8px 20px", fontSize: "13px", color: "rgba(255,255,255,0.9)",
            marginBottom: "28px", letterSpacing: "0.5px", fontWeight: "500"
          }}>
            🇳🇵 Nepal's Premier Trekking Community
          </div>
          <h1 style={{
            fontSize: "clamp(44px, 8vw, 88px)", fontWeight: "900", color: "white",
            lineHeight: "1.05", letterSpacing: "-3px", marginBottom: "24px"
          }}>
            Find Your<br />
            <span style={{
              background: "linear-gradient(135deg, #52b788, #f4a261)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>Trek Family</span>
          </h1>
          <p style={{
            fontSize: "18px", color: "rgba(255,255,255,0.8)",
            maxWidth: "480px", margin: "0 auto 40px", lineHeight: "1.7"
          }}>
            Connect with fellow trekkers, join safe groups, and explore the Himalayas together.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: "1", maxWidth: "380px" }}>
              <span style={{
                position: "absolute", left: "16px", top: "50%",
                transform: "translateY(-50%)", fontSize: "16px", opacity: 0.5
              }}>🔍</span>
              <input
                type="text"
                placeholder="Search treks or locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%", padding: "16px 16px 16px 48px",
                  borderRadius: "14px", border: "none", fontSize: "15px",
                  background: "rgba(255,255,255,0.95)", outline: "none",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.2)", fontFamily: "Inter, sans-serif"
                }}
              />
            </div>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              style={{
                padding: "16px 20px", borderRadius: "14px", border: "none",
                fontSize: "15px", background: "rgba(255,255,255,0.95)",
                cursor: "pointer", outline: "none",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                fontFamily: "Inter, sans-serif", fontWeight: "500"
              }}
            >
              <option>All</option>
              <option>Easy</option>
              <option>Moderate</option>
              <option>Hard</option>
              <option>Expert</option>
            </select>
          </div>
        </div>
        <div style={{
          position: "absolute", bottom: "32px", left: "50%",
          transform: "translateX(-50%)", color: "rgba(255,255,255,0.5)",
          fontSize: "22px", animation: "bounce 2s infinite"
        }}>↓</div>
      </div>

      {/* Stats */}
      <div style={{
        background: "linear-gradient(135deg, #1a1a2e, #2d6a4f)",
        padding: "40px", display: "flex", justifyContent: "center", gap: "64px", flexWrap: "wrap"
      }}>
        {[
          { number: "500+", label: "Active Trekkers", icon: "👥" },
          { number: "50+", label: "Trek Routes", icon: "🗺️" },
          { number: "100+", label: "Groups Formed", icon: "🤝" },
          { number: "4.9★", label: "Average Rating", icon: "⭐" }
        ].map((s) => (
          <div key={s.label} style={{ textAlign: "center", color: "white" }}>
            <p style={{ fontSize: "32px", fontWeight: "800", margin: 0, letterSpacing: "-1px" }}>
              {s.icon} {s.number}
            </p>
            <p style={{ fontSize: "13px", opacity: 0.7, margin: "6px 0 0", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Treks Grid */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px" }}>
          <div>
            <p style={{ color: "#52b788", fontSize: "13px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>
              Explore Nepal
            </p>
            <h2 style={{ fontSize: "40px", fontWeight: "800", letterSpacing: "-1.5px", color: "#1a1a2e" }}>
              {difficulty === "All" ? "Popular Treks" : `${difficulty} Treks`}
            </h2>
          </div>
          <span style={{ color: "#6c757d", fontSize: "15px", fontWeight: "500" }}>
            {filtered.length} trek{filtered.length !== 1 ? "s" : ""} found
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
            <p style={{ color: "#6c757d" }}>Loading treks...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px", background: "#f8f9fa", borderRadius: "24px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <h3 style={{ fontSize: "24px", marginBottom: "12px" }}>No treks found</h3>
            <p style={{ color: "#6c757d", marginBottom: "24px" }}>Try a different search or filter</p>
            <button
              onClick={() => { setSearch(""); setDifficulty("All"); }}
              style={{
                background: "#1a1a2e", color: "white", border: "none",
                padding: "12px 28px", borderRadius: "12px", cursor: "pointer",
                fontWeight: "600", fontSize: "14px"
              }}
            >Clear Filters</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "28px" }}>
            {filtered.map((trek) => {
              const dc = difficultyColor(trek.difficulty);
              return (
                <div
                  key={trek.id}
                  onMouseEnter={() => setHoveredId(trek.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => navigate(`/treks/${trek.id}`)}
                  style={{
                    background: "white", borderRadius: "20px", overflow: "hidden",
                    cursor: "pointer", border: "1px solid #e9ecef",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: hoveredId === trek.id ? "translateY(-8px)" : "translateY(0)",
                    boxShadow: hoveredId === trek.id ? "0 24px 64px rgba(0,0,0,0.15)" : "0 2px 12px rgba(0,0,0,0.06)"
                  }}
                >
                  <div style={{
                    height: "240px", position: "relative",
                    backgroundImage: trek.image_url ? `url(${trek.image_url})` : "linear-gradient(135deg, #1a1a2e, #2d6a4f)",
                    backgroundSize: "cover", backgroundPosition: "center"
                  }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.4) 100%)" }} />
                    <span style={{
                      position: "absolute", top: "16px", right: "16px",
                      background: dc.bg, color: dc.text,
                      padding: "6px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: "700"
                    }}>{trek.difficulty}</span>
                    <span style={{
                      position: "absolute", bottom: "16px", left: "16px",
                      background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)",
                      color: "white", padding: "4px 12px", borderRadius: "999px",
                      fontSize: "12px", fontWeight: "500"
                    }}>📅 {trek.duration_days} days</span>
                  </div>
                  <div style={{ padding: "24px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1a1a2e", margin: "0 0 8px" }}>{trek.name}</h3>
                    <p style={{ color: "#6c757d", fontSize: "14px", margin: "0 0 16px" }}>📍 {trek.location}</p>
                    <p style={{
                      color: "#6c757d", fontSize: "14px", lineHeight: "1.6", margin: "0 0 20px",
                      display: "-webkit-box", WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical", overflow: "hidden"
                    }}>{trek.description}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: "1px solid #f1f3f5" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{
                          width: "28px", height: "28px", borderRadius: "8px",
                          background: "linear-gradient(135deg, #1a1a2e, #2d6a4f)",
                          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px"
                        }}>🏔️</div>
                        <span style={{ fontSize: "13px", color: "#6c757d" }}>TrekMate</span>
                      </div>
                      <span style={{ color: "#2d6a4f", fontSize: "13px", fontWeight: "700" }}>Explore →</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Helicopter Tours */}
      <div style={{ background: "#f8f9fa", padding: "80px 40px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p style={{ color: "#52b788", fontSize: "13px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Premium Experience</p>
            <h2 style={{ fontSize: "40px", fontWeight: "800", letterSpacing: "-1.5px", color: "#1a1a2e" }}>🚁 Helicopter Tours</h2>
            <p style={{ color: "#6c757d", marginTop: "12px", fontSize: "16px" }}>Experience the Himalayas in luxury — reach base camps in hours, not days</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {heliTours.map((tour) => (
              <div key={tour.name} style={{
                background: "white", borderRadius: "20px", overflow: "hidden",
                border: "1px solid #e9ecef", boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
              }}>
                <div style={{
                  height: "180px", position: "relative",
                  backgroundImage: `url(${tour.image})`,
                  backgroundSize: "cover", backgroundPosition: "center"
                }}>
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
                  <div style={{ position: "absolute", bottom: "16px", left: "16px" }}>
                    <span style={{
                      background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)",
                      color: "white", padding: "4px 12px", borderRadius: "999px",
                      fontSize: "12px", fontWeight: "500"
                    }}>▲ {tour.altitude}</span>
                  </div>
                  <div style={{ position: "absolute", top: "16px", right: "16px", fontSize: "28px" }}>
                    {tour.emoji}
                  </div>
                </div>
                <div style={{ padding: "20px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "8px", color: "#1a1a2e" }}>{tour.name}</h3>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <span style={{ color: "#6c757d", fontSize: "13px" }}>⏱ {tour.duration}</span>
                    <span style={{ color: "#2d6a4f", fontWeight: "800", fontSize: "18px" }}>{tour.price}</span>
                  </div>
                  <button style={{
                    width: "100%", background: "linear-gradient(135deg, #1a1a2e, #2d6a4f)",
                    color: "white", border: "none", padding: "12px",
                    borderRadius: "12px", cursor: "pointer", fontWeight: "600", fontSize: "14px"
                  }}>Book Now →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ background: "white", padding: "80px 40px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p style={{ color: "#52b788", fontSize: "13px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>What Trekkers Say</p>
            <h2 style={{ fontSize: "40px", fontWeight: "800", letterSpacing: "-1.5px", color: "#1a1a2e" }}>⭐ Reviews</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
            {[
              { name: "Sarah M.", country: "🇺🇸 USA", trek: "Everest Base Camp", review: "Life-changing experience! The guide was incredible and every detail was perfectly organized. Reached EBC feeling strong!", rating: 5 },
              { name: "Kenji T.", country: "🇯🇵 Japan", trek: "Annapurna Circuit", review: "Best trek of my life. The views were breathtaking and the local culture made it even more special. Will come back!", rating: 5 },
              { name: "Emma L.", country: "🇬🇧 UK", trek: "Langtang Valley", review: "Perfect for first-timers! Our guide made sure we felt confident every step of the way. Absolutely magical trip.", rating: 5 }
            ].map((r) => (
              <div key={r.name} style={{ background: "#f8f9fa", borderRadius: "20px", padding: "28px", border: "1px solid #e9ecef" }}>
                <div style={{ display: "flex", gap: "4px", marginBottom: "16px" }}>
                  {[...Array(r.rating)].map((_, i) => (
                    <span key={i} style={{ color: "#f4a261", fontSize: "16px" }}>★</span>
                  ))}
                </div>
                <p style={{ color: "#374151", fontSize: "15px", lineHeight: "1.7", marginBottom: "20px", fontStyle: "italic" }}>"{r.review}"</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontWeight: "700", color: "#1a1a2e", margin: 0, fontSize: "14px" }}>{r.name}</p>
                    <p style={{ color: "#6c757d", margin: "2px 0 0", fontSize: "12px" }}>{r.country} · {r.trek}</p>
                  </div>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "12px",
                    background: "linear-gradient(135deg, #1a1a2e, #2d6a4f)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontWeight: "700", fontSize: "16px"
                  }}>{r.name[0]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", padding: "80px 40px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "#52b788", fontSize: "13px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Why TrekMate</p>
          <h2 style={{ fontSize: "40px", fontWeight: "800", letterSpacing: "-1.5px", color: "#1a1a2e", marginBottom: "48px" }}>Nepal's #1 Trekking Community</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px" }}>
            {[
              { icon: "🧭", title: "Expert Guides", desc: "Licensed Sherpa guides with decades of mountain experience and local knowledge" },
              { icon: "👥", title: "Small Groups", desc: "Maximum 12 trekkers per group for personalized attention and authentic experiences" },
              { icon: "⭐", title: "5000+ Happy Trekkers", desc: "Consistently rated 4.9/5 stars with hundreds of verified reviews" },
              { icon: "🆘", title: "24/7 Support", desc: "Round-the-clock assistance before, during, and after your trek" }
            ].map((f) => (
              <div key={f.title} style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", textAlign: "center" }}>
                <div style={{ fontSize: "40px", marginBottom: "16px" }}>{f.icon}</div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "8px", color: "#1a1a2e" }}>{f.title}</h3>
                <p style={{ color: "#6c757d", fontSize: "14px", lineHeight: "1.6" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ background: "white", padding: "80px 40px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p style={{ color: "#52b788", fontSize: "13px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Got Questions?</p>
            <h2 style={{ fontSize: "40px", fontWeight: "800", letterSpacing: "-1.5px", color: "#1a1a2e" }}>FAQ</h2>
          </div>
          {[
            { q: "Do I need previous trekking experience?", a: "Most of our treks are suitable for beginners with good fitness. We'll guide you every step of the way." },
            { q: "When is the best time to trek in Nepal?", a: "Spring (March-May) and Autumn (September-November) offer the best weather and visibility." },
            { q: "What is included in the trek price?", a: "Guide, porter, accommodation, meals, permits, and all necessary equipment are included." },
            { q: "What about altitude sickness?", a: "Our guides are trained in altitude sickness prevention. We acclimatize properly and carry emergency oxygen." }
          ].map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #2d6a4f 100%)", padding: "100px 40px", textAlign: "center" }}>
        <p style={{ color: "#52b788", fontSize: "13px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>Join the Community</p>
        <h2 style={{ fontSize: "48px", fontWeight: "900", color: "white", letterSpacing: "-2px", marginBottom: "20px" }}>Ready to Trek? 🏔️</h2>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "18px", maxWidth: "480px", margin: "0 auto 40px" }}>
          Join thousands of trekkers exploring Nepal's most beautiful trails together.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/signup")} style={{
            background: "white", color: "#1a1a2e", border: "none",
            padding: "16px 36px", borderRadius: "14px", fontSize: "16px",
            fontWeight: "700", cursor: "pointer", boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
          }}>Get Started Free →</button>
          <button onClick={() => navigate("/map")} style={{
            background: "rgba(255,255,255,0.1)", color: "white",
            border: "1px solid rgba(255,255,255,0.3)",
            padding: "16px 36px", borderRadius: "14px", fontSize: "16px",
            fontWeight: "600", cursor: "pointer", backdropFilter: "blur(8px)"
          }}>Explore Map 🗺️</button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: "#0d0d1a", color: "white", padding: "48px 40px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "16px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "linear-gradient(135deg, #1a1a2e, #2d6a4f)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px"
          }}>🏔️</div>
          <span style={{ fontSize: "18px", fontWeight: "800", letterSpacing: "-0.5px" }}>TrekMate</span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
          Built with ❤️ for Nepal's trekking community · 2026
        </p>
      </footer>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </div>
  );
}

export default Home;