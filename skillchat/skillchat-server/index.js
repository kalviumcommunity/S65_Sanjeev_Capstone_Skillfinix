const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const connectDB = require("./db.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB().catch(err => console.error("Database connection error:", err));

app.use("/api/user", require("./Routes/userRoute.js"));
app.use("/api/conversation", require("./Routes/conversation_routes.js"));

app.get("/", (req, res) => {
  res.send("Hello World from SkillChat Backend 🚀");
});

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
