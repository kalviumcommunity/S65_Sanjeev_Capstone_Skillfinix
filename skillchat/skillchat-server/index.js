const express = require("express");
const connectDB = require("./db.js");
const cors = require("cors");
const http = require("http");
const PORT = process.env.PORT || 5000;
const app = express();


app.get("/", (req, res) => {
  res.send("Hello World");
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
  connectDB().catch(err => console.error("Database connection error:", err));
});