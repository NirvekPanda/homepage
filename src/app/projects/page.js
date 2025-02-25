"use client";

import { useState, useEffect } from "react";
import { db, ref, get } from "../firebaseConfig";
import Card from "../components/card";
import LinkButton from "../components/button";

function ProjectList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const dbRef = ref(db, "projects"); // 'projects' is the path in Firebase DB
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
          setProjects(Object.values(snapshot.val())); // Convert object to array
        } else {
          console.log("No projects found");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
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

      <div className="flex flex-wrap justify-center">
        {projects.map((project, index) => (
          <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2 box-border">
            <Card
              name={project.name}
              description={project.description}
              languages={project.languages}
              image={project.image}
              link={project.link}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default ProjectList;