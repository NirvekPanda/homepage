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
        const projectsCollection = collection(firestore, "projects");
        const querySnapshot = await getDocs(projectsCollection);

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
    category: project.category || "miscellaneous",
  }));

  return (
    <>
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