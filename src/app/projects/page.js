import Card from "../components/card";

const proj1 = {
  name: "Test Project",
  description: "This is a project description",
  languages: "Python, JavaScript",
  image: "https://t4.ftcdn.net/jpg/07/71/17/11/360_F_771171175_4hD5F0gFznDfudqIolxHo7If0qa1D6Za.jpg",
  link: "/projects/project1",
};

const proj2 = {
  name: "Parallel Computing Project",
  description: "This is a project description",
  languages: "Python, Java, OpenCL",
  image: "https://cdn.wccftech.com/wp-content/uploads/2024/04/NVIDIA-CUDA.jpg",
  link: "/projects/project2",
};

const proj3 = {
  name: "Deep Learning Project",
  description: "This is a project description",
  languages: "PyGame, PyTorch, Keras, CUDA",
  image: "https://www.imsl.com/sites/default/files/image/2021-01/social-blog-neural-networks-november.jpg",
  link: "/projects/project3",
};

const projects = [proj1, proj2, proj3, proj1, proj2, proj3];

function ProjectList() {
  return (
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
  );
}




function Projects() {
  return ( <ProjectList /> );
  }
  
  export default Projects;
  