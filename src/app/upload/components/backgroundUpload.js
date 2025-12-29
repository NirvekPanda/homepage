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

      try {
        setIsExtractingMetadata(true);
        setUploadStatus("Extracting photo metadata...");
        
        const metadata = await pullPhotoMetadata(file);
        
        if (metadata.latitude) {
          setLatitude(metadata.latitude);
        }
        if (metadata.longitude) {
          setLongitude(metadata.longitude);
        }
        if (metadata.locationName) {
          setLocationName(metadata.locationName);
        }

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
    <div className="bg-white/25 dark:bg-black/25 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-white/30 dark:border-gray-700/30 transition-all duration-200">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center transition-colors duration-200">
          Upload Background Image
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-900 dark:text-white text-sm font-medium mb-2 transition-colors duration-200">
              Select Image
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
                      className="w-32 h-32 object-cover rounded-lg border border-white/30 dark:border-gray-600/50 mx-auto"
                    />
                    <p className="text-gray-900 dark:text-white font-medium transition-colors duration-200">
                      {selectedFile?.name}
                    </p>
                    {isExtractingMetadata && (
                      <div className="flex items-center justify-center space-x-2 text-gray-700 dark:text-gray-300 text-sm transition-colors duration-200">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 dark:border-gray-300"></div>
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
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm underline transition-colors duration-200"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-500 dark:text-gray-400 transition-colors duration-200"
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
                    <p className="text-gray-900 dark:text-white transition-colors duration-200">
                      {isDragOver ? "Drop image here" : "Drag & drop or click to select"}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-gray-900 dark:text-white text-sm font-medium mb-2 transition-colors duration-200">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter image title"
                className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 border border-white/30 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 focus:ring-2 focus:ring-white/20 dark:focus:ring-gray-500/20 transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-gray-900 dark:text-white text-sm font-medium mb-2 transition-colors duration-200">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter image description"
                rows={3}
                className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 border border-white/30 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 focus:ring-2 focus:ring-white/20 dark:focus:ring-gray-500/20 transition-all duration-200 resize-none"
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4 transition-colors duration-200">Location Metadata (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-900 dark:text-white text-sm font-medium mb-2 transition-colors duration-200">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="e.g., 37.7749"
                  className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 border border-white/30 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 focus:ring-2 focus:ring-white/20 dark:focus:ring-gray-500/20 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-gray-900 dark:text-white text-sm font-medium mb-2 transition-colors duration-200">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="e.g., -122.4194"
                  className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 border border-white/30 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 focus:ring-2 focus:ring-white/20 dark:focus:ring-gray-500/20 transition-all duration-200"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-gray-900 dark:text-white text-sm font-medium mb-2 transition-colors duration-200">
                Location Name
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g., San Francisco, CA"
                className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 border border-white/30 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 focus:ring-2 focus:ring-white/20 dark:focus:ring-gray-500/20 transition-all duration-200"
              />
            </div>
          </div>

          <div className="text-center mb-6">
            <button
              type="submit"
              disabled={isUploading || isExtractingMetadata || !selectedFile || !title.trim()}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                isUploading || isExtractingMetadata || !selectedFile || !title.trim()
                  ? "bg-gray-300 dark:bg-slate-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  : "bg-white/90 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-slate-600 shadow-lg hover:shadow-xl"
              }`}
            >
              {isUploading ? "Uploading..." : isExtractingMetadata ? "Extracting..." : "Upload Background Image"}
            </button>
          </div>
        </form>

        {uploadStatus && (
          <div className={`p-4 rounded-lg text-center font-medium transition-colors duration-200 ${
            uploadStatus.includes("Success") 
              ? "bg-green-500/20 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-400/50 dark:border-green-700"
              : uploadStatus.includes("Error")
              ? "bg-red-500/20 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-400/50 dark:border-red-700"
              : "bg-blue-500/20 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-400/50 dark:border-blue-700"
          }`}>
            {uploadStatus}
          </div>
        )}
      </div>
    </div>
  );
};

export default BackgroundUpload;