// posts.js
const express = require("express");
const { pool } = require("./db");
const { authenticateToken } = require("./auth");

const router = express.Router();

// Get all posts with user email
router.get("/posts", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT posts.*, users.email 
      FROM posts 
      JOIN users ON posts.user_id = users.id 
      ORDER BY posts.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new post (requires authentication)
router.post("/posts", authenticateToken, async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id;
  try {
    const result = await pool.query(
      "INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *",
      [userId, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: error.message });
  }
});

// Add or update a reaction to a post (e.g., like/dislike)
router.post("/posts/:id/reactions", authenticateToken, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const { reaction } = req.body;
  try {
    const result = await pool.query(
      `
      INSERT INTO reactions (user_id, post_id, reaction)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, post_id) DO UPDATE 
      SET reaction = EXCLUDED.reaction
      RETURNING *
      `,
      [userId, postId, reaction]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error adding reaction:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get aggregated reactions for a post
router.get("/posts/:id/reactions", async (req, res) => {
  const postId = req.params.id;
  try {
    const result = await pool.query(
      "SELECT reaction, COUNT(*) AS count FROM reactions WHERE post_id = $1 GROUP BY reaction",
      [postId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching reactions:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = { postsRouter: router };
