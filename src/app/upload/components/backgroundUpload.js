"use client";

import { useState } from "react";
import { pullPhotoMetadata } from "../../utils/pullPhotoMetadata";

const BackgroundUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isExtractingMetadata, setIsExtractingMetadata] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [extractedMetadata, setExtractedMetadata] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = async (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setUploadStatus("");
      setExtractedMetadata(null);
      
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);

      // Extract and display EXIF metadata (for preview only - API will extract it too)
      try {
        setIsExtractingMetadata(true);
        setUploadStatus("Checking photo metadata...");
        
        const metadata = await pullPhotoMetadata(file);
        setExtractedMetadata(metadata);

        if (metadata.latitude && metadata.longitude) {
          setUploadStatus("✓ GPS coordinates found in image - ready to upload!");
        } else {
          setUploadStatus("⚠ No GPS coordinates found. Image requires EXIF location data.");
        }
      } catch (error) {
        console.warn('Error extracting metadata:', error);
        setUploadStatus("⚠ Could not read metadata. Image may not have GPS coordinates.");
        setExtractedMetadata(null);
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
    
    if (!selectedFile) {
      setUploadStatus("Please select a file.");
      return;
    }

    // Warn if no GPS data detected
    if (!extractedMetadata?.latitude || !extractedMetadata?.longitude) {
      setUploadStatus("⚠ Warning: No GPS coordinates detected. Upload may fail.");
    }

    setIsUploading(true);
    setUploadStatus("Uploading background image...");

    try {
      // API only needs the image - it extracts location from EXIF automatically
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('https://travel-image-api-189526192204.us-central1.run.app/api/v1/images/upload', {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const imageId = result?.id || 'Unknown';
        const location = result?.location;
        const locationStr = location?.city && location?.country 
          ? `${location.city}, ${location.country}`
          : 'Location extracted';
        
        setUploadStatus(`✓ Success! Image uploaded (ID: ${imageId}) - ${locationStr}`);
        setSelectedFile(null);
        setPreview(null);
        setExtractedMetadata(null);
      } else {
        const errorText = await response.text();
        try {
          const error = JSON.parse(errorText);
          const errorMsg = error.message || error.error || errorText;
          if (errorMsg.includes('GPS') || errorMsg.includes('EXIF')) {
            setUploadStatus("✗ Error: Image must contain GPS coordinates in EXIF data.");
          } else {
            setUploadStatus(`✗ Error: ${errorMsg}`);
          }
        } catch {
          setUploadStatus(`✗ Error: HTTP ${response.status} - ${response.statusText}`);
        }
      }
    } catch (error) {
      setUploadStatus(`✗ Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setExtractedMetadata(null);
    setUploadStatus("");
  };

  const hasValidGPS = extractedMetadata?.latitude && extractedMetadata?.longitude;

  return (
    <div className="bg-white/25 dark:bg-black/25 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-white/30 dark:border-gray-700/30 transition-all duration-200">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center transition-colors duration-200">
          Upload Background Image
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6 text-sm">
          Images must contain GPS coordinates in EXIF data. Location info is extracted automatically.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
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
                        <span>Checking metadata...</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={clearSelection}
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
                      PNG, JPG up to 10MB (must have GPS EXIF data)
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Extracted Metadata Display */}
          {extractedMetadata && (
            <div className="mb-6 p-4 bg-white/30 dark:bg-black/30 rounded-lg border border-white/20 dark:border-gray-700/30">
              <h3 className="text-gray-900 dark:text-white font-semibold mb-3 text-sm">Detected Metadata</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {extractedMetadata.latitude && extractedMetadata.longitude && (
                  <div className="col-span-2">
                    <span className="text-gray-600 dark:text-gray-400">GPS: </span>
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {Number(extractedMetadata.latitude).toFixed(4)}, {Number(extractedMetadata.longitude).toFixed(4)}
                    </span>
                  </div>
                )}
                {extractedMetadata.camera && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Camera: </span>
                    <span className="text-gray-900 dark:text-white">{extractedMetadata.camera}</span>
                  </div>
                )}
                {extractedMetadata.dateTaken && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Date: </span>
                    <span className="text-gray-900 dark:text-white">{extractedMetadata.dateTaken}</span>
                  </div>
                )}
                {!extractedMetadata.latitude && !extractedMetadata.longitude && (
                  <div className="col-span-2 text-amber-600 dark:text-amber-400">
                    ⚠ No GPS coordinates found - upload will fail
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="text-center mb-6">
            <button
              type="submit"
              disabled={isUploading || isExtractingMetadata || !selectedFile}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                isUploading || isExtractingMetadata || !selectedFile
                  ? "bg-gray-300 dark:bg-slate-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  : hasValidGPS
                  ? "bg-green-500/90 dark:bg-green-600 text-white hover:bg-green-500 dark:hover:bg-green-500 shadow-lg hover:shadow-xl"
                  : "bg-amber-500/90 dark:bg-amber-600 text-white hover:bg-amber-500 dark:hover:bg-amber-500 shadow-lg hover:shadow-xl"
              }`}
            >
              {isUploading ? "Uploading..." : isExtractingMetadata ? "Checking..." : "Upload Background Image"}
            </button>
          </div>
        </form>

        {uploadStatus && (
          <div className={`p-4 rounded-lg text-center font-medium transition-colors duration-200 ${
            uploadStatus.includes("✓") || uploadStatus.includes("Success")
              ? "bg-green-500/20 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-400/50 dark:border-green-700"
              : uploadStatus.includes("✗") || uploadStatus.includes("Error")
              ? "bg-red-500/20 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-400/50 dark:border-red-700"
              : uploadStatus.includes("⚠")
              ? "bg-amber-500/20 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-400/50 dark:border-amber-700"
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