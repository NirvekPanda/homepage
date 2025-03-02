import React from 'react';

import { useState, useEffect } from 'react';

// Set up pygame demo for 2048 game play

const TwentyFourtyEight = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/api/2048')
            .then(res => res.json())
            .then(data => {
                setMessage(data.message);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <>
            <h1 className="text-4xl text-center text-white font-bold mt-10">
                {message} is still under construction. Please check back later!
            </h1>
            <div className="flex justify-center items-center min-h-screen">


                <iframe
                    className="w-3/4 max-w-4xl aspect-video border border-gray-800 rounded-xl shadow-lg"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </>
    );
};

export default TwentyFourtyEight;
