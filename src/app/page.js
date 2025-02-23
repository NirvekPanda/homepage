import Image from "next/image";
import Hero from "./components/hero";


export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen pb-20 gap-6 sm:p-16 font-[family-name:var(--font-geist-nano)]">

      <Hero
        image="/profile.jpg"
        title="Nirvek Pandey"
        paragraph="I am passionate about exploring new technologies and continuously improving my skills.
          I enjoy working on innovative projects and staying up-to-date with the latest trends in the industry."
      />

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.linkedin.com/in/nirvekpandey/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Linkedin
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/NirvekPanda"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          GitHub
        </a>

        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/Nirvek_Pandey_Resume.pdf"
          download
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="Resume icon"
            width={16}
            height={16}
          />
          Resume
        </a>

      </footer>
    </div>
  );
}
