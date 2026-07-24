import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import Home from "./pages/Home";
import TrekDetail from "./pages/TrekDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddTrek from "./pages/AddTrek";
import Groups from "./pages/Groups";
import Profile from "./pages/Profile";
import Feed from "./pages/Feed";
import Map from "./pages/Map";
import Health from "./pages/Health";
import Notifications from "./pages/Notifications";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function Navbar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:3001/api/notifications/${user.id}`)
      .then((res) => res.json())
      .then((data) => setUnreadCount(data.filter((n) => !n.is_read).length));
  }, [user]);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: "Treks", path: "/", icon: "🏔️" },
    { label: "Feed", path: "/feed", icon: "📸" },
    { label: "Map", path: "/map", icon: "🗺️" },
    { label: "Groups", path: "/groups", icon: "👥" },
    { label: "Health", path: "/health", icon: "🩺" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.98)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderBottom: `1px solid ${scrolled ? "#e9ecef" : "transparent"}`,
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      height: "68px",
      display: "flex", alignItems: "center",
      padding: "0 32px"
    }}>
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        style={{
          display: "flex", alignItems: "center", gap: "10px",
          cursor: "pointer", marginRight: "48px"
        }}
      >
        <div style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: "linear-gradient(135deg, #1a1a2e, #2d6a4f)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px", boxShadow: "0 2px 8px rgba(45,106,79,0.3)"
        }}>🏔️</div>
        <span style={{
          fontSize: "18px", fontWeight: "800", letterSpacing: "-0.5px",
          background: "linear-gradient(135deg, #1a1a2e, #2d6a4f)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>TrekMate</span>
      </div>

      {/* Nav Links */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1 }}>
        {navLinks.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            style={{
              background: isActive(item.path)
                ? "linear-gradient(135deg, #f0fdf4, #dcfce7)"
                : "transparent",
              border: "none",
              padding: "8px 16px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: isActive(item.path) ? "600" : "400",
              color: isActive(item.path) ? "#2d6a4f" : "#6c757d",
              cursor: "pointer",
              display: "flex", alignItems: "center", gap: "6px"
            }}
          >
            <span style={{ fontSize: "14px" }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Right Side */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {user ? (
          <>
            <button
              onClick={() => navigate("/add-trek")}
              style={{
                background: "linear-gradient(135deg, #2d6a4f, #52b788)",
                color: "white", border: "none",
                padding: "8px 18px", borderRadius: "10px",
                fontSize: "14px", fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(45,106,79,0.3)",
                display: "flex", alignItems: "center", gap: "6px"
              }}
            >
              <span>+</span> Add Trek
            </button>

            {/* Notifications */}
            <button
              onClick={() => navigate("/notifications")}
              style={{
                position: "relative", background: "#f8f9fa",
                border: "1px solid #e9ecef", cursor: "pointer",
                fontSize: "18px", padding: "8px", borderRadius: "10px",
                width: "40px", height: "40px",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}
            >
              🔔
              {unreadCount > 0 && (
                <span style={{
                  position: "absolute", top: "-4px", right: "-4px",
                  background: "#ef4444", color: "white", borderRadius: "50%",
                  width: "18px", height: "18px", fontSize: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: "700", border: "2px solid white"
                }}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Avatar */}
            <button
              onClick={() => navigate("/profile")}
              style={{
                width: "40px", height: "40px", borderRadius: "12px",
                background: "linear-gradient(135deg, #1a1a2e, #2d6a4f)",
                border: "none", color: "white", fontSize: "16px",
                fontWeight: "700", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 8px rgba(26,26,46,0.3)"
              }}
            >
              {user.user_metadata?.full_name?.[0]?.toUpperCase() || "U"}
            </button>

            <button
              onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}
              style={{
                background: "transparent", border: "1px solid #e9ecef",
                padding: "8px 14px", borderRadius: "10px",
                fontSize: "13px", color: "#6c757d", cursor: "pointer"
              }}
            >Logout</button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "transparent", border: "none",
                padding: "8px 16px", borderRadius: "10px",
                fontSize: "14px", color: "#6c757d", cursor: "pointer",
                fontWeight: "500"
              }}
            >Login</button>
            <button
              onClick={() => navigate("/signup")}
              style={{
                background: "linear-gradient(135deg, #1a1a2e, #2d6a4f)",
                color: "white", border: "none",
                padding: "8px 20px", borderRadius: "10px",
                fontSize: "14px", fontWeight: "600", cursor: "pointer",
                boxShadow: "0 2px 8px rgba(26,26,46,0.3)"
              }}
            >Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Navbar user={user} />
      <div style={{ paddingTop: "68px" }}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/treks/:id" element={<TrekDetail user={user} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/add-trek" element={<AddTrek user={user} />} />
          <Route path="/groups" element={<Groups user={user} />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/feed" element={<Feed user={user} />} />
          <Route path="/map" element={<Map />} />
          <Route path="/health" element={<Health user={user} />} />
          <Route path="/notifications" element={<Notifications user={user} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;