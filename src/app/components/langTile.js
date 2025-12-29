"use client";
import { useState } from "react";
import { usePopover } from "../contexts/PopoverContext";

const languageMap = {
    "JavaScript": { "color": "bg-yellow-600", "title": "Web Development", "description": "a dynamic, weakly typed programming language primarily used to add interactivity to websites." },
    "Python": { "color": "bg-cyan-900", "title": "High Level Scripting", "description": "a high-level programming language known for its readability and ease of use." },
    "Java": { "color": "bg-red-500", "title": "Object-Oriented Programming", "description": "a class-based, object-oriented programming language used for building enterprise-level applications." },
    "HTML": { "color": "bg-rose-600", "title": "Markup Language", "description": "a markup language used for creating the structure of web pages." },
    "CSS": { "color": "bg-pink-600", "title": "Styling Language", "description": "a styling language used for designing the layout of web pages." },
    "Django": { "color": "bg-orange-500", "title": "Web Framework", "description": "a high-level Python web framework used for rapid development." },
    "Flask": { "color": "bg-orange-700", "title": "Micro Web Framework", "description": "a lightweight Python web framework used for building web applications." },
    "Next.js": { "color": "bg-orange-500", "title": "React Framework", "description": "a React framework used for building server-side rendered applications." },
    "React": { "color": "bg-orange-500", "title": "Component Library", "description": "a JavaScript library used for building user interfaces." },
    "Express.js": { "color": "bg-lime-500", "title": "Web Application Framework", "description": "a Node.js framework used for building web applications and APIs." },
    "Golang": { "color": "bg-cyan-500", "title": "Go Programming Language", "description": "a statically typed, compiled programming language designed at Google." },
    "Go": { "color": "bg-cyan-500", "title": "Go Programming Language", "description": "a statically typed, compiled programming language designed at Google." },
    "SQL": { "color": "bg-blue-500", "title": "Structured Query Language", "description": "a domain-specific language used in programming and designed for managing data held in a relational database management system." },
    "PostgreSQL": { "color": "bg-blue-500", "title": "Relational Database Management System", "description": "a powerful, open source object-relational database system that uses and extends the SQL language combined with many features that safely store and scale the most complicated data workloads." },
    "SQLite": { "color": "bg-blue-500", "title": "Relational Database Management System", "description": "a relational database management system implemented in a C programming language." },
    "MySQL": { "color": "bg-blue-500", "title": "Relational Database Management System", "description": "a relational database management system based on the SQL language." },
    "gRPC": { "color": "bg-lime-600", "title": "Remote Procedure Call", "description": "a remote procedure call framework that allows for communication between distributed systems." },
    
    "etcd": { "color": "bg-blue-300", "title": "Distributed Key-Value Store", "description": "a distributed key-value store that provides a reliable way to store and retrieve data across a cluster of machines." },
    "AWS EC2": { "color": "bg-orange-500", "title": "Cloud Computing Service", "description": "a web service that provides resizable compute capacity in the cloud." },
    "AWS S3": { "color": "bg-orange-300", "title": "Cloud Storage Service", "description": "a storage service that provides object storage through a web service interface." },
    "AWS Lambda": { "color": "bg-orange-400", "title": "Serverless Computing Service", "description": "a service that allows you to run code without provisioning or managing servers." },

    "Numpy": { "color": "bg-blue-500", "title": "Numerical Computing Package", "description": "a Python library used for numerical computing and working with arrays." },
    "Pandas": { "color": "bg-blue-600", "title": "Data Manipulation Package", "description": "a Python library used for data manipulation and analysis." },
    "Scipy": { "color": "bg-blue-500", "title": "Scientific Computing Package", "description": "a Python library used for scientific and technical computing." },
    "matplotlib": { "color": "bg-pink-400", "title": "Data Visualization Library", "description": "a Python library used for creating static, animated, and interactive visualizations." },
    "Seaborn": { "color": "bg-pink-500", "title": "Data Visualization Library", "description": "a Python library used for creating informative and attractive statistical graphics." },
    "OpenCV": { "color": "bg-green-500", "title": "Computer Vision Library", "description": "an open-source computer vision and machine learning software library." },
    "TSFresh": { "color": "bg-green-500", "title": "Time Series Feature Extraction", "description": "a Python library used for automatic time series feature extraction." },
    "Scikit-Learn": { "color": "bg-orange-400", "title": "Machine Learning Library", "description": "a Python library used for machine learning and data mining." },
    "TensorFlow": { "color": "bg-purple-600", "title": "Machine Learning Library", "description": "an open-source machine learning library used for numerical computations." },
    "PyTorch": { "color": "bg-red-600", "title": "Deep Learning Library", "description": "an open-source machine learning library used for developing deep learning models." },
    "Keras": { "color": "bg-purple-300", "title": "Neural Network Library", "description": "a high-level neural networks API used for building deep learning models." },
    "Transformers": { "color": "bg-purple-600", "title": "Natural Language Processing", "description": "a library used for natural language processing and understanding." },
    "LLMs": { "color": "bg-purple-500", "title": "Language Models", "description": "a type of natural language processing model used for understanding and generating human language." },
    "Pygame": { "color": "bg-lime-700", "title": "Game Development Package", "description": "a set of Python modules designed for writing video games." },
    "Pybag": { "color": "bg-teal-600", "title": "Game Development Package", "description": "a set of Python modules designed for writing video games." },
    "Git": { "color": "bg-slate-500", "title": "Version Control System", "description": "a distributed version control system used for tracking changes in source code." },
    "GitHub Actions": { "color": "bg-slate-600", "title": "CI/CD Tool", "description": "a tool used for automating workflows in the software development process." },
    "Junit": { "color": "bg-lime-800", "title": "Unit Testing Framework", "description": "a unit testing framework for the Java programming language." },
    "Jest": { "color": "bg-rose-700", "title": "Testing Framework", "description": "a JavaScript testing framework used for testing JavaScript code." },
    "Puppeteer": { "color": "bg-rose-400", "title": "Headless Browser Testing", "description": "a Node library used for controlling headless Chrome and Chromium." },
    "ESlint": { "color": "bg-rose-500", "title": "Code Quality Tool", "description": "a tool used for identifying and reporting on patterns found in JavaScript code." },
    "Node.js": { "color": "bg-lime-600", "title": "Server-Side JavaScript", "description": "a JavaScript runtime built on Chrome's V8 JavaScript engine." },
    "MongoDB": { "color": "bg-emerald-400", "title": "NoSQL Database", "description": "a document-based NoSQL database used for storing data in JSON-like documents." },
    "Firebase": { "color": "bg-rose-600", "title": "Development Platform & Server", "description": "a platform developed by Google for creating and deploying applications." },
    "Vercel": { "color": "bg-violet-600", "title": "Deployment Platform", "description": "a cloud platform used for deploying serverless functions and static websites." },
    "Tailwind CSS": { "color": "bg-sky-400", "title": "CSS Framework", "description": "a utility-first CSS framework used to build custom designs quickly." },
    "Miro": { "color": "bg-yellow-400", "title": "Online Collaboration Tool", "description": "a visual collaboration platform used for online meetings and brainstorming." },
    "Figma": { "color": "bg-yellow-300", "title": "Design Tool", "description": "a cloud-based design tool used for creating user interfaces and prototypes." },
    "CUDA": { "color": "bg-emerald-600", "title": "Parallel Computing Platform", "description": "a parallel computing platform for Nvidia GPUs." },
    "cuDNN": { "color": "bg-emerald-600", "title": "Deep Neural Network Library", "description": "a GPU-accelerated library for deep neural networks." }
};

