"use client";

import React, {
  useRef,
  useEffect,
  useState,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "./card";
import CardModal from "./cardModal";
import BlogModal from "./blogModal";

export const ThreeDCarouselItem = {
  id: Number,
  title: String,
  brand: String,
  description: String,
  tags: Array,
  imageUrl: String,
  link: String,
};

const ThreeDCarousel = ({
  items,
  autoRotate = true,
  rotateInterval = 4000,
  cardHeight = 500,
  title = "From Textile to Intelligence",
  subtitle = "Customer Cases",
  tagline = "Explore how our textile sensor technology is revolutionizing multiple industries with intelligent fabric solutions tailored to specific needs.",
  isMobileSwipe = true,
  contentType = "project", // "project" or "blog"
}) => {
  const [active, setActive] = useState(0);
  const carouselRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const isMobile = window.innerWidth < 768;
  const minSwipeDistance = 50;

  useEffect(() => {
    if (autoRotate && isInView && !isHovering) {
      const interval = setInterval(() => {
        setActive((prev) => (prev + 1) % items.length);
      }, rotateInterval);
      return () => clearInterval(interval);
    }
  }, [isInView, isHovering, autoRotate, rotateInterval, items.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const onTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      setActive((prev) => (prev + 1) % items.length);
    } else if (distance < -minSwipeDistance) {
      setActive((prev) => (prev - 1 + items.length) % items.length);
    }
  };

    const getCardAnimationClass = (index) => {
    if (index === active) return "scale-100 opacity-100 z-20";
    if (index === (active + 1) % items.length)
      return "translate-x-[45%] scale-100 opacity-100 z-15";
    if (index === (active - 1 + items.length) % items.length)
      return "translate-x-[-45%] scale-100 opacity-100 z-15";
    if (index === (active + 2) % items.length)
      return "translate-x-[90%] scale-75 opacity-80 z-5";
    if (index === (active - 2 + items.length) % items.length)
      return "translate-x-[-90%] scale-75 opacity-80 z-5";
    return "scale-90 opacity-0";
  };

  const handleCardClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <section
      id="ThreeDCarousel"
      className="p-4 bg-transparent min-w-full mx-auto 
    flex items-center justify-center"
    >
      <div
        className="w-full px-4 sm:px-6 lg:px-8 
      min-w-[350px] md:min-w-[1000px] lg:max-w-8xl"
      >
        <div
          className="relative overflow-hidden h-[420px]"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          ref={carouselRef}
        >
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`absolute top-0 w-full max-w-sm md:max-w-md transform transition-all duration-700 ${getCardAnimationClass(
                  index
                )}`}
              >
                <Card
                  name={item.title}
                  description={item.description}
                  languages={item.tags?.join(", ") || ""}
                  image={item.imageUrl}
                  link={item.link}
                  date={item.publishedAt || item.brand}
                  code={item.github}
                  github={item.github}
                  demo={item.demo}
                  onClick={() => handleCardClick(item)}
                  excerpt={item.excerpt}
                  showDate={contentType === "blog"}
                  isActive={index === active}
                />
              </div>
            ))}
          </div>

          {!isMobile && (
            <>
              <button
                className="absolute right-3/4 -translate-x-32 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-500 hover:bg-white z-30 shadow-md transition-all hover:scale-110"
                onClick={() =>
                  setActive((prev) => (prev - 1 + items.length) % items.length)
                }
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                className="absolute left-3/4 translate-x-32 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-500 hover:bg-white z-30 shadow-md transition-all hover:scale-110"
                onClick={() => setActive((prev) => (prev + 1) % items.length)}
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center space-x-3 z-30">
            {items.map((_, idx) => (
              <button
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  active === idx
                    ? "bg-gray-500 w-5"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => setActive(idx)}
                aria-label={`Go to item ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal Component */}
      {selectedProject && (
        contentType === "blog" ? (
          <BlogModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            title={selectedProject.title}
            content={selectedProject.content}
            excerpt={selectedProject.description}
            publishedAt={selectedProject.publishedAt}
            slug={selectedProject.slug}
          />
        ) : (
          <CardModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            name={selectedProject.title}
            description={selectedProject.description}
            image={selectedProject.imageUrl}
            link={selectedProject.link}
            date={selectedProject.brand}
            code={selectedProject.github}
            github={selectedProject.github}
            demo={selectedProject.demo}
            languages={selectedProject.tags}
          />
        )
      )}
    </section>
  );
};

export default ThreeDCarousel;
