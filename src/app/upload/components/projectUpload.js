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
    code: false,
    github: "",
    demo: false,
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
        code: false,
        github: "",
        demo: false,
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
    <div className="bg-white/25 dark:bg-black/25 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-white/30 dark:border-gray-700/30 transition-all duration-200">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center transition-colors duration-200">Add New Project</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-900 dark:text-white text-sm font-medium mb-2 transition-colors duration-200">
            Project Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 border border-white/30 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 focus:ring-2 focus:ring-white/20 dark:focus:ring-gray-500/20 transition-all duration-200"
            placeholder="Enter project name"
          />
        </div>

        <div>
          <label className="block text-gray-900 dark:text-white text-sm font-medium mb-2 transition-colors duration-200">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 border border-white/30 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 focus:ring-2 focus:ring-white/20 dark:focus:ring-gray-500/20 transition-all duration-200 resize-vertical"
            placeholder="Describe your project"
          />
        </div>

        <div>
          <label className="block text-gray-900 dark:text-white text-sm font-medium mb-2 transition-colors duration-200">
            Technologies Used *
          </label>
          <input
            type="text"
            name="languages"
            value={formData.languages}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 border border-white/30 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 focus:ring-2 focus:ring-white/20 dark:focus:ring-gray-500/20 transition-all duration-200"
            placeholder="e.g., React, Node.js, Python (comma-separated)"
          />
        </div>

        <div>
          <label className="block text-gray-900 dark:text-white text-sm font-medium mb-2 transition-colors duration-200">
            Project Image *
          </label>
          <div
            className={`w-full border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              isDragOver
                ? "border-gray-400 dark:border-gray-500 bg-white/30 dark:bg-black/30"
                : "border-white/50 dark:border-gray-600/50 hover:border-gray-300 dark:hover:border-gray-500"
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
                  className="w-32 h-32 object-cover rounded-lg border border-white/30 dark:border-gray-600/50 mx-auto"
                />
                <p className="text-gray-900 dark:text-white text-sm transition-colors duration-200">Image uploaded successfully!</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setImagePreview(null);
                  }}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm underline transition-colors duration-200"
                >
                  Remove image
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-gray-500 dark:text-gray-400 transition-colors duration-200">
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
                  className="inline-block bg-white/90 dark:bg-slate-700 text-gray-900 dark:text-white px-6 py-2 rounded-lg font-medium hover:bg-white dark:hover:bg-slate-600 shadow-lg transition-all duration-200 cursor-pointer"
                >
                  Choose Image
                </label>
              </div>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 transition-colors duration-200">
            Upload a project image. Recommended size: 400x300px. Supported formats: JPG, PNG, GIF
          </p>
        </div>

        <div>
          <label className="block text-gray-900 dark:text-white text-sm font-medium mb-2 transition-colors duration-200">
            Demo Link
          </label>
          <input
            type="url"
            name="link"
            value={formData.link}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 border border-white/30 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 focus:ring-2 focus:ring-white/20 dark:focus:ring-gray-500/20 transition-all duration-200"
            placeholder="https://demo-link.com"
          />
        </div>

        <div>
          <label className="block text-gray-900 dark:text-white text-sm font-medium mb-2 transition-colors duration-200">
            GitHub Repository
          </label>
          <input
            type="url"
            name="github"
            value={formData.github}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 border border-white/30 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 focus:ring-2 focus:ring-white/20 dark:focus:ring-gray-500/20 transition-all duration-200"
            placeholder="https://github.com/username/repo"
          />
        </div>

        <div>
          <label className="block text-gray-900 dark:text-white text-sm font-medium mb-2 transition-colors duration-200">
            Project Date *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 border border-white/30 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 focus:ring-2 focus:ring-white/20 dark:focus:ring-gray-500/20 transition-all duration-200"
          />
        </div>

        <div className="flex space-x-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="demo"
              checked={formData.demo}
              onChange={handleInputChange}
              className="mr-2 accent-gray-600 dark:accent-gray-400"
            />
            <span className="text-gray-900 dark:text-white transition-colors duration-200">Demo</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="code"
              checked={formData.code}
              onChange={handleInputChange}
              className="mr-2 accent-gray-600 dark:accent-gray-400"
            />
            <span className="text-gray-900 dark:text-white transition-colors duration-200">Code</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white/90 dark:bg-slate-700 text-gray-900 dark:text-white py-3 px-6 rounded-lg font-semibold hover:bg-white dark:hover:bg-slate-600 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Adding Project..." : "Add Project"}
        </button>

        {submitStatus === "success" && (
          <div className="text-green-600 dark:text-green-400 text-center transition-colors duration-200">
            ✅ Project added successfully!
          </div>
        )}
        {submitStatus === "error" && (
          <div className="text-red-600 dark:text-red-400 text-center transition-colors duration-200">
            ❌ Error adding project. Please try again.
          </div>
        )}
      </form>
    </div>
  );
}
