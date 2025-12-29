"use client";

import { useBackgroundContext } from '../contexts/BackgroundContext';

export default function BackgroundProvider({ children }) {
    const { 
        displayUrl, 
        extractFileId, 
        isInitialized, 
        isTransitioning, 
        imageLoaded 
    } = useBackgroundContext();

    const displayFileId = extractFileId(displayUrl);

    return (
        <div className="relative min-h-screen">
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
            
            
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}