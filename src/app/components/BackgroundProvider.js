"use client";

import { useState, useEffect, useRef } from 'react';
import { useBackgroundUpdater } from '../utils/backgroundUpdater';

export default function BackgroundProvider({ children }) {
    const { backgroundUrl, isInitialized } = useBackgroundUpdater();
    
    const [displayUrl, setDisplayUrl] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    
    // Single ref to track what's currently being shown
    const currentlyDisplayedUrl = useRef(null);
    const transitionTimeout = useRef(null);
    const loadCheckTimeout = useRef(null);

    // Extract file ID from Google Drive URL
    const extractFileId = (url) => {
        if (!url) return null;
        const match = url.match(/\/d\/([a-zA-Z0-9-_]+)|id=([a-zA-Z0-9-_]+)/);
        return match ? (match[1] || match[2]) : null;
    };

    // Preload image and check if it loads successfully
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

    // Handle background URL changes with smooth transitions
    useEffect(() => {
        if (!isInitialized || !backgroundUrl) {
            return;
        }

        // Skip if this is the same URL we're already showing
        if (backgroundUrl === currentlyDisplayedUrl.current) {
            return;
        }

        // Clear existing timeouts
        if (transitionTimeout.current) {
            clearTimeout(transitionTimeout.current);
        }
        if (loadCheckTimeout.current) {
            clearTimeout(loadCheckTimeout.current);
        }

        // Preload the new image
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
                
                // Start transition after image is loaded
                transitionTimeout.current = setTimeout(() => {
                    setDisplayUrl(backgroundUrl);
                    currentlyDisplayedUrl.current = backgroundUrl;
                    
                    // End transition after CSS fade completes
                    setTimeout(() => {
                        setIsTransitioning(false);
                    }, 1000); // Match CSS transition duration
                    
                }, 100); // Small delay for smooth transition start
            })
            .catch((error) => {
                setIsTransitioning(false);
                setImageLoaded(false);
                
                // Still try to show the image (maybe it will load in the background)
                setDisplayUrl(backgroundUrl);
                currentlyDisplayedUrl.current = backgroundUrl;
            });

    }, [backgroundUrl, isInitialized]);

    // Set initial image on first load
    useEffect(() => {
        if (isInitialized && backgroundUrl && !displayUrl) {
            setDisplayUrl(backgroundUrl);
            currentlyDisplayedUrl.current = backgroundUrl;
        }
    }, [isInitialized, backgroundUrl, displayUrl]);

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            if (transitionTimeout.current) {
                clearTimeout(transitionTimeout.current);
            }
            if (loadCheckTimeout.current) {
                clearTimeout(loadCheckTimeout.current);
            }
        };
    }, []);

    const displayFileId = extractFileId(displayUrl);

    return (
        <div className="relative min-h-screen">
            {/* Single background image with smooth transitions */}
            {isInitialized && displayFileId && (
                <div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
                    <div 
                        className="absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out"
                        style={{
                            backgroundImage: `url(https://drive.google.com/thumbnail?id=${displayFileId}&sz=w1920-h1080)`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundAttachment: 'fixed',
                            opacity: imageLoaded ? 1 : 0.7,
                            filter: isTransitioning ? 'brightness(0.9)' : 'brightness(1)'
                        }}
                    />
                </div>
            )}
            
            
            {/* Content overlay */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}