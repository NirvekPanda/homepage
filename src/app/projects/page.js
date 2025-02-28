"use client";

import { useState, useEffect } from "react";
import { firestore } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

import Card from "../components/card";
import LinkButton from "../components/button";

function ProjectList() {
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

  return (
    <>
      <div className="flex flex-col items-center mt-6">
        <LinkButton
          text={"GitHub"}
          link={"https://github.com/NirvekPanda"}
          isActive={false}
          className="mt-6"
        />
      </div>

      {loading ? (
        <div className="text-center text-gray-500 mt-4">Loading projects...</div>
      ) : (
        <div className="flex flex-wrap justify-center">
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2 box-border">
                <Card
                  name={project.name}
                  description={project.description}
                  languages={project.languages}
                  image={project.image}
                  link={project.link}
                />
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 mt-4">No projects found.</div>
          )}
        </div>
      )}
    </>
  );
}

export default ProjectList;
