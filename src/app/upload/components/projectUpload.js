"use client";

import { useState } from "react";
import { firestore } from "../../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ProjectUpload() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    languages: "",
    image: "",
    link: "",
    date: "",
    hasCode: false,
    github: "",
    hasDemo: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFileChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("");

    try {
      // Add to Firestore
      await addDoc(collection(firestore, "projects"), {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setSubmitStatus("success");
      setFormData({
        name: "",
        description: "",
        languages: "",
        image: "",
        link: "",
        date: "",
        hasCode: false,
        github: "",
        hasDemo: false,
      });
      setSelectedFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error adding project:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-800 to-zinc-950 rounded-3xl p-8 shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Add New Project</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Name */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Project Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#F5ECD5] transition-colors"
            placeholder="Enter project name"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#F5ECD5] transition-colors resize-vertical"
            placeholder="Describe your project"
          />
        </div>

        {/* Languages */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Technologies Used *
          </label>
          <input
            type="text"
            name="languages"
            value={formData.languages}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#F5ECD5] transition-colors"
            placeholder="e.g., React, Node.js, Python (comma-separated)"
          />
        </div>

        {/* Project Image Upload */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Project Image *
          </label>
          <div
            className={`w-full border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? "border-[#F5ECD5] bg-[#F5ECD5]/10"
                : "border-slate-600 hover:border-slate-500"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {imagePreview ? (
              <div className="space-y-4">
                <img
                  src={imagePreview}
                  alt="Project preview"
                  className="w-32 h-32 object-cover rounded-lg border border-slate-600 mx-auto"
                />
                <p className="text-white text-sm">Image uploaded successfully!</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setImagePreview(null);
                  }}
                  className="text-red-400 hover:text-red-300 text-sm underline"
                >
                  Remove image
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-slate-400">
                  <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-lg font-medium">Drop your image here</p>
                  <p className="text-sm">or click to browse</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="project-image-upload"
                />
                <label
                  htmlFor="project-image-upload"
                  className="inline-block bg-[#F5ECD5] text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-[#E6D4B8] transition-colors cursor-pointer"
                >
                  Choose Image
                </label>
              </div>
            )}
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Upload a project image. Recommended size: 400x300px. Supported formats: JPG, PNG, GIF
          </p>
        </div>

        {/* Demo Link */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Demo Link
          </label>
          <input
            type="url"
            name="link"
            value={formData.link}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#F5ECD5] transition-colors"
            placeholder="https://demo-link.com"
          />
        </div>

        {/* GitHub Link */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            GitHub Repository
          </label>
          <input
            type="url"
            name="github"
            value={formData.github}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#F5ECD5] transition-colors"
            placeholder="https://github.com/username/repo"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Project Date *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#F5ECD5] transition-colors"
          />
        </div>

        {/* Checkboxes */}
        <div className="flex space-x-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="hasDemo"
              checked={formData.hasDemo}
              onChange={handleInputChange}
              className="mr-2 text-[#F5ECD5] focus:ring-[#F5ECD5]"
            />
            <span className="text-white">Has Demo</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="hasCode"
              checked={formData.hasCode}
              onChange={handleInputChange}
              className="mr-2 text-[#F5ECD5] focus:ring-[#F5ECD5]"
            />
            <span className="text-white">Has Code</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#F5ECD5] text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-[#E6D4B8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Adding Project..." : "Add Project"}
        </button>

        {/* Status Message */}
        {submitStatus === "success" && (
          <div className="text-green-400 text-center">
            ✅ Project added successfully!
          </div>
        )}
        {submitStatus === "error" && (
          <div className="text-red-400 text-center">
            ❌ Error adding project. Please try again.
          </div>
        )}
      </form>
    </div>
  );
}
