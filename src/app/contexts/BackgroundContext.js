"use client";

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useBackgroundUpdater } from '../utils/backgroundUpdater';

export const PORTFOLIO_PROJECT_ID = "8XulpucyZZnvdDMD5RSE";

const BackgroundContext = createContext(null);

export function BackgroundContextProvider({ children }) {
    const { backgroundUrl, isInitialized, imageIndex, locationData } = useBackgroundUpdater();
    
    const [displayUrl, setDisplayUrl] = useState(null);
    const [processedImageUrl, setProcessedImageUrl] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    
    const currentlyDisplayedUrl = useRef(null);
    const transitionTimeout = useRef(null);

    const extractFileId = (url) => {
        if (!url) return null;
        const match = url.match(/\/d\/([a-zA-Z0-9-_]+)|id=([a-zA-Z0-9-_]+)/);
        return match ? (match[1] || match[2]) : null;
    };

    const preloadImage = (url) => {
        return new Promise((resolve, reject) => {
            if (!url) {
                reject(new Error('No URL provided'));
                return;
            }
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = url;
        });
    };

    useEffect(() => {
        if (!isInitialized || !backgroundUrl) {
            return;
        }

        if (backgroundUrl === currentlyDisplayedUrl.current) {
            return;
        }

        if (transitionTimeout.current) {
            clearTimeout(transitionTimeout.current);
        }

        const fileId = extractFileId(backgroundUrl);
        if (!fileId) {
            return;
        }

        const fullImageUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1920-h1080`;
        
        setIsTransitioning(true);
        setImageLoaded(false);

        preloadImage(fullImageUrl)
            .then(() => {
                setImageLoaded(true);
                
                transitionTimeout.current = setTimeout(() => {
                    setDisplayUrl(backgroundUrl);
                    setProcessedImageUrl(fullImageUrl);
                    currentlyDisplayedUrl.current = backgroundUrl;
                    
                    setTimeout(() => {
                        setIsTransitioning(false);
                    }, 1000);
                }, 100);
            })
            .catch(() => {
                setIsTransitioning(false);
                setImageLoaded(false);
                setDisplayUrl(backgroundUrl);
                setProcessedImageUrl(fullImageUrl);
                currentlyDisplayedUrl.current = backgroundUrl;
            });

    }, [backgroundUrl, isInitialized]);

    useEffect(() => {
        if (isInitialized && backgroundUrl && !displayUrl) {
            const fileId = extractFileId(backgroundUrl);
            if (fileId) {
                const fullImageUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1920-h1080`;
                setDisplayUrl(backgroundUrl);
                setProcessedImageUrl(fullImageUrl);
                currentlyDisplayedUrl.current = backgroundUrl;
            }
        }
    }, [isInitialized, backgroundUrl, displayUrl]);

    useEffect(() => {
        return () => {
            if (transitionTimeout.current) {
                clearTimeout(transitionTimeout.current);
            }
        };
    }, []);

    const value = {
        backgroundUrl,
        processedImageUrl,
        displayUrl,
        extractFileId,
        isInitialized,
        isTransitioning,
        imageLoaded,
        imageIndex,
        locationData
    };

    return (
        <BackgroundContext.Provider value={value}>
            {children}
        </BackgroundContext.Provider>
    );
}

export function useBackgroundContext() {
    const context = useContext(BackgroundContext);
    if (!context) {
        return {
            backgroundUrl: null,
            processedImageUrl: null,
            displayUrl: null,
            extractFileId: () => null,
            isInitialized: false,
            isTransitioning: false,
            imageLoaded: false,
            imageIndex: null,
            locationData: null
        };
    }
    return context;
}

export function shouldUseDynamicBackground(projectId) {
    return projectId === PORTFOLIO_PROJECT_ID;
}