export default function LanguageTile({ language }) {
    const { showPopover, hidePopover, isPopoverActive } = usePopover();
    const popoverId = `popover-${language}`;

    const langData = languageMap[language] ? {
        name: language,
        ...languageMap[language]
    } : {
        name: language,
        color: "bg-gray-500",
        title: "Unknown",
        description: "No information available for this tool.",
    };

    return (
        <div
            className="relative flex items-center justify-center"
            onMouseEnter={(e) => {
                e.stopPropagation();
                showPopover(popoverId);
            }}
            onMouseLeave={(e) => {
                e.stopPropagation();
                hidePopover();
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className={`px-3 py-1 text-white text-sm rounded-md ${langData.color} cursor-pointer`}>
                {langData.name}
            </div>

            {isPopoverActive(popoverId) && (
                <div
                    className="absolute z-10 bottom-14 left-1/2 transform -translate-x-1/2 w-48 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg shadow-lg dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800 opacity-100 transition-opacity duration-300"
                >
                    <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700 text-center">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{langData.title}</h3>
                    </div>

                    <div className="px-3 py-2 text-center">
                        <p>{langData.description}</p>
                    </div>

                    <div className="absolute left-1/2 -bottom-2 w-3 h-3 rotate-45 bg-white border border-gray-200 dark:border-gray-600 dark:bg-gray-800 transform -translate-x-1/2"></div>
                </div>
            )}
        </div>
    );
}