// Background Image Upload Component
"use client";

import { useState } from "react";
import { pullPhotoMetadata } from "../../utils/pullPhotoMetadata";

const BackgroundUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isExtractingMetadata, setIsExtractingMetadata] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationName, setLocationName] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = async (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setUploadStatus("");
      
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
      
      // Auto-generate title from filename
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      const cleanTitle = nameWithoutExt
        .replace(/[_-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      setTitle(cleanTitle || 'Background Image');
      setDescription(`Background image - ${file.name}`);

      // Extract EXIF metadata
      try {
        setIsExtractingMetadata(true);
        setUploadStatus("Extracting photo metadata...");
        
        const metadata = await pullPhotoMetadata(file);
        
        // Populate location fields if available
        if (metadata.latitude) {
          setLatitude(metadata.latitude);
        }
        if (metadata.longitude) {
          setLongitude(metadata.longitude);
        }
        if (metadata.locationName) {
          setLocationName(metadata.locationName);
        }

        // Show success message with extracted data
        const extractedInfo = [];
        if (metadata.camera) extractedInfo.push(`Camera: ${metadata.camera}`);
        if (metadata.dateTaken) extractedInfo.push(`Date: ${metadata.dateTaken}`);
        if (metadata.latitude && metadata.longitude) {
          extractedInfo.push(`Location: ${metadata.latitude}, ${metadata.longitude}`);
        }
        
        if (extractedInfo.length > 0) {
          setUploadStatus(`Success: ${extractedInfo.join(' | ')}`);
        } else {
          setUploadStatus("Success: Image loaded (no EXIF data found)");
        }
      } catch (error) {
        console.warn('Error extracting metadata:', error);
        setUploadStatus("Warning: Image loaded (metadata extraction failed)");
      } finally {
        setIsExtractingMetadata(false);
      }
    } else {
      setUploadStatus("Please select a valid image file.");
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleFileChange(file);
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
    
    if (!selectedFile || !title.trim()) {
      setUploadStatus("Please select a file and enter a title.");
      return;
    }

    setIsUploading(true);
    setUploadStatus("Uploading background image...");

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      
      // Add location metadata if provided
      if (latitude.trim()) formData.append('latitude', latitude.trim());
      if (longitude.trim()) formData.append('longitude', longitude.trim());
      if (locationName.trim()) formData.append('location_name', locationName.trim());

      const response = await fetch('https://travel-image-api-189526192204.us-central1.run.app/api/v1/images/upload', {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        let imageId = 'Unknown';
        if (result && typeof result === 'object') {
          imageId = result.id || result.imageId || result.image_id || result.ID || 'Unknown';
        }
        
        setUploadStatus(`Success: Background image uploaded successfully! ID: ${imageId}`);
        setSelectedFile(null);
        setPreview(null);
        setTitle("");
        setDescription("");
        setLatitude("");
        setLongitude("");
        setLocationName("");
      } else {
        const errorText = await response.text();
        try {
          const error = JSON.parse(errorText);
          setUploadStatus(`Error: Upload failed: ${error.message || error.error || 'Unknown error'}`);
        } catch {
          setUploadStatus(`Error: Upload failed: HTTP ${response.status} - ${response.statusText}`);
        }
      }
    } catch (error) {
      setUploadStatus(`Error: Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg p-8 shadow-lg border border-slate-700">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-[#F5ECD5] mb-6 text-center">
          Upload Background Image
        </h2>

        <form onSubmit={handleSubmit}>
          {/* File Upload Section */}
          <div className="mb-6">
            <label className="block text-[#FFFAEC] text-sm font-medium mb-2">
              Select Image
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
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="background-upload"
              />
              <label
                htmlFor="background-upload"
                className="cursor-pointer block"
              >
                {preview ? (
                  <div className="space-y-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-slate-600 mx-auto"
                    />
                    <p className="text-[#F5ECD5] font-medium">
                      {selectedFile?.name}
                    </p>
                    {isExtractingMetadata && (
                      <div className="flex items-center justify-center space-x-2 text-[#F5ECD5] text-sm">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#F5ECD5]"></div>
                        <span>Extracting metadata...</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreview(null);
                        setTitle("");
                        setDescription("");
                        setLatitude("");
                        setLongitude("");
                        setLocationName("");
                        setUploadStatus("");
                      }}
                      className="text-red-400 hover:text-red-300 text-sm underline"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <svg
                      className="mx-auto h-12 w-12 text-slate-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="text-[#FFFAEC]">
                      {isDragOver ? "Drop image here" : "Drag & drop or click to select"}
                    </p>
                    <p className="text-slate-400 text-sm">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Image Details */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-[#FFFAEC] text-sm font-medium mb-2">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter image title"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-[#FFFAEC] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5ECD5] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-[#FFFAEC] text-sm font-medium mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter image description"
                rows={3}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-[#FFFAEC] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5ECD5] focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Location Metadata */}
          <div className="mb-6">
            <h3 className="text-[#F5ECD5] font-semibold mb-4">Location Metadata (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#FFFAEC] text-sm font-medium mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="e.g., 37.7749"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-[#FFFAEC] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5ECD5] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-[#FFFAEC] text-sm font-medium mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="e.g., -122.4194"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-[#FFFAEC] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5ECD5] focus:border-transparent"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-[#FFFAEC] text-sm font-medium mb-2">
                Location Name
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g., San Francisco, CA"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-[#FFFAEC] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5ECD5] focus:border-transparent"
              />
            </div>
          </div>

          {/* Upload Button */}
          <div className="text-center mb-6">
            <button
              type="submit"
              disabled={isUploading || isExtractingMetadata || !selectedFile || !title.trim()}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                isUploading || isExtractingMetadata || !selectedFile || !title.trim()
                  ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                  : "bg-[#F5ECD5] text-gray-900 hover:bg-[#E6D4B8] shadow-lg hover:shadow-xl"
              }`}
            >
              {isUploading ? "Uploading..." : isExtractingMetadata ? "Extracting..." : "Upload Background Image"}
            </button>
          </div>
        </form>

        {/* Status Message */}
        {uploadStatus && (
          <div className={`p-4 rounded-lg text-center font-medium ${
            uploadStatus.includes("Success") 
              ? "bg-green-900/30 text-green-300 border border-green-700"
              : uploadStatus.includes("Error")
              ? "bg-red-900/30 text-red-300 border border-red-700"
              : "bg-blue-900/30 text-blue-300 border border-blue-700"
          }`}>
            {uploadStatus}
          </div>
        )}
      </div>
    </div>
  );
};

export default BackgroundUpload;