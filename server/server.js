const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const skillRoutes = require("./routes/skillRoutes");
const exchangeRoutes = require("./routes/exchangeRoutes");
const errorHandler = require("./middlewares/error");
const connectDB = require("./config/db");
const messageRoutes = require('./routes/messageRoutes')
const ratingRoutes = require('./routes/ratingRoutes')


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/exchanges", exchangeRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/ratings', ratingRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    msg: 'Endpoint not found'
  });
});


app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});