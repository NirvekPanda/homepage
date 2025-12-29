import axios from 'axios';
import { useState, useEffect } from 'react';

const API_BASE = 'https://travel-image-api-189526192204.us-central1.run.app/api/v1';
const COUNT_ENDPOINT = `${API_BASE}/images/count`;
const IMAGE_BY_INDEX_ENDPOINT = `${API_BASE}/images/index`;

let totalImages = 0;
let currentBackgroundUrl = null;
let currentImageIndex = null;
let currentLocationData = null;
let backgroundUpdateCallbacks = [];
let countUpdateTimer = null;
let batchUpdateTimer = null;
let backgroundUpdateTimer = null;

let startTime = Date.now();
const UPDATE_INTERVAL = 10000;
let lastActualUpdate = 0;

let preloadedImages = new Map();
let preloadUsageCount = 0;
let lastBatchPreloadTime = 0;

function calculateImageIndex(imageCount) {
    if (imageCount === 0) return 0;
    
    const elapsedTime = Date.now() - startTime;
    const intervalsPassed = Math.floor(elapsedTime / UPDATE_INTERVAL);
    const index = intervalsPassed % imageCount;
    
    return index;
}

function calculateNextImageIndexes(currentIndex, imageCount, count = 3) {
    const indexes = [];
    for (let i = 1; i <= count; i++) {
        indexes.push((currentIndex + i) % imageCount);
    }
    return indexes;
}

function shouldPreloadMoreImages() {
    const now = Date.now();
    const timeSinceLastBatch = now - lastBatchPreloadTime;
    const minTimeBetweenBatches = 25000;
    
    const preloadedCount = preloadedImages.size;
    const needsMoreImages = preloadedCount < 3 || preloadUsageCount >= 2;
    
    return needsMoreImages && timeSinceLastBatch >= minTimeBetweenBatches;
}

function preloadImage(imageData, index) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const backgroundUrl = `https://drive.google.com/thumbnail?id=${imageData.drive_file_id}&sz=w1920-h1080`;
        
        img.onload = () => {
            // Build location name from city and country (simplified API response)
            const locationName = imageData.location?.city && imageData.location?.country 
                ? `${imageData.location.city}, ${imageData.location.country}`
                : imageData.location?.city || imageData.location?.country || 'Unknown Location';
            
            const locationData = {
                name: locationName,
                drive_file_id: imageData.drive_file_id,
                latitude: imageData.location?.latitude,
                longitude: imageData.location?.longitude,
                city: imageData.location?.city,
                country: imageData.location?.country
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
    
    if (!shouldPreloadMoreImages()) {
        return;
    }
    
    const currentIndex = calculateImageIndex(totalImages);
    const nextIndexes = calculateNextImageIndexes(currentIndex, totalImages, 3);
    
    lastBatchPreloadTime = Date.now();
    
    const preloadPromises = nextIndexes.map(async (index) => {
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
        
        
        preloadUsageCount = 0;
        
    } catch (error) {

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
        
        if (imageIndex === currentImageIndex) {
            return;
        }
        
        const now = Date.now();
        if (lastActualUpdate > 0 && (now - lastActualUpdate) < 18000) {
            return;
        }
        
        const preloadedImage = preloadedImages.get(imageIndex);
        let newBackgroundUrl, locationData;
        
        if (preloadedImage && preloadedImage.loaded) {
            newBackgroundUrl = preloadedImage.url;
            locationData = preloadedImage.locationData;
            
            preloadUsageCount++;
            preloadedImages.delete(imageIndex);
        } else {
            const response = await axios.get(`${IMAGE_BY_INDEX_ENDPOINT}/${imageIndex}`);
            
            if (!response.data || !response.data.drive_file_id) {
                return;
            }

            const imageData = response.data;
            newBackgroundUrl = `https://drive.google.com/thumbnail?id=${imageData.drive_file_id}&sz=w1920-h1080`;

            // Build location name from city and country (simplified API response)
            const locationName = imageData.location?.city && imageData.location?.country 
                ? `${imageData.location.city}, ${imageData.location.country}`
                : imageData.location?.city || imageData.location?.country || 'Unknown Location';

            locationData = {
                name: locationName,
                drive_file_id: imageData.drive_file_id,
                latitude: imageData.location?.latitude,
                longitude: imageData.location?.longitude,
                city: imageData.location?.city,
                country: imageData.location?.country
            };
        }

        currentBackgroundUrl = newBackgroundUrl;
        currentImageIndex = imageIndex;
        currentLocationData = locationData;
        lastActualUpdate = now;
        
        backgroundUpdateCallbacks.forEach((callback) => {
            try {
                if (typeof callback === 'function') {
                    callback(newBackgroundUrl, imageIndex, locationData);
                }
            } catch (error) {
            }
        });

    } catch (error) {
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

export function getPreloadStatus() {
    return {
        preloadedCount: preloadedImages.size,
        usageCount: preloadUsageCount,
        lastBatchTime: lastBatchPreloadTime,
        shouldPreload: shouldPreloadMoreImages()
    };
}

export function initializeBackgroundUpdater() {
    startTime = Date.now();
    lastActualUpdate = 0;
    currentBackgroundUrl = null;
    currentImageIndex = null;
    currentLocationData = null;
    
    if (countUpdateTimer) clearInterval(countUpdateTimer);
    if (batchUpdateTimer) clearInterval(batchUpdateTimer);
    if (backgroundUpdateTimer) clearInterval(backgroundUpdateTimer);
    
    updateImageCount().then(() => {
        updateBackground();
        
        setTimeout(() => {
            batchPreloadImages();
        }, 2000);
    });
    
    countUpdateTimer = setInterval(updateImageCount, 600000); // Every 10 minutes
    
    backgroundUpdateTimer = setInterval(() => {
        updateBackground();
    }, UPDATE_INTERVAL);
    
    batchUpdateTimer = setInterval(() => {
        batchPreloadImages();
    }, 25000); // Every 25 seconds
    
    if (typeof window !== 'undefined') {
        window.backgroundUpdateTimer = backgroundUpdateTimer;
        window.batchUpdateTimer = batchUpdateTimer;
    }
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
    
    if (backgroundUpdateTimer) {
        clearInterval(backgroundUpdateTimer);
        backgroundUpdateTimer = null;
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
    
    preloadedImages.clear();
    backgroundUpdateCallbacks = [];
}

export function useBackgroundUpdater() {
    const [backgroundUrl, setBackgroundUrl] = useState(null);
    const [imageCount, setImageCount] = useState(0);
    const [imageIndex, setImageIndex] = useState(null);
    const [locationData, setLocationData] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

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

    useEffect(() => {
        if (!isInitialized) return;

        const interval = setInterval(() => {
            const currentCount = getImageCount();
            if (currentCount !== imageCount) {
                setImageCount(currentCount);
            }
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [isInitialized, imageCount]);

    return {
        backgroundUrl,
        imageCount,
        imageIndex,
        locationData,
        isInitialized
    };
}

export function triggerBackgroundUpdate() {
    updateBackground();
}

export function triggerBatchPreload() {
    batchPreloadImages();
}

export default {
    initializeBackgroundUpdater,
    onBackgroundUpdate,
    getCurrentBackground,
    getImageCount,
    getCurrentImageIndex,
    getCurrentLocationData,
    getPreloadedImages,
    getPreloadStatus,
    triggerBackgroundUpdate,
    triggerBatchPreload,
    stopBackgroundUpdater,
    useBackgroundUpdater
};