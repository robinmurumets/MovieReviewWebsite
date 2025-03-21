const express = require("express");
const { pool } = require("./db");
const { authenticateToken } = require("./auth");

const router = express.Router();

// Log every request to this router for debugging
router.use((req, res, next) => {
  console.log("[FavoritesRouter] Received request:", req.method, req.originalUrl);
  next();
});

router.get("/favorites", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  console.log("[FavoritesRouter] GET /favorites for user:", userId);
  try {
    const result = await pool.query(
      "SELECT * FROM favorites WHERE user_id = $1",
      [userId]
    );
    const favorites = result.rows.map((row) => row.movie_data);
    res.json(favorites);
  } catch (error) {
    console.error("[FavoritesRouter] Error fetching favorites:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/favorites", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const movie = req.body;
  console.log("[FavoritesRouter] POST /favorites for movie:", movie.id, "by user:", userId);
  try {
    const exists = await pool.query(
      "SELECT * FROM favorites WHERE user_id = $1 AND movie_data->>'id' = $2",
      [userId, String(movie.id)]
    );
    if (exists.rows.length > 0) {
      return res.status(400).json({ error: "Movie already favorited" });
    }
    const result = await pool.query(
      "INSERT INTO favorites (user_id, movie_data) VALUES ($1, $2) RETURNING *",
      [userId, movie]
    );
    res.status(201).json(result.rows[0].movie_data);
  } catch (error) {
    console.error("[FavoritesRouter] Error adding favorite:", error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/favorites/:movieId", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const movieId = req.params.movieId;
  console.log("[FavoritesRouter] DELETE /favorites/" + movieId + " for user:", userId);
  try {
    await pool.query(
      "DELETE FROM favorites WHERE user_id = $1 AND movie_data->>'id' = $2",
      [userId, movieId]
    );
    res.json({ message: "Favorite removed" });
  } catch (error) {
    console.error("[FavoritesRouter] Error removing favorite:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = { favoritesRouter: router };