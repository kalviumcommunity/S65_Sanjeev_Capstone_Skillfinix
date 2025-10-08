import React, { useState } from "react";
import axios from "axios";
import { Upload, Video, X, Check, AlertCircle } from "react-feather";

const VideoUploadForm = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(""); // 'success', 'error', or ''
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skill: "",
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ["video/mp4", "video/mov", "video/avi", "video/wmv"];
      if (!allowedTypes.includes(selectedFile.type)) {
        setErrorMessage(
          "Please select a valid video file (MP4, MOV, AVI, WMV)"
        );
        return;
      }

      // Validate file size (100MB)
      if (selectedFile.size > 100 * 1024 * 1024) {
        setErrorMessage("File size must be less than 100MB");
        return;
      }

      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setErrorMessage("");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMessage(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!file) {
      setErrorMessage("Please select a video file");
      return;
    }

    if (!formData.title.trim()) {
      setErrorMessage("Please enter a title");
      return;
    }

    if (!formData.skill.trim()) {
      setErrorMessage("Please enter a skill category");
      return;
    }

    const data = new FormData();
    data.append("video", file);
    data.append("title", formData.title.trim());
    data.append("description", formData.description.trim());
    data.append("skill", formData.skill.trim());

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadStatus("");
      setErrorMessage("");

      // Get token from localStorage (you might need to adjust this based on your auth implementation)
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      const headers = {
        "Content-Type": "multipart/form-data",
      };

      // Only add Authorization header if token exists
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/videos`, // Use environment variable for base URL
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      if (res.data.status === "success") {
        setUploadStatus("success");
        // Reset form after successful upload
        setTimeout(() => {
          setFile(null);
          setPreview("");
          setFormData({
            title: "",
            description: "",
            skill: "",
          });
          setUploadProgress(0);
          setUploadStatus("");
        }, 2000);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadStatus("error");

      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        const errorMsg =
          err.response.data?.message ||
          err.response.data?.error ||
          `Upload failed: ${err.response.status}`;
        setErrorMessage(errorMsg);
      } else if (err.request) {
        // Request was made but no response received
        setErrorMessage(
          "Network error. Please check your connection and try again."
        );
      } else {
        // Something else happened
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreview("");
    setFormData({
      title: "",
      description: "",
      skill: "",
    });
    setUploadProgress(0);
    setUploadStatus("");
    setErrorMessage("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Upload Video Tutorial</h2>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-3 border border-red-300 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="text-sm">{errorMessage}</span>
        </div>
      )}

      {/* Success Message */}
      {uploadStatus === "success" && (
        <div className="mb-4 p-3 border border-green-300 bg-green-50 text-green-700 rounded-md flex items-center">
          <Check className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="text-sm">Video uploaded successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Video File <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {preview ? (
                <div className="relative">
                  <video
                    src={preview}
                    controls
                    className="max-h-64 mx-auto rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPreview("");
                      setErrorMessage("");
                    }}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ) : (
                <>
                  <Video className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept="video/mp4,video/mov,video/avi,video/wmv"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    MP4, MOV, AVI, WMV up to 100MB
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter video title"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Describe what viewers will learn..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skill Category <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="skill"
            value={formData.skill}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., JavaScript, React, UI Design"
            required
          />
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">
                Uploading...
              </span>
              <span className="text-sm text-gray-500">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={resetForm}
            disabled={isUploading}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={
              isUploading ||
              !file ||
              !formData.title.trim() ||
              !formData.skill.trim()
            }
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading... {uploadProgress}%
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Video
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VideoUploadForm;
