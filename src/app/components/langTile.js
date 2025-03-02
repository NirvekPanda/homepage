"use client";
import { useState } from "react";

const languageMap = [
    // Programming Languages 
    { name: "JavaScript", color: "bg-yellow-600", title: "Web Development", description: "a dynamic, weakly typed programming language primarily used to add interactivity to websites." },
    { name: "Python", color: "bg-cyan-900", title: "High Level Scripting", description: "a high-level programming language known for its readability and ease of use." },
    { name: "Java", color: "bg-red-500", title: "Object-Oriented Programming", description: "a class-based, object-oriented programming language used for building enterprise-level applications." },
    { name: "HTML", color: "bg-rose-600", title: "Markup Language", description: "a markup language used for creating the structure of web pages." },
    { name: "CSS", color: "bg-pink-600", title: "Styling Language", description: "a styling language used for designing the layout of web pages." },

    // Frameworks & Libraries
    { name: "Django", color: "bg-orange-500", title: "Web Framework", description: "a high-level Python web framework used for rapid development." },
    { name: "Flask", color: "bg-orange-700", title: "Micro Web Framework", description: "a lightweight Python web framework used for building web applications." },
    { name: "Next.js", color: "bg-orange-500", title: "React Framework", description: "a React framework used for building server-side rendered applications." },
    { name: "React", color: "bg-orange-500", title: "Component Library", description: "a JavaScript library used for building user interfaces." },
    { name: "Express.js", color: "bg-lime-500", title: "Web Application Framework", description: "a Node.js framework used for building web applications and APIs." },

    // Data Science 
    { name: "Numpy", color: "bg-blue-500", title: "Numerical Computing Package", description: "a Python library used for numerical computing and working with arrays." },
    { name: "Pandas", color: "bg-blue-600", title: "Data Manipulation Package", description: "a Python library used for data manipulation and analysis." },
    { name: "Scipy", color: "bg-blue-500", title: "Scientific Computing Package", description: "a Python library used for scientific and technical computing." },

    // Data Visualization 
    { name: "matplotlib", color: "bg-pink-400", title: "Data Visualization Library", description: "a Python library used for creating static, animated, and interactive visualizations." },
    { name: "Seaborn", color: "bg-pink-500", title: "Data Visualization Library", description: "a Python library used for creating informative and attractive statistical graphics." },

    // Multimodal Preprocessing 
    { name: "OpenCV", color: "bg-green-500", title: "Computer Vision Library", description: "an open-source computer vision and machine learning software library." },
    { name: "TSFresh", color: "bg-green-500", title: "Time Series Feature Extraction", description: "a Python library used for automatic time series feature extraction." },

    // Machine Learning 
    { name: "Scikit-Learn", color: "bg-orange-400", title: "Machine Learning Library", description: "a Python library used for machine learning and data mining." },
    { name: "TensorFlow", color: "bg-purple-600", title: "Machine Learning Library", description: "an open-source machine learning library used for numerical computations." },
    { name: "PyTorch", color: "bg-red-600", title: "Deep Learning Library", description: "an open-source machine learning library used for developing deep learning models." },
    { name: "Keras", color: "bg-purple-300", title: "Neural Network Library", description: "a high-level neural networks API used for building deep learning models." },
    { name: "Transformers", color: "bg-purple-600", title: "Natural Language Processing", description: "a library used for natural language processing and understanding." },
    { name: "LLMs", color: "bg-purple-500", title: "Language Models", description: "a type of natural language processing model used for understanding and generating human language." },

    // Game Development 
    { name: "Pygame", color: "bg-lime-700", title: "Game Development Package", description: "a set of Python modules designed for writing video games." },
    { name: "Pybag", color: "bg-teal-600", title: "Game Development Package", description: "a set of Python modules designed for writing video games." },

    // DevOps, CI/CD, and Testing 
    { name: "Git", color: "bg-slate-700", title: "Version Control System", description: "a distributed version control system used for tracking changes in source code." },
    { name: "GitHub Actions", color: "bg-slate-600", title: "CI/CD Tool", description: "a tool used for automating workflows in the software development process." },

    // Testing 
    { name: "Junit", color: "bg-lime-800", title: "Unit Testing Framework", description: "a unit testing framework for the Java programming language." },
    { name: "Jest", color: "bg-rose-700", title: "Testing Framework", description: "a JavaScript testing framework used for testing JavaScript code." },
    { name: "Puppeteer", color: "bg-rose-400", title: "Headless Browser Testing", description: "a Node library used for controlling headless Chrome and Chromium." },
    { name: "ESlint", color: "bg-rose-500", title: "Code Quality Tool", description: "a tool used for identifying and reporting on patterns found in JavaScript code." },

    // Backend & Databases
    { name: "Node.js", color: "bg-lime-600", title: "Server-Side JavaScript", description: "a JavaScript runtime built on Chrome's V8 JavaScript engine." },
    { name: "MongoDB", color: "bg-emerald-400", title: "NoSQL Database", description: "a document-based NoSQL database used for storing data in JSON-like documents." },
    { name: "Firebase", color: "bg-rose-600", title: "Development Platform & Server", description: "a platform developed by Google for creating and deploying applications." },

    // Deployment & Hosting
    { name: "Vercel", color: "bg-violet-600", title: "Deployment Platform", description: "a cloud platform used for deploying serverless functions and static websites." },

    // Design & Collaboration Tools
    { name: "Tailwind CSS", color: "bg-sky-400", title: "CSS Framework", description: "a utility-first CSS framework used to build custom designs quickly." },
    { name: "Miro", color: "bg-yellow-400", title: "Online Collaboration Tool", description: "a visual collaboration platform used for online meetings and brainstorming." },
    { name: "Figma", color: "bg-yellow-300", title: "Design Tool", description: "a cloud-based design tool used for creating user interfaces and prototypes." },

    // Hardware & Parallel Computing
    { name: "CUDA", color: "bg-emerald-600", title: "Parallel Computing Platform", description: "a parallel computing platform for Nvidia GPUs." },
    { name: "cuDNN", color: "bg-emerald-600", title: "Deep Neural Network Library", description: "a GPU-accelerated library for deep neural networks." }
];



export default function LanguageTile({ language }) {
    const [showPopover, setShowPopover] = useState(false);

    // Find the language in the map, or set to default gray if not found
    const langData = languageMap.find((lang) => lang.name === language) || {
        name: language,
        color: "bg-gray-500",
        title: "Unknown",
        description: "No information available for this tool.",
    };

    return (
        <div
            className="relative flex items-center justify-center"
            onMouseEnter={() => setShowPopover(true)}
            onMouseLeave={() => setShowPopover(false)}
        >
            {/* Language Tile */}
            <div className={`px-3 py-1 text-white text-sm rounded-md ${langData.color} cursor-pointer`}>
                {langData.name}
            </div>

            {/* Popover */}
            {showPopover && (
                <div
                    className="absolute z-10 bottom-14 left-1/2 transform -translate-x-1/2 w-48 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg shadow-lg dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800 opacity-100 transition-opacity duration-300"
                >
                    {/* Popover Title */}
                    <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700 text-center">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{langData.title}</h3>
                    </div>

                    {/* Popover Content */}
                    <div className="px-3 py-2">
                        <p>{langData.description}</p>
                    </div>

                    {/* Popover Arrow */}
                    <div className="absolute left-1/2 -bottom-2 w-3 h-3 rotate-45 bg-white border border-gray-200 dark:border-gray-600 dark:bg-gray-800 transform -translate-x-1/2"></div>
                </div>
            )}
        </div>
    );
}