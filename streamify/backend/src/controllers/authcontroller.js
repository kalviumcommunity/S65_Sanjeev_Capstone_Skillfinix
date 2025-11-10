const { upsertStreamUser } = require("../lib/stream.js");
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


    try {
      await upsertStreamUser ({
      id: newUser._id.toString(),
      name: newUser.fullName,
      image: newUser.profilePic || "", 
    });

    console.log(`Stream user cretaed for ${newUser.fullName}`);
    } catch (error) {
      console.error("Error creating Stream user:", error);
    }

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
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true, // prevent xss attacks
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // prevents csfr attacks
    });

    res.status(200).json({ success: true, user });
  } 
  
  catch (error) {
    console.error("Error in login controller", error);
    res.status(500).json({ message: "Internal server error during login" });
  }
};

const logout = async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

const onboard = async (req, res)=>{
  try {
    const userId =  req.user._id;
    const { fullName, bio, location } = req.body;

    if(!fullName || !bio || !location){
      return res.status(400).json({
        message:"All fields are required for onboarding",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !location && "location"
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(userId,{
      ...req.body,
      isOnboarded: true
    }, { new: true }); 

    if (!updatedUser){
      return res.status(404).json({ message: "User not found" });
    }

    try {
      await upsertStreamUser ({
      id: updatedUser._id.toString(),
      name: updatedUser.fullName,
      image: updatedUser.profilePic || "",
    });
    
    console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
      
    } catch (streamError) {
      console.error("Error updating Stream user during onboarding:", streamError.message);
    }


    res.status(200).json({ success: true, user: updatedUser });

  } catch (error) {
    console.error("Error in onboarding controller", error);
    res.status(500).json({ message: "Internal server error during onboarding" });
  }
}


module.exports = { signup, login, logout, onboard };
