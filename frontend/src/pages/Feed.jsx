import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

function Feed({ user }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [showComments, setShowComments] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [following, setFollowing] = useState({});
  const [showMenu, setShowMenu] = useState({});
  const fileRef = useRef();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await fetch("http://${import.meta.env.VITE_API_URL}/api/feed");
    const data = await res.json();
    setPosts(data);
    setLoading(false);

    if (user) {
      data.forEach(async (post) => {
        const likeRes = await fetch(`http://${import.meta.env.VITE_API_URL}/api/feed/${post.id}/liked/${user.id}`);
        const likeResult = await likeRes.json();
        setLikedPosts((prev) => ({ ...prev, [post.id]: likeResult.liked }));

        if (post.user_id !== user.id) {
          const followRes = await fetch(`http://${import.meta.env.VITE_API_URL}/api/follow/${user.id}/${post.user_id}`);
          const followResult = await followRes.json();
          setFollowing((prev) => ({ ...prev, [post.user_id]: followResult.following }));
        }
      });
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("trek-media")
      .upload(fileName, file);

    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("trek-media")
      .getPublicUrl(fileName);

    const isVideo = file.type.startsWith("video/");

    const res = await fetch("http://${import.meta.env.VITE_API_URL}/api/feed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email,
        media_url: publicUrl,
        media_type: isVideo ? "video" : "image",
        caption
      })
    });

    const responseData = await res.json();
    if (res.ok) {
      setPosts([responseData[0], ...posts]);
      setFile(null);
      setPreview(null);
      setCaption("");
      fileRef.current.value = "";
    }
    setUploading(false);
  };

  const handleLike = async (postId) => {
    if (!user) { navigate("/login"); return; }
    const res = await fetch(`http://${import.meta.env.VITE_API_URL}/api/feed/${postId}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id })
    });
    if (res.ok) {
      const result = await res.json();
      setLikedPosts((prev) => ({ ...prev, [postId]: result.liked }));
      setPosts(posts.map((p) =>
        p.id === postId ? { ...p, likes: result.data[0].likes } : p
      ));
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    const res = await fetch(`http://${import.meta.env.VITE_API_URL}/api/feed/${postId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id })
    });
    if (res.ok) {
      setPosts(posts.filter((p) => p.id !== postId));
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    const res = await fetch(`http://${import.meta.env.VITE_API_URL}/api/feed/${postId}/comments/${commentId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id })
    });
    if (res.ok) {
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((c) => c.id !== commentId)
      }));
    }
  };

  const handleFollow = async (targetUserId) => {
    if (!user) { navigate("/login"); return; }
    const isFollowing = following[targetUserId];

    if (isFollowing) {
      await fetch("http://${import.meta.env.VITE_API_URL}/api/follow", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ follower_id: user.id, following_id: targetUserId })
      });
      setFollowing((prev) => ({ ...prev, [targetUserId]: false }));
    } else {
      await fetch("http://${import.meta.env.VITE_API_URL}/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ follower_id: user.id, following_id: targetUserId })
      });
      setFollowing((prev) => ({ ...prev, [targetUserId]: true }));
    }
  };

  const fetchComments = async (postId) => {
    const res = await fetch(`http://${import.meta.env.VITE_API_URL}/api/feed/${postId}/comments`);
    const data = await res.json();
    setComments((prev) => ({ ...prev, [postId]: data }));
  };

  const toggleComments = async (postId) => {
    if (!showComments[postId]) await fetchComments(postId);
    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleComment = async (postId) => {
    if (!user) { navigate("/login"); return; }
    const content = commentInputs[postId];
    if (!content?.trim()) return;

    const res = await fetch(`http://${import.meta.env.VITE_API_URL}/api/feed/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email,
        content
      })
    });

    if (res.ok) {
      const newComment = await res.json();
      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment[0]]
      }));
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f7", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}>

        <h2 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "32px", letterSpacing: "-1px" }}>
          🏔️ Trek Feed
        </h2>

        {/* Upload Section */}
        {user ? (
          <div style={{ background: "white", borderRadius: "20px", padding: "24px", marginBottom: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: "linear-gradient(135deg, #1e3a5f, #2d6a4f)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: "600"
              }}>
                {user.user_metadata?.full_name?.[0] || "👤"}
              </div>
              <textarea
                placeholder="Share your trek experience..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={2}
                style={{
                  flex: 1, padding: "12px 16px", borderRadius: "12px",
                  border: "1px solid #e5e5e5", fontSize: "15px",
                  outline: "none", resize: "none", fontFamily: "inherit"
                }}
              />
            </div>

            {preview && (
              <div style={{ marginBottom: "16px", position: "relative" }}>
                {file?.type.startsWith("video/") ? (
                  <video src={preview} controls style={{ width: "100%", borderRadius: "12px", maxHeight: "300px" }} />
                ) : (
                  <img src={preview} alt="preview" style={{ width: "100%", borderRadius: "12px", maxHeight: "300px", objectFit: "cover" }} />
                )}
                <button
                  onClick={() => { setPreview(null); setFile(null); fileRef.current.value = ""; }}
                  style={{
                    position: "absolute", top: "8px", right: "8px",
                    background: "rgba(0,0,0,0.6)", color: "white",
                    border: "none", borderRadius: "50%", width: "28px",
                    height: "28px", cursor: "pointer", fontSize: "14px"
                  }}
                >✕</button>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => fileRef.current.click()} style={btnGray}>📸 Photo</button>
                <button onClick={() => fileRef.current.click()} style={btnGray}>🎥 Video</button>
              </div>
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                style={{
                  background: file ? "#1d1d1f" : "#e5e5e5",
                  color: file ? "white" : "#6e6e73",
                  border: "none", padding: "10px 24px",
                  borderRadius: "10px", cursor: file ? "pointer" : "default",
                  fontWeight: "600", fontSize: "14px"
                }}
              >
                {uploading ? "Uploading..." : "Post"}
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFileChange} style={{ display: "none" }} />
          </div>
        ) : (
          <div style={{ background: "white", borderRadius: "20px", padding: "24px", marginBottom: "32px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <p style={{ color: "#6e6e73", marginBottom: "12px" }}>Login to share your trek photos and videos</p>
            <button onClick={() => navigate("/login")} style={btnDark}>Login to Post</button>
          </div>
        )}

        {/* Posts Feed */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <p style={{ color: "#6e6e73" }}>Loading feed...</p>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "20px" }}>
            <p style={{ fontSize: "48px" }}>📸</p>
            <h3 style={{ marginBottom: "8px" }}>No posts yet</h3>
            <p style={{ color: "#6e6e73" }}>Be the first to share your trek!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {posts.map((post) => (
              <div key={post.id} style={{ background: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>

                {/* Post Header */}
                <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #1e3a5f, #2d6a4f)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontWeight: "600", fontSize: "16px"
                  }}>
                    {post.user_name?.[0] || "👤"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: "600", margin: 0, fontSize: "15px" }}>{post.user_name}</p>
                    <p style={{ color: "#6e6e73", margin: 0, fontSize: "12px" }}>
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Follow button */}
                  {user && post.user_id !== user.id && (
                    <button
                      onClick={() => handleFollow(post.user_id)}
                      style={{
                        background: following[post.user_id] ? "#f5f5f7" : "#1d1d1f",
                        color: following[post.user_id] ? "#1d1d1f" : "white",
                        border: "none", padding: "6px 14px", borderRadius: "999px",
                        cursor: "pointer", fontSize: "13px", fontWeight: "600"
                      }}
                    >
                      {following[post.user_id] ? "Following ✓" : "Follow"}
                    </button>
                  )}

                  {/* Delete menu for own posts */}
                  {user && post.user_id === user.id && (
                    <div style={{ position: "relative" }}>
                      <button
                        onClick={() => setShowMenu((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "#6e6e73" }}
                      >⋯</button>
                      {showMenu[post.id] && (
                        <div style={{
                          position: "absolute", right: 0, top: "28px",
                          background: "white", borderRadius: "12px", padding: "8px",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.15)", zIndex: 100, minWidth: "140px"
                        }}>
                          <button
                            onClick={() => { handleDeletePost(post.id); setShowMenu({}); }}
                            style={{
                              width: "100%", background: "none", border: "none",
                              padding: "10px 12px", textAlign: "left", cursor: "pointer",
                              color: "#ef4444", fontSize: "14px", borderRadius: "8px"
                            }}
                          >🗑️ Delete Post</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Media */}
                {post.media_type === "video" ? (
                  <video src={post.media_url} controls style={{ width: "100%", maxHeight: "500px", background: "#000" }} />
                ) : (
                  <img src={post.media_url} alt={post.caption} style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }} />
                )}

                {/* Post Footer */}
                <div style={{ padding: "16px 20px" }}>
                  {post.caption && (
                    <p style={{ margin: "0 0 12px", fontSize: "15px", lineHeight: "1.5" }}>
                      <span style={{ fontWeight: "600" }}>{post.user_name}</span> {post.caption}
                    </p>
                  )}

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "12px" }}>
                    <button
                      onClick={() => handleLike(post.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", display: "flex", alignItems: "center", gap: "6px" }}
                    >
                      {likedPosts[post.id] ? "❤️" : "🤍"}
                      <span style={{ fontSize: "14px", color: "#6e6e73" }}>{post.likes}</span>
                    </button>
                    <button
                      onClick={() => toggleComments(post.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", display: "flex", alignItems: "center", gap: "6px" }}
                    >
                      💬
                      <span style={{ fontSize: "14px", color: "#6e6e73" }}>
                        {comments[post.id]?.length || 0}
                      </span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  {showComments[post.id] && (
                    <div style={{ borderTop: "1px solid #f5f5f7", paddingTop: "12px" }}>
                      <div style={{ marginBottom: "12px", maxHeight: "200px", overflowY: "auto" }}>
                        {(comments[post.id] || []).length === 0 ? (
                          <p style={{ color: "#6e6e73", fontSize: "14px" }}>No comments yet</p>
                        ) : (
                          (comments[post.id] || []).map((c) => (
                            <div key={c.id} style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <div>
                                <span style={{ fontWeight: "600", fontSize: "14px" }}>{c.user_name} </span>
                                <span style={{ fontSize: "14px", color: "#1d1d1f" }}>{c.content}</span>
                              </div>
                              {user && c.user_id === user.id && (
                                <button
                                  onClick={() => handleDeleteComment(post.id, c.id)}
                                  style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "12px", flexShrink: 0 }}
                                >🗑️</button>
                              )}
                            </div>
                          ))
                        )}
                      </div>

                      {user && (
                        <div style={{ display: "flex", gap: "8px" }}>
                          <input
                            placeholder="Add a comment..."
                            value={commentInputs[post.id] || ""}
                            onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyDown={(e) => e.key === "Enter" && handleComment(post.id)}
                            style={{
                              flex: 1, padding: "10px 14px", borderRadius: "999px",
                              border: "1px solid #e5e5e5", fontSize: "14px",
                              outline: "none", fontFamily: "inherit"
                            }}
                          />
                          <button
                            onClick={() => handleComment(post.id)}
                            style={{
                              background: "#1d1d1f", color: "white", border: "none",
                              padding: "10px 16px", borderRadius: "999px",
                              cursor: "pointer", fontSize: "14px", fontWeight: "500"
                            }}
                          >Post</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const btnGray = {
  background: "#f5f5f7", border: "none", padding: "8px 16px",
  borderRadius: "8px", cursor: "pointer", fontSize: "14px",
  fontWeight: "500", color: "#1d1d1f"
};

const btnDark = {
  background: "#1d1d1f", color: "white", border: "none",
  padding: "10px 24px", borderRadius: "10px", cursor: "pointer", fontWeight: "600"
};

export default Feed;