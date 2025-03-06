import React from 'react';

const Blackjack = () => {
    return (
        <div className="flex items-center justify-center h-screen p-4">
            <div className="w-4/5 h-4/5 flex flex-col items-center justify-center">
                <h1 className="text-2xl sm:text-4xl text-center text-white font-bold mb-4">
                    This page is still under construction. Please check back later!
                </h1>
                <iframe
                    className="w-full h-full border border-gray-800 rounded-xl shadow-lg"
                    src="https://blackjack-nda.vercel.app/"
                    title="Demo BlackJack Game"
                    frameBorder="0"
                ></iframe>
            </div>
        </div>
    );
};

export default Blackjack;
