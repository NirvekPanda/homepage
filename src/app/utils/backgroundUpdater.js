// Background Image Update System
// Updates background and location data based on military time

import axios from 'axios';
import { useState, useEffect } from 'react';

const API_BASE = 'https://travel-image-api-189526192204.us-central1.run.app/api/v1';
const COUNT_ENDPOINT = `${API_BASE}/images/count`;
const IMAGE_BY_INDEX_ENDPOINT = `${API_BASE}/images/index`;

// Global state
let totalImages = 0;
let currentBackgroundUrl = null;
let currentImageIndex = null;
let currentLocationData = null;
let backgroundUpdateCallbacks = [];
let countUpdateTimer = null;
let batchUpdateTimer = null;

// Preloaded images cache
let preloadedImages = new Map(); // Map of index -> { url, locationData, imageElement }
let nextImagesQueue = []; // Queue of next 4 images to preload
let preloadUsageCount = 0; // Track how many preloaded images have been used
let lastBatchPreloadTime = 0; // Track when last batch preload happened

function getMilitaryTimeWithSeconds() {
    const now = new Date();
    return now.getHours() * 10000 + now.getMinutes() * 100 + now.getSeconds();
}

function calculateImageIndex(imageCount) {
    if (imageCount === 0) return 0;
    const militaryTimeWithSeconds = getMilitaryTimeWithSeconds();
    return militaryTimeWithSeconds % imageCount;
}

function calculateNextImageIndexes(currentIndex, imageCount, count = 4) {
    const indexes = [];
    for (let i = 1; i <= count; i++) {
        indexes.push((currentIndex + i) % imageCount);
    }
    return indexes;
}

function shouldPreloadMoreImages() {
    const now = Date.now();
    const timeSinceLastBatch = now - lastBatchPreloadTime;
    const minTimeBetweenBatches = 30000; // 30 seconds minimum between batches
    
    // Check if we have enough preloaded images
    const preloadedCount = preloadedImages.size;
    const queueCount = nextImagesQueue.length;
    const totalPreloaded = preloadedCount + queueCount;
    
    // Only preload if:
    // 1. We have less than 2 images preloaded, OR
    // 2. We've used more than 2 preloaded images since last batch, OR
    // 3. It's been more than 2 minutes since last batch
    const needsMoreImages = totalPreloaded < 2 || 
                           preloadUsageCount >= 2 || 
                           timeSinceLastBatch > 120000; // 2 minutes
    
    return needsMoreImages && timeSinceLastBatch >= minTimeBetweenBatches;
}

function preloadImage(imageData, index) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const backgroundUrl = `https://drive.google.com/thumbnail?id=${imageData.drive_file_id}&sz=w1920-h1080`;
        
        img.onload = () => {
            const locationData = {
                name: imageData.location?.name || 'Unknown Location',
                drive_file_id: imageData.drive_file_id,
                latitude: imageData.location?.latitude,
                longitude: imageData.location?.longitude,
                city: imageData.location?.city,
                country: imageData.location?.country,
                address: imageData.location?.address
            };
            
            preloadedImages.set(index, {
                url: backgroundUrl,
                locationData,
                imageElement: img,
                loaded: true
            });
            
            resolve({ index, url: backgroundUrl, locationData });
        };
        
        img.onerror = () => {
            reject(new Error(`Failed to preload image for index ${index}`));
        };
        
        img.src = backgroundUrl;
    });
}

async function batchPreloadImages() {
    if (totalImages === 0) return;
    
    // Check if we actually need to preload more images
    if (!shouldPreloadMoreImages()) {
        return;
    }
    
    const currentIndex = calculateImageIndex(totalImages);
    const nextIndexes = calculateNextImageIndexes(currentIndex, totalImages, 4);
    
    lastBatchPreloadTime = Date.now();
    
    const preloadPromises = nextIndexes.map(async (index) => {
        // Skip if already preloaded
        if (preloadedImages.has(index)) {
            return null;
        }
        
        try {
            const response = await axios.get(`${IMAGE_BY_INDEX_ENDPOINT}/${index}`);
            
            if (!response.data || !response.data.drive_file_id) {
                return null;
            }
            
            return await preloadImage(response.data, index);
        } catch (error) {
            return null;
        }
    });
    
    try {
        const results = await Promise.allSettled(preloadPromises);
        const successfulPreloads = results
            .filter(result => result.status === 'fulfilled' && result.value)
            .map(result => result.value);
        
        // Only log if we actually loaded new images
        if (successfulPreloads.length > 0) {
            const loadedIndexes = successfulPreloads.map(img => img.index).join(', ');
            console.log(`📦 Batch loaded images: [${loadedIndexes}]`);
        }
        
        // Update next images queue and reset usage count
        nextImagesQueue = successfulPreloads;
        preloadUsageCount = 0; // Reset usage count after successful preload
        
    } catch (error) {
        console.error('❌ Batch preload error:', error);
    }
}

