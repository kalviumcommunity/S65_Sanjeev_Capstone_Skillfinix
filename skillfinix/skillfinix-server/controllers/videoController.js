const Video = require("../models/Video");
const cloudinary = require("cloudinary").v2;
const AppError = require("../utils/errorHandler");
const fs = require("fs");

exports.uploadVideo = async (req, res, next) => {
  console.log("Upload endpoint hit"); 
  console.log("Request body:", req.body);
  console.log("Request file:", req.file);
  try {
    console.log("Upload request received:", {
      file: req.file ? "File present" : "No file",
      body: req.body,
      user: req.user ? req.user.id : "No user",
    });

    // Check if file is uploaded
    if (!req.file) {
      return next(new AppError("Please upload a video file", 400));
    }

    // Check if user is authenticated (adjust based on your auth middleware)
    if (!req.user || !req.user.id) {
      return next(new AppError("Authentication required", 401));
    }

    // Validate required fields
    if (!req.body.title || !req.body.skill) {
      return next(new AppError("Title and skill are required", 400));
    }

    console.log("Uploading to Cloudinary...");

    // Upload video to Cloudinary
    const videoUpload = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "skillfinix/videos",
      use_filename: true,
      unique_filename: false,
    });

    console.log("Cloudinary upload successful:", videoUpload.public_id);

    // Clean up local file after upload
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // Create video in database
    const newVideo = await Video.create({
      title: req.body.title.trim(),
      description: req.body.description ? req.body.description.trim() : "",
      url: videoUpload.secure_url,
      thumbnail: videoUpload.secure_url.replace(/\.[^/.]+$/, ".jpg"), // Auto-generate thumbnail URL
      duration: videoUpload.duration || 0,
      skill: req.body.skill.trim(),
      createdBy: req.user.id,
    });

    console.log("Video saved to database:", newVideo._id);

    res.status(201).json({
      status: "success",
      message: "Video uploaded successfully",
      data: {
        video: newVideo,
      },
    });
  } catch (err) {
    console.error("Upload error:", err);

    // Clean up local file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // Handle specific Cloudinary errors
    if (err.message && err.message.includes("Invalid video file")) {
      return next(new AppError("Invalid video file format", 400));
    }

    if (err.message && err.message.includes("File size too large")) {
      return next(
        new AppError("File size too large. Maximum size is 100MB", 400)
      );
    }

    next(new AppError("Video upload failed. Please try again.", 500));
  }
};

exports.getAllVideos = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const videos = await Video.find()
      .populate("createdBy", "name avatar")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    const total = await Video.countDocuments();

    res.status(200).json({
      status: "success",
      results: videos.length,
      totalVideos: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      data: {
        videos,
      },
    });
  } catch (err) {
    console.error("Get videos error:", err);
    next(new AppError("Failed to fetch videos", 500));
  }
};

exports.getVideosBySkill = async (req, res, next) => {
  try {
    const { skill } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!skill) {
      return next(new AppError("Skill parameter is required", 400));
    }

    const videos = await Video.find({
      skill: { $regex: new RegExp(skill, "i") }, // Case-insensitive search
    })
      .populate("createdBy", "name avatar")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    const total = await Video.countDocuments({
      skill: { $regex: new RegExp(skill, "i") },
    });

    res.status(200).json({
      status: "success",
      results: videos.length,
      totalVideos: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      data: {
        videos,
      },
    });
  } catch (err) {
    console.error("Get videos by skill error:", err);
    next(new AppError("Failed to fetch videos by skill", 500));
  }
};

exports.getVideoById = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id).populate(
      "createdBy",
      "name avatar"
    );

    if (!video) {
      return next(new AppError("Video not found", 404));
    }

    // Increment view count
    video.views += 1;
    await video.save();

    res.status(200).json({
      status: "success",
      data: {
        video,
      },
    });
  } catch (err) {
    console.error("Get video by ID error:", err);
    next(new AppError("Failed to fetch video", 500));
  }
};

exports.deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return next(new AppError("Video not found", 404));
    }

    // Check if user owns the video
    if (video.createdBy.toString() !== req.user.id) {
      return next(new AppError("You can only delete your own videos", 403));
    }

    // Delete from Cloudinary
    const publicId = video.url.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`skillfinix/videos/${publicId}`, {
      resource_type: "video",
    });

    // Delete from database
    await Video.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    console.error("Delete video error:", err);
    next(new AppError("Failed to delete video", 500));
  }
};
