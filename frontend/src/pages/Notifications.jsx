import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Notifications({ user }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    const res = await fetch(`http://localhost:3001/api/notifications/${user.id}`);
    const data = await res.json();
    setNotifications(data);
    setLoading(false);
  };

  const markAsRead = async (id) => {
    await fetch(`http://localhost:3001/api/notifications/${id}/read`, {
      method: "POST"
    });
    setNotifications(notifications.map((n) =>
      n.id === id ? { ...n, is_read: true } : n
    ));
  };

  const markAllAsRead = async () => {
    await fetch(`http://localhost:3001/api/notifications/read-all/${user.id}`, {
      method: "POST"
    });
    setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
  };

  const getIcon = (type) => {
    switch (type) {
      case "like": return "❤️";
      case "comment": return "💬";
      case "group": return "👥";
      case "trek": return "🏔️";
      default: return "🔔";
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "48px" }}>🔒</p>
          <h2>Login Required</h2>
          <p style={{ color: "#6e6e73" }}>Login to see your notifications</p>
          <button onClick={() => navigate("/login")} style={btnPrimary}>Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f7", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <h2 style={{ fontSize: "32px", fontWeight: "700", letterSpacing: "-1px", margin: 0 }}>
              🔔 Notifications
            </h2>
            {unreadCount > 0 && (
              <p style={{ color: "#6e6e73", margin: "4px 0 0", fontSize: "14px" }}>
                {unreadCount} unread
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} style={{
              background: "transparent", border: "1px solid #e5e5e5",
              padding: "8px 16px", borderRadius: "8px", cursor: "pointer",
              fontSize: "14px", color: "#6e6e73"
            }}>
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <p style={{ color: "#6e6e73" }}>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "20px" }}>
            <p style={{ fontSize: "48px" }}>🔔</p>
            <h3 style={{ marginBottom: "8px" }}>No notifications yet</h3>
            <p style={{ color: "#6e6e73" }}>When someone likes or comments on your posts, you'll see it here</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  markAsRead(n.id);
                  if (n.link) navigate(n.link);
                }}
                style={{
                  background: n.is_read ? "white" : "#f0fdf4",
                  borderRadius: "16px",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  cursor: "pointer",
                  border: n.is_read ? "1px solid #e5e5e5" : "1px solid #bbf7d0",
                  transition: "all 0.2s ease"
                }}
              >
                {/* Icon */}
                <div style={{
                  width: "44px", height: "44px", borderRadius: "50%",
                  background: "#f5f5f7", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: "20px", flexShrink: 0
                }}>
                  {getIcon(n.type)}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: "15px", color: "#1d1d1f", lineHeight: "1.4" }}>
                    {n.message}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#6e6e73" }}>
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>

                {/* Unread dot */}
                {!n.is_read && (
                  <div style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    background: "#2d6a4f", flexShrink: 0
                  }} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const btnPrimary = {
  background: "#1d1d1f", color: "white", border: "none",
  padding: "14px 28px", borderRadius: "10px", cursor: "pointer",
  fontWeight: "600", fontSize: "15px", marginTop: "16px"
};

export default Notifications;