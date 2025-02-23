import React from "react";

const Hero = ({ image, title, paragraph }) => {
    return (
        <section className="w-5/6 max-w-3/4 mx-auto flex flex-col md:flex-row bg-white rounded-3xl shadow-lg min-h-[60vh] overflow-hidden border border-gray-400">
            {/* Left half: Image */}
            <div className="md:w-1/2 relative">
                <img
                    src={image}
                    alt="Hero background"
                    className="w-full h-full object-cover rounded-l-3xl"
                />
            </div>

            {/* Right half: Text */}
            <div className="md:w-1/2 p-8 flex flex-col items-center justify-center text-center bg-gray-600 rounded-r-3xl">
                <h1 className="text-3xl font-bold mb-4 text-white">{title}</h1>
                <p className="mb-4 text-gray-200">{paragraph}</p>
            </div>
        </section>
    );
};

export default Hero;