async function updateImageCount() {
    try {
        const response = await axios.get(COUNT_ENDPOINT);
        
        if (response.data && typeof response.data.count === 'number') {
            totalImages = response.data.count;
        } else {
            totalImages = 1;
        }
    } catch (error) {
        totalImages = 1;
    }
}

async function updateBackground() {
    if (totalImages === 0) {
        return;
    }

    try {
        const imageIndex = calculateImageIndex(totalImages);
        
        // Check if we have a preloaded image for this index
        const preloadedImage = preloadedImages.get(imageIndex);
        
        let newBackgroundUrl, locationData;
        
        if (preloadedImage && preloadedImage.loaded) {
            // Use preloaded image
            newBackgroundUrl = preloadedImage.url;
            locationData = preloadedImage.locationData;
            
            // Track usage and remove from preloaded cache
            preloadUsageCount++;
            preloadedImages.delete(imageIndex);
        } else {
            // Fallback to API call
            const response = await axios.get(`${IMAGE_BY_INDEX_ENDPOINT}/${imageIndex}`);
            
            if (!response.data || !response.data.drive_file_id) {
                return;
            }

            const imageData = response.data;
            newBackgroundUrl = `https://drive.google.com/thumbnail?id=${imageData.drive_file_id}&sz=w1920-h1080`;

            locationData = {
                name: imageData.location?.name || 'Unknown Location',
                drive_file_id: imageData.drive_file_id,
                latitude: imageData.location?.latitude,
                longitude: imageData.location?.longitude,
                city: imageData.location?.city,
                country: imageData.location?.country,
                address: imageData.location?.address
            };
        }

        if (newBackgroundUrl !== currentBackgroundUrl) {
            currentBackgroundUrl = newBackgroundUrl;
            currentImageIndex = imageIndex;
            currentLocationData = locationData;
            
            backgroundUpdateCallbacks.forEach((callback) => {
                try {
                    if (typeof callback === 'function') {
                        callback(newBackgroundUrl, imageIndex, locationData);
                    }
                } catch (error) {
                    console.error('❌ Callback error:', error);
                }
            });
        }

    } catch (error) {
        console.error('❌ Background update error:', error);
    }
}

export function onBackgroundUpdate(callback) {
    if (typeof callback !== 'function') {
        throw new Error('Callback must be a function');
    }
    
    backgroundUpdateCallbacks.push(callback);
    
    return () => {
        const index = backgroundUpdateCallbacks.indexOf(callback);
        if (index > -1) {
            backgroundUpdateCallbacks.splice(index, 1);
        }
    };
}

export function getCurrentBackground() {
    return currentBackgroundUrl;
}

export function getImageCount() {
    return totalImages;
}

export function getCurrentImageIndex() {
    return currentImageIndex;
}

export function getCurrentLocationData() {
    return currentLocationData;
}

export function getPreloadedImages() {
    return Array.from(preloadedImages.values());
}

export function getNextImagesQueue() {
    return nextImagesQueue;
}

export function triggerBatchPreload() {
    batchPreloadImages();
}

export function getPreloadStatus() {
    return {
        preloadedCount: preloadedImages.size,
        queueCount: nextImagesQueue.length,
        usageCount: preloadUsageCount,
        lastBatchTime: lastBatchPreloadTime,
        shouldPreload: shouldPreloadMoreImages()
    };
}

