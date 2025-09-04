"use client";

import { useState } from "react";
import { firestore } from "../../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function BlogUpload() {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    slug: "",
    published: false,
    publishedAt: "",
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

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
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
      // Prepare data for Firestore
      const blogData = {
        ...formData,
        updatedAt: serverTimestamp(),
      };

      // Add publishedAt timestamp if published
      if (formData.published && formData.publishedAt) {
        blogData.publishedAt = new Date(formData.publishedAt);
      }

      // Add to Firestore
      await addDoc(collection(firestore, "blogs"), blogData);

      setSubmitStatus("success");
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        slug: "",
        published: false,
        publishedAt: "",
      });
      setSelectedFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error adding blog:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-800 to-zinc-950 rounded-3xl p-8 shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Add New Blog Post</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleTitleChange}
            required
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#F5ECD5] transition-colors"
            placeholder="Enter blog post title"
          />
        </div>

        {/* Slug (auto-generated) */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Slug (auto-generated)
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-gray-300 focus:outline-none focus:border-[#F5ECD5] transition-colors"
            placeholder="Auto-generated from title"
          />
          <p className="text-gray-400 text-sm mt-1">
            This will be used for the image filename: {formData.slug}.jpg
          </p>
        </div>

        {/* Thumbnail Upload */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Thumbnail Image *
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
                  alt="Blog thumbnail preview"
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
                  id="blog-image-upload"
                />
                <label
                  htmlFor="blog-image-upload"
                  className="inline-block bg-[#F5ECD5] text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-[#E6D4B8] transition-colors cursor-pointer"
                >
                  Choose Image
                </label>
              </div>
            )}
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Upload a thumbnail image for your blog post. Recommended size: 400x300px. Supported formats: JPG, PNG, GIF
          </p>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Excerpt *
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            required
            rows={3}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#F5ECD5] transition-colors resize-vertical"
            placeholder="Brief description of your blog post"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Content *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            rows={10}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#F5ECD5] transition-colors resize-vertical"
            placeholder="Write your blog post content here..."
          />
          <p className="text-gray-400 text-sm mt-1">
            Use line breaks to separate paragraphs. Each line will be rendered as a separate paragraph.
          </p>
        </div>

        {/* Published Checkbox */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleInputChange}
              className="mr-2 text-[#F5ECD5] focus:ring-[#F5ECD5]"
            />
            <span className="text-white">Publish immediately</span>
          </label>
        </div>

        {/* Published Date (only show if published) */}
        {formData.published && (
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Published Date & Time *
            </label>
            <input
              type="datetime-local"
              name="publishedAt"
              value={formData.publishedAt}
              onChange={handleInputChange}
              required={formData.published}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#F5ECD5] transition-colors"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#F5ECD5] text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-[#E6D4B8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Adding Blog Post..." : "Add Blog Post"}
        </button>

        {/* Status Message */}
        {submitStatus === "success" && (
          <div className="text-green-400 text-center">
            ✅ Blog post added successfully!
          </div>
        )}
        {submitStatus === "error" && (
          <div className="text-red-400 text-center">
            ❌ Error adding blog post. Please try again.
          </div>
        )}
      </form>
    </div>
  );
}
