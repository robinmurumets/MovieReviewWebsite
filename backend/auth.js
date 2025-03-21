// auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("./db");

const router = express.Router();

// Register endpoint with logging
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  console.log(`[REGISTER] Attempting registration for: ${email}`);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("[REGISTER] Password hashed successfully.");
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, hashedPassword]
    );
    console.log("[REGISTER] User registered successfully:", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("[REGISTER] Registration error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Login endpoint with logging
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(`[LOGIN] Attempting login for: ${email}`);
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      console.log("[LOGIN] User not found.");
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const user = result.rows[0];
    console.log("[LOGIN] User found, comparing passwords...");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("[LOGIN] Password does not match.");
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, "your_jwt_secret", { expiresIn: "1h" });
    console.log("[LOGIN] Login successful. Token generated.");
    res.json({ message: "Logged in successfully", token });
  } catch (error) {
    console.error("[LOGIN] Login error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Middleware to protect routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    console.log("[AUTH] No token provided.");
    return res.sendStatus(401);
  }
  
  jwt.verify(token, "your_jwt_secret", (err, user) => {
    if (err) {
      console.log("[AUTH] Token verification failed.");
      return res.sendStatus(403);
    }
    req.user = user;
    console.log("[AUTH] Token verified successfully.");
    next();
  });
}

module.exports = { authRouter: router, authenticateToken };
