"use client";

import { useState, useEffect } from "react";
import { firestore } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

import ThreeDCarousel from "../components/ThreeDCarousel";

function ProjectCarousel() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsCollection = collection(firestore, "projects"); // Get collection reference
        const querySnapshot = await getDocs(projectsCollection); // Fetch data

        const projectsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProjects(projectsArray);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Transform projects data to match ThreeDCarousel format
  const transformedProjects = projects.map((project, index) => ({
    id: project.id || index,
    title: project.name,
    brand: project.date || "Project",
    description: project.description,
    tags: project.languages?.split(",").map((lang) => lang.trim()) || [],
    imageUrl: project.image || "/project-images/default.jpg",
    link: project.link || "#",
    github: project.github,
    demo: project.demo,
  }));

  return (
    <>
      <div className="flex flex-col items-center">
        <a
          href="https://github.com/NirvekPanda"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-md font-medium transition-all duration-200 bg-[#F5ECD5] text-gray-900 shadow-lg hover:bg-[#E6D4B8] pb-2"
        >
          GitHub
        </a>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 text-xl">
          Loading Projects...
        </div>
      ) : projects.length > 0 ? (
        <ThreeDCarousel 
          items={transformedProjects}
          autoRotate={true}
          rotateInterval={6000}
          cardHeight={400}
        />
      ) : (
        <div className="text-center text-gray-500 mt-4">No projects found.</div>
      )}
    </>
  );
}

export default ProjectCarousel;