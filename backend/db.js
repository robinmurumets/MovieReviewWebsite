const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "WAD",
  database: "Movie-Website",
  host: "localhost",
  port: 5432
});

async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `);
    console.log("Users table ready.");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Posts table ready.");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS reactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        post_id INTEGER REFERENCES posts(id),
        reaction VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, post_id)
      )
    `);
    console.log("Reactions table ready.");
  } catch (err) {
    console.error("Error initializing database:", err);
    throw err;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS favorites (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      movie_data JSONB NOT NULL
    )
  `);
  console.log("Favorites table ready.");
  
  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS favorites_unique_index 
    ON favorites (user_id, (movie_data->>'id'))
  `);
  console.log("Unique index on favorites created.");
}

module.exports = { pool, initDB };
