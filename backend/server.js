const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { initDB } = require("./db");
const { authRouter } = require("./auth");
const { postsRouter } = require("./posts");
const { favoritesRouter } = require("./favorites"); 

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api", authRouter);
app.use("/api", postsRouter);
app.use("/api", favoritesRouter);  

initDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
  });