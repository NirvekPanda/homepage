import Hero from "./components/hero";
import Footer from "./components/footer";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen pb-20 gap-6 sm:p-16 font-[family-name:var(--font-geist-nano)]">
      <Hero
        image="/profile.jpg"
        title="Nirvek Pandey"
        paragraph="I am passionate about exploring new technologies and continuously improving my skills.
          I enjoy working on innovative projects and staying up-to-date with the latest trends in the industry."
      />
      <Footer />
    </div>
  );
}
