"use client"

import { useState, useEffect } from "react";
import Card from "../components/card";
import LinkButton from "../components/button";

// const proj1 = {
//   name: "Test Project",
//   description: "This page is currently a work in progress, for now my projects are available on GitHub.",
//   languages: "Python, JavaScript",
//   image: "https://www.computersciencedegreehub.com/wp-content/uploads/2023/02/shutterstock_535124956-1024x756.jpg",
//   link: "https://github.com/NirvekPanda",
// };

const projectListPath = "/projects/project_list.json";

function ProjectList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(projectListPath);
        if (!response.ok) {
          throw new Error("Failed to fetch project data");
        }
        const data = await response.json();
        setProjects(data); // Set projects state with JSON data
      } catch (error) {
        console.error("Error loading projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="flex flex-wrap justify-center">
      {projects.map((project, index) => (
        <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2 box-border" href={project.link}>
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
  );
}

function Projects() {
  return (
    <>
      <div className="flex flex-col items-center mt-6">
        <LinkButton
          text={"GitHub"}
          link={"https://github.com/NirvekPanda"}
          isActive={false}
          className="my-4"
        />
      </div>

      <ProjectList />
    </>
  );
}

export default Projects;
