import Image from "next/image";

export default function Footer() {
    return (
        <footer className="text-black flex gap-6 flex-wrap items-center justify-center bg-white/5 backdrop-blur-sm rounded-lg px-4 py-2 mx-auto mb-4 w-fit border-b-2 border-white/30">

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
    );
}
