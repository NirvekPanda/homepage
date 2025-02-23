import React from 'react';

const Hero = ({ image, title, paragraph }) => {
    return (
        <section className="flex flex-col md:flex-row bg-white rounded-lg shadow-md min-h-[60vh]">
            {/* Left half: Image */}
            <div className="md:w-1/2 relative">
                <img
                    src={image}
                    alt="Hero background"
                    className="w-full h-full object-cover rounded-l-lg"
                    style={{
                        /* Creates a small directional shadow at the bottom-right */
                        boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.2)'
                    }}
                />
            </div>

            {/* Right half: Text */}
            <div className="md:w-1/2 p-8 flex flex-col items-center justify-center text-center bg-gray-600 rounded-r-lg">
                <h1 className="text-3xl font-bold mb-4">
                    {title}
                </h1>
                <p className="mb-4">
                    {paragraph}
                </p>

            </div>
        </section>
    );
};

export default Hero;
