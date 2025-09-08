"use client";

import { useState, useEffect } from 'react';
import { useBackgroundUpdater } from '../utils/backgroundUpdater';

export default function BackgroundProvider({ children }) {
    const { 
        backgroundUrl, 
        isInitialized, 
        preloadedImages, 
        nextImagesQueue 
    } = useBackgroundUpdater();
    const [isBlur, setIsBlur] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [nextImageUrl, setNextImageUrl] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState({ current: false, next: false });
    const [fallbackBackgroundUrl, setFallbackBackgroundUrl] = useState(null);

    // Extract file ID from Google Drive URL
    const extractFileId = (url) => {
        if (!url) return null;
        const match = url.match(/\/d\/([a-zA-Z0-9-_]+)|id=([a-zA-Z0-9-_]+)/);
        return match ? (match[1] || match[2]) : null;
    };

    const fileId = extractFileId(backgroundUrl);
    
    // Simple image loading detection without retry
    const checkImageLoad = (url, type) => {
        if (!url) return;
        
        const img = new Image();
        img.onload = () => {
            setImagesLoaded(prev => ({ ...prev, [type]: true }));
        };
        img.onerror = () => {
            setImagesLoaded(prev => ({ ...prev, [type]: false }));
        };
        img.src = url;
    };

    // Preload next image for smooth transition
    useEffect(() => {
        if (nextImagesQueue && nextImagesQueue.length > 0) {
            const nextImage = nextImagesQueue[0];
            if (nextImage && nextImage.url) {
                setNextImageUrl(nextImage.url);
                setImagesLoaded(prev => ({ ...prev, next: false }));
                checkImageLoad(nextImage.url, 'next');
            }
        }
    }, [nextImagesQueue]);

    // Check current image load and maintain fallback
    useEffect(() => {
        if (backgroundUrl) {
            setImagesLoaded(prev => ({ ...prev, current: false }));
            checkImageLoad(backgroundUrl, 'current');
            setFallbackBackgroundUrl(backgroundUrl); // Keep last known good URL
        }
    }, [backgroundUrl]);

    // Simple fade transition logic
    useEffect(() => {
        if (backgroundUrl && nextImageUrl && backgroundUrl !== nextImageUrl) {
            // Start transition immediately for smooth crossfade
            setIsTransitioning(true);
            
            // Switch images after a short delay for smooth crossfade
            const switchTimer = setTimeout(() => {
                setCurrentImageIndex(prev => prev === 0 ? 1 : 0);
                setIsTransitioning(false);
            }, 500);

            return () => {
                clearTimeout(switchTimer);
            };
        }
    }, [backgroundUrl, nextImageUrl]);

    // Only using fade transitions - no cycling needed

    // Generate simple fade transition classes
    const getTransitionClasses = (isActive) => {
        const baseClasses = "absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out";
        const blurClass = isBlur ? 'blur-sm' : '';
        
        return `${baseClasses} ${isActive ? 'opacity-100' : 'opacity-0'} ${blurClass}`;
    };

    // console.log('🎨 BackgroundProvider - backgroundUrl:', backgroundUrl);
    // console.log('🎨 BackgroundProvider - isInitialized:', isInitialized);
    // console.log('🎨 BackgroundProvider - fileId:', fileId);
    // console.log('🎨 BackgroundProvider - nextImageUrl:', nextImageUrl);
    // console.log('🎨 BackgroundProvider - isTransitioning:', isTransitioning);
    // console.log('🎨 BackgroundProvider - transitionType:', transitionType);
    // console.log('🎨 BackgroundProvider - transitionProgress:', transitionProgress);

    const currentFileId = extractFileId(backgroundUrl || fallbackBackgroundUrl);
    const nextFileId = extractFileId(nextImageUrl);

    return (
        <div className="relative min-h-screen">
            {/* Dual background images for smooth transitions */}
            {isInitialized && currentFileId && (
                <div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
                    {/* Current background image */}
                    <div 
                        className={getTransitionClasses(currentImageIndex === 0)}
                        style={{
                            backgroundImage: `url(https://drive.google.com/thumbnail?id=${currentFileId}&sz=w1920-h1080)`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundAttachment: 'fixed'
                        }}
                    />
                    
                    {/* Next background image (preloaded) */}
                    {nextFileId && (
                        <div 
                            className={getTransitionClasses(currentImageIndex === 1)}
                            style={{
                                backgroundImage: `url(https://drive.google.com/thumbnail?id=${nextFileId}&sz=w1920-h1080)`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundAttachment: 'fixed'
                            }}
                        />
                    )}
                </div>
            )}
            
            {/* Transition indicator (optional visual feedback) */}
            {isTransitioning && (
                <div className="fixed top-4 right-4 z-20 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    Fade transition
                </div>
            )}
            
            {/* Loading indicator for failed images */}
            {!imagesLoaded.current && (backgroundUrl || fallbackBackgroundUrl) && (
                <div className="fixed top-4 left-4 z-20 bg-red-500 bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
                    Loading current image...
                </div>
            )}
            
            {!imagesLoaded.next && nextImageUrl && (
                <div className="fixed top-12 left-4 z-20 bg-yellow-500 bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
                    Loading next image...
                </div>
            )}
            
            {/* Fallback indicator */}
            {!backgroundUrl && fallbackBackgroundUrl && (
                <div className="fixed top-20 left-4 z-20 bg-blue-500 bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
                    Using fallback background
                </div>
            )}
            
            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}