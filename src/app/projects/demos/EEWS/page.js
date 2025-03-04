import React from 'react';

const TwentyFourtyEight = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
            <header className="mb-4 text-center">
                <h1 className="text-4xl text-white font-bold">Elon Early Warning System</h1>
                <p className="mt-2 text-lg text-gray-300">
                    Stock Prediction and Analysis Tool

                </p>
            </header>
            <main className="w-full max-w-4xl">
                <div className="overflow-hidden rounded-xl shadow-2xl">
                    <iframe
                        className="w-full h-96 md:h-[600px]"
                        src="https://www.darischen.com/projects/eews"
                        title="Elon Early Warning System Demo"
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                </div>
                <p className="mt-4 text-center text-gray-300">
                    Under Development by Daris Chen and Nirvek Pandey<br />
                    Visit the project page at <a href="https://www.darischen.com" className="text-blue-500 underline">darischen.com</a>
                </p>
            </main>
        </div>
    );
};

export default TwentyFourtyEight;
