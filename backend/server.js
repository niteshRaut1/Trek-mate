const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();
const fetch = require("node-fetch");

const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

console.log("✅ Supabase Connected");

app.get("/", (req, res) => {
  res.send("TrekMate Backend Running 🚀");
});

// Get all treks
app.get("/api/treks", async (req, res) => {
  const { data, error } = await supabase.from("treks").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Get single trek
app.get("/api/treks/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("treks")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Add a trek
app.post("/api/treks", async (req, res) => {
  const { name, location, difficulty, duration_days, description } = req.body;
  const { data, error } = await supabase
    .from("treks")
    .insert([{ name, location, difficulty, duration_days, description }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Get all groups
app.get("/api/groups", async (req, res) => {
  const { data, error } = await supabase.from("groups").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Get groups for a specific trek
app.get("/api/groups/trek/:trek_id", async (req, res) => {
  const { trek_id } = req.params;
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .eq("trek_id", trek_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Create a group
app.post("/api/groups", async (req, res) => {
  const { trek_id, name, description, max_members, created_by } = req.body;
  const { data, error } = await supabase
    .from("groups")
    .insert([{ trek_id, name, description, max_members, created_by }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Get profile
app.get("/api/profiles/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Create or update profile
app.post("/api/profiles", async (req, res) => {
  const { id, full_name, bio, location, experience, treks_completed } = req.body;
  const { data, error } = await supabase
    .from("profiles")
    .upsert([{ id, full_name, bio, location, experience, treks_completed }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Get comments for a trek
app.get("/api/comments/:trek_id", async (req, res) => {
  const { trek_id } = req.params;
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("trek_id", trek_id)
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Add a comment
app.post("/api/comments", async (req, res) => {
  const { trek_id, user_id, user_name, content } = req.body;
  const { data, error } = await supabase
    .from("comments")
    .insert([{ trek_id, user_id, user_name, content }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Get photos for a trek
app.get("/api/photos/:trek_id", async (req, res) => {
  const { trek_id } = req.params;
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("trek_id", trek_id)
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Add a photo
app.post("/api/photos", async (req, res) => {
  const { trek_id, user_id, user_name, photo_url, caption } = req.body;
  const { data, error } = await supabase
    .from("photos")
    .insert([{ trek_id, user_id, user_name, photo_url, caption, likes: 0 }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Like a photo
app.post("/api/photos/:id/like", async (req, res) => {
  const { id } = req.params;
  const { data: photo } = await supabase
    .from("photos")
    .select("likes")
    .eq("id", id)
    .single();
  const { data, error } = await supabase
    .from("photos")
    .update({ likes: (photo?.likes || 0) + 1 })
    .eq("id", id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});
// Get all feed posts
app.get("/api/feed", async (req, res) => {
  const { data, error } = await supabase
    .from("feed")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Create a feed post
app.post("/api/feed", async (req, res) => {
  const { user_id, user_name, media_url, media_type, caption } = req.body;
  console.log("📸 New post:", { user_id, user_name, media_url, media_type, caption });
  const { data, error } = await supabase
    .from("feed")
    .insert([{ user_id, user_name, media_url, media_type, caption, likes: 0 }])
    .select();
  if (error) {
    console.log("❌ Feed error:", error.message);
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

// Like a feed post
app.post("/api/feed/:id/like", async (req, res) => {
  const { id } = req.params;
  const { data: post } = await supabase
    .from("feed")
    .select("likes")
    .eq("id", id)
    .single();
  const { data, error } = await supabase
    .from("feed")
    .update({ likes: (post?.likes || 0) + 1 })
    .eq("id", id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});
// Check if user liked a post
app.get("/api/feed/:id/liked/:user_id", async (req, res) => {
  const { id, user_id } = req.params;
  const { data, error } = await supabase
    .from("user_likes")
    .select("*")
    .eq("post_id", id)
    .eq("user_id", user_id)
    .single();
  if (error) return res.json({ liked: false });
  res.json({ liked: !!data });
});

// Toggle like
app.post("/api/feed/:id/like", async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  const { data: existing } = await supabase
    .from("user_likes")
    .select("*")
    .eq("post_id", id)
    .eq("user_id", user_id)
    .single();

  const { data: post } = await supabase
    .from("feed")
    .select("likes")
    .eq("id", id)
    .single();

  if (existing) {
    await supabase.from("user_likes").delete().eq("post_id", id).eq("user_id", user_id);
    const { data, error } = await supabase
      .from("feed")
      .update({ likes: Math.max((post?.likes || 1) - 1, 0) })
      .eq("id", id)
      .select();
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ liked: false, data });
  } else {
    await supabase.from("user_likes").insert([{ post_id: id, user_id }]);
    const { data, error } = await supabase
      .from("feed")
      .update({ likes: (post?.likes || 0) + 1 })
      .eq("id", id)
      .select();
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ liked: true, data });
  }
});

// Get comments for a post
app.get("/api/feed/:id/comments", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("feed_comments")
    .select("*")
    .eq("post_id", id)
    .order("created_at", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Add comment to a post
app.post("/api/feed/:id/comments", async (req, res) => {
  const { id } = req.params;
  const { user_id, user_name, content } = req.body;
  const { data, error } = await supabase
    .from("feed_comments")
    .insert([{ post_id: id, user_id, user_name, content }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});
// Get health profile
app.get("/api/health-profile/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const { data, error } = await supabase
    .from("health_profiles")
    .select("*")
    .eq("user_id", user_id)
    .single();
  if (error) return res.json(null);
  res.json(data);
});

// Save/update health profile
app.post("/api/health-profile", async (req, res) => {
  const { user_id, fitness_level, medical_conditions, medications, emergency_contact_name, emergency_contact_phone, blood_type } = req.body;

  const { data: existing } = await supabase
    .from("health_profiles")
    .select("id")
    .eq("user_id", user_id)
    .single();

  let result;
  if (existing) {
    result = await supabase
      .from("health_profiles")
      .update({ fitness_level, medical_conditions, medications, emergency_contact_name, emergency_contact_phone, blood_type })
      .eq("user_id", user_id)
      .select();
  } else {
    result = await supabase
      .from("health_profiles")
      .insert([{ user_id, fitness_level, medical_conditions, medications, emergency_contact_name, emergency_contact_phone, blood_type }])
      .select();
  }

  if (result.error) return res.status(500).json({ error: result.error.message });
  res.json(result.data);
});

// Get checkins for a user
app.get("/api/health-checkins/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const { data, error } = await supabase
    .from("health_checkins")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Create a checkin
app.post("/api/health-checkins", async (req, res) => {
  const { user_id, trek_id, altitude_m, symptoms, severity, notes, status } = req.body;
  const { data, error } = await supabase
    .from("health_checkins")
    .insert([{ user_id, trek_id, altitude_m, symptoms, severity, notes, status }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});
// Get weather for a location
app.get("/api/weather/:lat/:lon", async (req, res) => {
  const { lat, lon } = req.params;
  const apiKey = process.env.WEATHER_API_KEY;
  
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();
    
    if (data.cod !== 200) {
      return res.status(400).json({ error: "Weather data not found" });
    }

    res.json({
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      wind_speed: data.wind.speed,
      visibility: data.visibility / 1000,
      location: data.name
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch weather" });
  }
});
// Get notifications for a user
app.get("/api/notifications/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Mark notification as read
app.post("/api/notifications/:id/read", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Mark all notifications as read
app.post("/api/notifications/read-all/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user_id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Create a notification
app.post("/api/notifications", async (req, res) => {
  const { user_id, type, message, link } = req.body;
  const { data, error } = await supabase
    .from("notifications")
    .insert([{ user_id, type, message, link }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});
// Delete a feed post
app.delete("/api/feed/:id", async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  const { data, error } = await supabase
    .from("feed")
    .delete()
    .eq("id", id)
    .eq("user_id", user_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Delete a comment
app.delete("/api/feed/:id/comments/:comment_id", async (req, res) => {
  const { comment_id } = req.params;
  const { user_id } = req.body;
  const { data, error } = await supabase
    .from("feed_comments")
    .delete()
    .eq("id", comment_id)
    .eq("user_id", user_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Follow a user
app.post("/api/follow", async (req, res) => {
  const { follower_id, following_id } = req.body;
  const { data, error } = await supabase
    .from("followers")
    .insert([{ follower_id, following_id }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Unfollow a user
app.delete("/api/follow", async (req, res) => {
  const { follower_id, following_id } = req.body;
  const { data, error } = await supabase
    .from("followers")
    .delete()
    .eq("follower_id", follower_id)
    .eq("following_id", following_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Check if following
app.get("/api/follow/:follower_id/:following_id", async (req, res) => {
  const { follower_id, following_id } = req.params;
  const { data, error } = await supabase
    .from("followers")
    .select("*")
    .eq("follower_id", follower_id)
    .eq("following_id", following_id)
    .single();
  if (error) return res.json({ following: false });
  res.json({ following: !!data });
});

// Get followers count
app.get("/api/followers/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const { data: followers } = await supabase
    .from("followers")
    .select("*")
    .eq("following_id", user_id);
  const { data: following } = await supabase
    .from("followers")
    .select("*")
    .eq("follower_id", user_id);
  res.json({
    followers: followers?.length || 0,
    following: following?.length || 0
  });
});
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});