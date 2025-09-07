// Background Image Upload Component
// Handles file upload with clean naming system aligned with database cleanup patterns
// Removes unnecessary metadata, dates, and generates clean titles

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

  // Check if file is HEIC format
  const isHeicFile = (file) => {
    const heicExtensions = ['.heic', '.heif'];
    const fileName = file.name.toLowerCase();
    return heicExtensions.some(ext => fileName.endsWith(ext)) || 
           file.type === 'image/heic' || 
           file.type === 'image/heif';
  };

  // Convert HEIC to JPEG
  const convertHeicToJpeg = async (file) => {
    try {
      console.log('Converting HEIC file to JPEG...');
      
      const heic2any = (await import('heic2any')).default;
      
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.8
      });
      
      const jpegBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      
      const convertedFile = new File([jpegBlob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
        type: 'image/jpeg',
        lastModified: file.lastModified
      });
      
      console.log('HEIC conversion successful:', convertedFile.name, convertedFile.size);
      return convertedFile;
    } catch (error) {
      console.error('Error converting HEIC file:', error);
      
      if (error.code === 2 || error.message?.includes('format not supported')) {
        throw new Error('This HEIC file format is not supported. Please try a different HEIC file or convert it manually to JPEG.');
      }
      
      throw new Error(`Failed to convert HEIC file to JPEG: ${error.message || 'Unknown error'}`);
    }
  };

  // Clean filename following database cleanup patterns
  const cleanFilename = (filename) => {
    // Remove file extension temporarily
    const ext = getFileExtension(filename);
    let name = filename.substring(0, filename.lastIndexOf('.'));

    // Remove common patterns (same as cleanup-database.go)
    const patterns = [
      /_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}/g, // _2025-09-07_23-03-36
      /_\d{10,}/g,                             // _1757223630234541862
      /_IMG\s+\d+/g,                           // _IMG 8179
      /_CI/g,                                  // _CI
      /_Unknown_Location/g,                    // _Unknown_Location
      /_\d{4}-\d{2}-\d{2}/g,                   // _2025-09-07
      /_\d{2}-\d{2}-\d{2}/g,                   // _23-03-36
    ];

    patterns.forEach(pattern => {
      name = name.replace(pattern, '');
    });

    // Remove multiple underscores and replace with single underscore
    name = name.replace(/_+/g, '_');

    // Remove leading/trailing underscores
    name = name.replace(/^_+|_+$/g, '');

    // If name is empty or too short, use a generic name
    if (name.length < 3) {
      name = 'image';
    }

    // Add back extension
    return name + ext;
  };

  // Clean title from filename (same logic as cleanup-database.go)
  const cleanTitle = (filename) => {
    // Remove file extension
    const name = filename.substring(0, filename.lastIndexOf('.'));

    // Replace underscores and dashes with spaces
    let cleanName = name.replace(/_/g, ' ').replace(/-/g, ' ');

    // Remove extra spaces
    cleanName = cleanName.replace(/\s+/g, ' ').trim();

    // Capitalize first letter of each word
    const words = cleanName.split(' ').filter(word => word.length > 0);
    const capitalizedWords = words.map(word => {
      if (word.length > 0) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word;
    });

    const result = capitalizedWords.join(' ');
    return result || 'Image';
  };

  // Clean description following database patterns
  const cleanDescription = (originalDescription, filename) => {
    if (!originalDescription || originalDescription.trim() === '') {
      return `Travel photo - ${cleanFilename(filename)}`;
    }

    // Remove "Migrated from Google Drive - " prefix if present
    if (originalDescription.startsWith('Migrated from Google Drive - ')) {
      const filename = originalDescription.replace('Migrated from Google Drive - ', '');
      const cleanName = cleanFilename(filename);
      return `Travel photo - ${cleanName}`;
    }

    // If it contains "Unknown_Location", make it more meaningful
    if (originalDescription.includes('Unknown_Location')) {
      return 'Travel photo';
    }

    return originalDescription;
  };

  // Get file extension
  const getFileExtension = (filename) => {
    const lastDot = filename.lastIndexOf('.');
    return lastDot === -1 ? '' : filename.substring(lastDot);
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
            setSelectedFile(fileToProcess);
          } catch (conversionError) {
            console.warn('HEIC conversion failed, proceeding with original file:', conversionError);
            setUploadStatus("HEIC conversion failed, using original file. Some features may not work.");
            fileToProcess = file;
          }
        }
        
        const metadata = await pullPhotoMetadata(fileToProcess);
        
        // Generate clean filename and title
        const cleanFile = cleanFilename(fileToProcess.name);
        const cleanTitleText = cleanTitle(cleanFile);
        const cleanDesc = cleanDescription(metadata.description, cleanFile);
        
        // Populate form fields with cleaned data
        setTitle(cleanTitleText);
        setDescription(cleanDesc);
        
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

      console.log('Sending upload request...');
      console.log('FormData contents:', Array.from(formData.entries()));
      
      const response = await fetch('https://travel-image-api-189526192204.us-central1.run.app/api/v1/images/upload', {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        body: formData,
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        try {
          const result = await response.json();
          console.log('Upload response:', result);
          
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
          
          setUploadStatus(`Success: Image uploaded successfully! ID: ${imageId}`);
          setSelectedFile(null);
          setPreview(null);
          setTitle("");
          setDescription("");
          setLatitude("");
          setLongitude("");
          setLocationName("");
        } catch (parseError) {
          console.log('JSON parse error:', parseError);
          setUploadStatus(`Success: Image uploaded successfully! (Response received)`);
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
        
        try {
          const errorText = await response.text();
          console.log('Error response body:', errorText);
          
          try {
            const error = JSON.parse(errorText);
            setUploadStatus(`Error: Upload failed: ${error.message || error.error || 'Unknown error'}`);
          } catch (jsonError) {
            setUploadStatus(`Error: Upload failed: HTTP ${response.status} - ${response.statusText}. Response: ${errorText}`);
          }
        } catch (parseError) {
          console.log('Failed to read response body:', parseError);
          setUploadStatus(`Error: Upload failed: HTTP ${response.status} - ${response.statusText}`);
        }
      }
    } catch (error) {
      console.log('Upload error:', error);
      setUploadStatus(`Error: Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
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
        </div>

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