export function initializeBackgroundUpdater() {
    if (countUpdateTimer) {
        clearInterval(countUpdateTimer);
    }
    if (batchUpdateTimer) {
        clearInterval(batchUpdateTimer);
    }
    
    updateImageCount().then(() => {
        updateBackground();
        // Start batch preloading after initial background is set
        batchPreloadImages();
    });
    
    countUpdateTimer = setInterval(() => {
        updateImageCount();
    }, 600000);
    
    const backgroundUpdateTimer = setInterval(() => {
        updateBackground();
    }, 30000);
    
    // Smart batch preload - check every 30 seconds if we need more images
    batchUpdateTimer = setInterval(() => {
        batchPreloadImages();
    }, 30000);
    
    if (typeof window !== 'undefined') {
        window.backgroundUpdateTimer = backgroundUpdateTimer;
        window.batchUpdateTimer = batchUpdateTimer;
    }
}

export function triggerBackgroundUpdate() {
    updateBackground();
}

export function triggerImageCountUpdate() {
    updateImageCount();
}

export function stopBackgroundUpdater() {
    if (countUpdateTimer) {
        clearInterval(countUpdateTimer);
        countUpdateTimer = null;
    }
    
    if (batchUpdateTimer) {
        clearInterval(batchUpdateTimer);
        batchUpdateTimer = null;
    }
    
    if (typeof window !== 'undefined') {
        if (window.backgroundUpdateTimer) {
            clearInterval(window.backgroundUpdateTimer);
            window.backgroundUpdateTimer = null;
        }
        if (window.batchUpdateTimer) {
            clearInterval(window.batchUpdateTimer);
            window.batchUpdateTimer = null;
        }
    }
    
    // Clear preloaded images cache
    preloadedImages.clear();
    nextImagesQueue = [];
}

export function useBackgroundUpdater() {
    const [backgroundUrl, setBackgroundUrl] = useState(null);
    const [imageCount, setImageCount] = useState(0);
    const [imageIndex, setImageIndex] = useState(null);
    const [locationData, setLocationData] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [preloadedImages, setPreloadedImages] = useState([]);
    const [nextImagesQueue, setNextImagesQueue] = useState([]);

    useEffect(() => {
        try {
            initializeBackgroundUpdater();
            setIsInitialized(true);
            
            const currentBg = getCurrentBackground();
            const currentCount = getImageCount();
            const currentIndex = getCurrentImageIndex();
            const currentLocation = getCurrentLocationData();
            
            setBackgroundUrl(currentBg);
            setImageCount(currentCount);
            setImageIndex(currentIndex);
            setLocationData(currentLocation);
        } catch (err) {
            console.error('Failed to initialize background updater:', err);
        }

        return () => {
            stopBackgroundUpdater();
        };
    }, []);

    useEffect(() => {
        if (!isInitialized) return;

        const unsubscribe = onBackgroundUpdate((newBackgroundUrl, newImageIndex, newLocationData) => {
            setBackgroundUrl(newBackgroundUrl);
            setImageIndex(newImageIndex);
            setLocationData(newLocationData);
        });

        return unsubscribe;
    }, [isInitialized]);

    // Handle preloaded images updates separately
    useEffect(() => {
        if (!isInitialized) return;

        const interval = setInterval(() => {
            setPreloadedImages(getPreloadedImages());
            setNextImagesQueue(getNextImagesQueue());
        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, [isInitialized]);

    useEffect(() => {
        if (!isInitialized) return;

        const interval = setInterval(() => {
            const currentCount = getImageCount();
            if (currentCount !== imageCount) {
                setImageCount(currentCount);
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [isInitialized, imageCount]);

    return {
        backgroundUrl,
        imageCount,
        imageIndex,
        locationData,
        isInitialized,
        preloadedImages,
        nextImagesQueue
    };
}


export default {
    initializeBackgroundUpdater,
    onBackgroundUpdate,
    getCurrentBackground,
    getImageCount,
    getCurrentImageIndex,
    getCurrentLocationData,
    getPreloadedImages,
    getNextImagesQueue,
    getPreloadStatus,
    triggerBackgroundUpdate,
    triggerImageCountUpdate,
    triggerBatchPreload,
    stopBackgroundUpdater,
    useBackgroundUpdater
};