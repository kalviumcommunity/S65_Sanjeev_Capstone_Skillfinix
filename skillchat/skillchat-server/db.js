const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not defined in environment variables");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "SkillChat-chatapp",
    });

    console.log(
      `MongoDB connected: ${conn.connection.host} / DB: ${conn.connection.name}`
    );
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.log("🔁 Retrying connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
