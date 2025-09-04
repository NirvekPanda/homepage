import Hero from "./components/hero";
import Footer from "./components/footer";

export default function Home() {
  return (
    
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen pb-20 gap-6 sm:p-16">
      <Hero
        title="Nirvek Pandey"
        paragraph="I am a Nepalese - American student pursuing a Bachelor of Science in Computer Science and Engineering at the University of California, San Diego.
        
        \n
          ★━━━━━━━━━━━★━━━━━━━━━━━★━━━━━━━━━━━★━━━━━━━━━━━★
        \n
        

        I have a background in software development and machine learning, and am interested in pursuing a career at the intersection of distributed systems and machine learning. \n To practice my skills I am working on several projects in my free time. Notably, I am working on the backend of my video blog platform and a multiplayer blackjack game.
        
        \n
          ★━━━━━━━━━━━★━━━━━━━━━━━★━━━━━━━━━━━★━━━━━━━━━━━★
        \n
        
        
        In my free time, I like to hone my cooking skills and travel to new destinations. Most recently I traveled to Europe, with the highlight of my trip being the wonderful city of Barcelona.
        "
        
      />
      <Footer />
    </div>
  );
}
