"use client";

import { useEffect } from "react";
import Hero from "./components/hero";
import Footer from "./components/footer";
import ProjectCarousel from "./projects/page";
import Resume from "./resume/page";
import ContactMe from "./contact/page";

export default function Home() {
  useEffect(() => {
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, []);

  return (
    <div className="flex flex-col pb-20 lg:pb-0">
      <section 
        id="home" 
        className="flex flex-col items-center justify-start p-2 sm:p-6 lg:p-10 lg:scroll-mt-24"
      >
        <Hero
          title="Nirvek Pandey"
          paragraph="I am a Nepalese - American student pursuing a Bachelor of Science in Computer Science and Engineering at the University of California, San Diego.
          
          \n
            ★━━━━━━━━━━━★━━━━━━━━━━━★━━━━━━━━━━━★
          \n
          

          I have a background in software development and machine learning, and am interested in pursuing a career at the intersection of distributed systems and machine learning. \n To practice my skills I am working on several projects in my free time. Notably, I am working on the backend of my video blog platform and a multiplayer blackjack game.
          
          \n
            ★━━━━━━━━━━━★━━━━━━━━━━━★━━━━━━━━━━━★
          \n
          
          
          In my free time, I like to hone my cooking skills and travel to new destinations. Most recently I traveled to Europe, with the highlight of my trip being the wonderful city of Barcelona.
          "
        />
      </section>

      <section 
        id="projects" 
        className="flex flex-col scroll-mt-32"
      >
        <ProjectCarousel />
      </section>

      <section 
        id="resume" 
        className="flex flex-col scroll-mt-32"
      >
        <Resume />
      </section>

      <section 
        id="contact" 
        className="flex flex-col scroll-mt-32"
      >
        <ContactMe />
      </section>
    
        <Footer> </Footer>
      
    </div>
  );
}
