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

function getMilitaryTimeWithSeconds() {
    const now = new Date();
    return now.getHours() * 10000 + now.getMinutes() * 100 + now.getSeconds();
}

function calculateImageIndex(imageCount) {
    if (imageCount === 0) return 0;
    const militaryTimeWithSeconds = getMilitaryTimeWithSeconds();
    return militaryTimeWithSeconds % imageCount;
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
        
        const response = await axios.get(`${IMAGE_BY_INDEX_ENDPOINT}/${imageIndex}`);
        
        if (!response.data || !response.data.drive_file_id) {
            console.log('❌ Invalid API response:', response.data);
            return;
        }

        const imageData = response.data;
        console.log('✅ API response for index', imageIndex, ':', imageData);

        const newBackgroundUrl = `https://drive.google.com/uc?export=view&id=${imageData.drive_file_id}`;
        console.log('🖼️ Generated background URL:', newBackgroundUrl);

        const locationData = {
            name: imageData.location?.name || 'Unknown Location',
            drive_file_id: imageData.drive_file_id,
            latitude: imageData.location?.latitude,
            longitude: imageData.location?.longitude,
            city: imageData.location?.city,
            country: imageData.location?.country,
            address: imageData.location?.address
        };

        if (newBackgroundUrl !== currentBackgroundUrl) {
            console.log('🔄 Updating background from', currentBackgroundUrl, 'to', newBackgroundUrl);
            currentBackgroundUrl = newBackgroundUrl;
            currentImageIndex = imageIndex;
            currentLocationData = locationData;
            
            console.log('📢 Notifying', backgroundUpdateCallbacks.length, 'callbacks');
            backgroundUpdateCallbacks.forEach((callback) => {
                try {
                    callback(newBackgroundUrl, imageIndex, locationData);
                } catch (error) {
                    console.error('❌ Callback error:', error);
                }
            });
        } else {
            console.log('⏭️ Background URL unchanged, skipping update');
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

export function initializeBackgroundUpdater() {
    if (countUpdateTimer) {
        clearInterval(countUpdateTimer);
    }
    
    console.log('🚀 Initializing background updater...');
    updateImageCount().then(() => {
        console.log('📊 Image count updated:', totalImages);
        updateBackground();
    });
    
    countUpdateTimer = setInterval(() => {
        updateImageCount();
    }, 600000);
    
    const backgroundUpdateTimer = setInterval(() => {
        updateBackground();
    }, 20000);
    
    if (typeof window !== 'undefined') {
        window.backgroundUpdateTimer = backgroundUpdateTimer;
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
    
    if (typeof window !== 'undefined' && window.backgroundUpdateTimer) {
        clearInterval(window.backgroundUpdateTimer);
        window.backgroundUpdateTimer = null;
    }
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
            
            console.log('🖼️ Initial values:', { currentBg, currentCount, currentIndex, currentLocation });
            
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
        isInitialized
    };
}


export default {
    initializeBackgroundUpdater,
    onBackgroundUpdate,
    getCurrentBackground,
    getImageCount,
    getCurrentImageIndex,
    getCurrentLocationData,
    triggerBackgroundUpdate,
    triggerImageCountUpdate,
    stopBackgroundUpdater,
    useBackgroundUpdater
};