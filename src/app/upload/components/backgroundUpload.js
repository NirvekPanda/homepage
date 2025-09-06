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

  // Helper function to check if file is HEIC format
  const isHeicFile = (file) => {
    const heicExtensions = ['.heic', '.heif'];
    const fileName = file.name.toLowerCase();
    return heicExtensions.some(ext => fileName.endsWith(ext)) || 
           file.type === 'image/heic' || 
           file.type === 'image/heif';
  };

  // Helper function to convert HEIC to JPEG
  const convertHeicToJpeg = async (file) => {
    try {
      console.log('Converting HEIC file to JPEG...');
      
      // Dynamically import heic2any to avoid SSR issues
      const heic2any = (await import('heic2any')).default;
      
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.8
      });
      
      // heic2any returns an array, get the first element
      const jpegBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      
      // Create a new File object with the converted blob
      const convertedFile = new File([jpegBlob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
        type: 'image/jpeg',
        lastModified: file.lastModified
      });
      
      console.log('HEIC conversion successful:', convertedFile.name, convertedFile.size);
      return convertedFile;
    } catch (error) {
      console.error('Error converting HEIC file:', error);
      
      // Check if it's a format not supported error
      if (error.code === 2 || error.message?.includes('format not supported')) {
        throw new Error('This HEIC file format is not supported. Please try a different HEIC file or convert it manually to JPEG.');
      }
      
      throw new Error(`Failed to convert HEIC file to JPEG: ${error.message || 'Unknown error'}`);
    }
  };

  const handleFileChange = async (file) => {
    if (file) {
      // Validate file type (including HEIC)
      const isValidImage = file.type.startsWith('image/') || isHeicFile(file);
      if (!isValidImage) {
        setUploadStatus("Please select an image file (JPG, PNG, GIF, HEIC, HEIF).");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadStatus("File size must be less than 10MB.");
        return;
      }

      setSelectedFile(file);
      setUploadStatus("");

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);

      // Extract EXIF metadata and populate form fields
      try {
        setIsExtractingMetadata(true);
        setUploadStatus("Extracting photo metadata...");
        
        let fileToProcess = file;
        
        // Convert HEIC to JPEG if needed
        if (isHeicFile(file)) {
          try {
            setUploadStatus("Converting HEIC file to JPEG...");
            fileToProcess = await convertHeicToJpeg(file);
            setSelectedFile(fileToProcess); // Update selected file to converted version
          } catch (conversionError) {
            console.warn('HEIC conversion failed, proceeding with original file:', conversionError);
            setUploadStatus("⚠️ HEIC conversion failed, using original file. Some features may not work.");
            // Continue with original file - user can still upload it
            fileToProcess = file;
          }
        }
        
        const metadata = await pullPhotoMetadata(fileToProcess);
        
        // Populate form fields with extracted metadata
        if (metadata.title) {
          setTitle(metadata.title);
        }
        if (metadata.description) {
          setDescription(metadata.description);
        }
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
        if (isHeicFile(file) && fileToProcess !== file) {
          extractedInfo.push("HEIC converted to JPEG");
        } else if (isHeicFile(file) && fileToProcess === file) {
          extractedInfo.push("HEIC file (conversion failed)");
        }
        if (metadata.camera) extractedInfo.push(`Camera: ${metadata.camera}`);
        if (metadata.dateTaken) extractedInfo.push(`Date: ${metadata.dateTaken}`);
        if (metadata.latitude && metadata.longitude) {
          extractedInfo.push(`Location: ${metadata.latitude}, ${metadata.longitude}`);
        }
        
        if (extractedInfo.length > 0) {
          setUploadStatus(`✅ ${extractedInfo.join(' | ')}`);
        } else {
          setUploadStatus("✅ Image loaded (no EXIF data found)");
        }
      } catch (error) {
        console.warn('Error extracting metadata:', error);
        setUploadStatus("⚠️ Image loaded (metadata extraction failed)");
      } finally {
        setIsExtractingMetadata(false);
      }
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

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) {
      setUploadStatus("Please select a file and enter a title.");
      return;
    }

    setIsUploading(true);
    setUploadStatus("Uploading image...");

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      
      // Add location metadata if provided
      if (latitude.trim()) formData.append('latitude', latitude.trim());
      if (longitude.trim()) formData.append('longitude', longitude.trim());
      if (locationName.trim()) formData.append('location_name', locationName.trim());

      console.log('Sending upload request...'); // Debug log
      console.log('FormData contents:', Array.from(formData.entries())); // Debug form data
      
      const response = await fetch('https://background-image-drive-api-189526192204.us-west1.run.app/api/v1/images/upload', {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        body: formData,
      });

      console.log('Response status:', response.status); // Debug log
      console.log('Response headers:', response.headers); // Debug response headers

      if (response.ok) {
        try {
          const result = await response.json();
          console.log('Upload response:', result); // Debug log
          
          // Safely extract ID with multiple fallbacks
          let imageId = 'Unknown';
          if (result && typeof result === 'object') {
            if (result.hasOwnProperty('id')) {
              imageId = result.id;
            } else if (result.hasOwnProperty('imageId')) {
              imageId = result.imageId;
            } else if (result.hasOwnProperty('image_id')) {
              imageId = result.image_id;
            } else if (result.hasOwnProperty('ID')) {
              imageId = result.ID;
            }
          }
          
          setUploadStatus(`✅ Image uploaded successfully! ID: ${imageId}`);
          setSelectedFile(null);
          setPreview(null);
          setTitle("");
          setDescription("");
          setLatitude("");
          setLongitude("");
          setLocationName("");
        } catch (parseError) {
          console.log('JSON parse error:', parseError); // Debug log
          setUploadStatus(`✅ Image uploaded successfully! (Response received)`);
          setSelectedFile(null);
          setPreview(null);
          setTitle("");
          setDescription("");
          setLatitude("");
          setLongitude("");
          setLocationName("");
        }
      } else {
        console.log('Upload failed with status:', response.status);
        console.log('Response status text:', response.statusText);
        
        try {
          const errorText = await response.text();
          console.log('Error response body:', errorText);
          
          // Try to parse as JSON
          try {
            const error = JSON.parse(errorText);
            setUploadStatus(`❌ Upload failed: ${error.message || error.error || 'Unknown error'}`);
          } catch (jsonError) {
            setUploadStatus(`❌ Upload failed: HTTP ${response.status} - ${response.statusText}. Response: ${errorText}`);
          }
        } catch (parseError) {
          console.log('Failed to read response body:', parseError);
          setUploadStatus(`❌ Upload failed: HTTP ${response.status} - ${response.statusText}`);
        }
      }
    } catch (error) {
      console.log('Upload error:', error); // Debug log
      setUploadStatus(`❌ Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const response = await fetch(`https://background-image-drive-api-189526192204.us-west1.run.app/api/v1/images/${imageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUploadStatus("✅ Image deleted successfully!");
      } else {
        try {
          const error = await response.json();
          setUploadStatus(`❌ Delete failed: ${error.message || 'Unknown error'}`);
        } catch (parseError) {
          setUploadStatus(`❌ Delete failed: HTTP ${response.status} - ${response.statusText}`);
        }
      }
    } catch (error) {
      setUploadStatus(`❌ Delete failed: ${error.message}`);
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-8 shadow-lg border border-slate-700">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-[#F5ECD5] mb-6 text-center">
          Upload Image
        </h2>

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
              accept="image/*,.heic,.heif"
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
                    PNG, JPG, GIF, HEIC up to 10MB
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
            onClick={handleUpload}
            disabled={isUploading || isExtractingMetadata || !selectedFile || !title.trim()}
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
              isUploading || isExtractingMetadata || !selectedFile || !title.trim()
                ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                : "bg-[#F5ECD5] text-gray-900 hover:bg-[#E6D4B8] shadow-lg hover:shadow-xl"
            }`}
          >
            {isUploading ? "Uploading..." : isExtractingMetadata ? "Extracting..." : "Upload Image"}
          </button>
          
          {/* Debug Test Button */}
          <button
            onClick={async () => {
              console.log('Testing backend connection...');
              try {
                const testResponse = await fetch('https://background-image-drive-api-189526192204.us-west1.run.app/api/v1/images/count', {
                  method: 'GET',
                  mode: 'cors',
                  credentials: 'omit',
                });
                console.log('Test response status:', testResponse.status);
                const testText = await testResponse.text();
                console.log('Test response body:', testText);
                setUploadStatus(`Test: Status ${testResponse.status} - ${testText}`);
              } catch (testError) {
                console.log('Test error:', testError);
                setUploadStatus(`Test failed: ${testError.message}`);
              }
            }}
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Test Backend
          </button>
        </div>

        {/* Status Message */}
        {uploadStatus && (
          <div className={`p-4 rounded-lg text-center font-medium ${
            uploadStatus.includes("✅") 
              ? "bg-green-900/30 text-green-300 border border-green-700"
              : uploadStatus.includes("❌")
              ? "bg-red-900/30 text-red-300 border border-red-700"
              : "bg-blue-900/30 text-blue-300 border border-blue-700"
          }`}>
            {uploadStatus}
          </div>
        )}

        {/* API Information */}
        <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <h3 className="text-[#F5ECD5] font-semibold mb-2">API Endpoints</h3>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="mb-3 p-2 bg-slate-700/50 rounded text-xs">
              <span className="text-[#F5ECD5] font-medium">Base URL:</span> https://background-image-drive-api-189526192204.us-west1.run.app
            </div>
            <div>
              <span className="font-mono bg-slate-700 px-2 py-1 rounded">POST /api/v1/images/upload</span>
              <span className="ml-2">Upload new image with metadata</span>
            </div>
            <div>
              <span className="font-mono bg-slate-700 px-2 py-1 rounded">GET /api/v1/images/current</span>
              <span className="ml-2">Get current image</span>
            </div>
            <div>
              <span className="font-mono bg-slate-700 px-2 py-1 rounded">GET /api/v1/images/count</span>
              <span className="ml-2">Get image count</span>
            </div>
            <div>
              <span className="font-mono bg-slate-700 px-2 py-1 rounded">GET /api/v1/images/{"{id}"}</span>
              <span className="ml-2">Get image by ID</span>
            </div>
            <div>
              <span className="font-mono bg-slate-700 px-2 py-1 rounded">DELETE /api/v1/images/{"{id}"}</span>
              <span className="ml-2">Delete image</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-600">
              <span className="font-mono bg-slate-700 px-2 py-1 rounded">GET /api/v1/location/coords</span>
              <span className="ml-2">Get location from coordinates</span>
            </div>
            <div>
              <span className="font-mono bg-slate-700 px-2 py-1 rounded">GET /api/v1/location/name</span>
              <span className="ml-2">Get location from name</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundUpload;

