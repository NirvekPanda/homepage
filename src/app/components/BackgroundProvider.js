"use client";

import { useBackgroundUpdater } from '../utils/backgroundUpdater';

export default function BackgroundProvider({ children }) {
    const { backgroundUrl, isInitialized } = useBackgroundUpdater();

    // Extract file ID from Google Drive URL
    const extractFileId = (url) => {
        if (!url) return null;
        const match = url.match(/\/d\/([a-zA-Z0-9-_]+)|id=([a-zA-Z0-9-_]+)/);
        return match ? (match[1] || match[2]) : null;
    };

    const fileId = extractFileId(backgroundUrl);
    
    console.log('🎨 BackgroundProvider - backgroundUrl:', backgroundUrl);
    console.log('🎨 BackgroundProvider - isInitialized:', isInitialized);
    console.log('🎨 BackgroundProvider - fileId:', fileId);

    return (
        <div className="relative min-h-screen">
            {/* Background image with high quality */}
            {isInitialized && fileId && (
                <div 
                    className="fixed inset-0 w-full h-full z-0"
                    style={{
                        backgroundImage: `url(https://drive.google.com/thumbnail?id=${fileId}&sz=w4032-h3024)`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundAttachment: 'fixed'
                    }}
                />
            )}
            
            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}