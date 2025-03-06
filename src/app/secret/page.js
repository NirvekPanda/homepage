import React from 'react';

const SecretPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-start pt-16">
            <iframe
                className="w-3/4 max-w-4xl aspect-video border border-gray-800 rounded-xl shadow-lg"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
};

export default SecretPage;
