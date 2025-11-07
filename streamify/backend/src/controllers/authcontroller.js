const User = require("../models/User.js");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists, please use a different one" });
    }

    const idx = Math.floor(Math.random() * 100) + 1; // generate random number between 1 and 100
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      fullName,
      email,
      password,
      profilePic: randomAvatar,
    });

    // TODO: CREATE THE USER IN STREAM AS WELL
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true, // prevent xss attacks
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // prevents csfr attacks
    });

    res.status(201).json({ success: true, user: newUser });

  } catch (error) {
    console.error("Error in signup controller", error);
    res.status(500).json({ message: "Internal server error during signup" });
  }
};

const login = async (req, res) => {
  res.send("Login Route");
};

const logout = async (req, res) => {
  res.send("Logout Route");
};

module.exports = { signup, login, logout };
