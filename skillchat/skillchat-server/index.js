const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const connectDB = require("./db.js");
const { initSocket } = require("./sockets/socket");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB().catch(err => console.error("Database connection error:", err));

app.use("/user", require("./Routes/userRoutes.js"));
app.use("/message", require("./Routes/message_routes.js"));
app.use("/conversation", require("./Routes/conversation_routes.js"));

app.get("/", (req, res) => {
  res.send("Hello World from SkillChat Backend 🚀");
});

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});





