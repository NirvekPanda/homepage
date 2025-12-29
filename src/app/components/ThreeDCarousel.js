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

const CATEGORIES = ["game", "research", "github", "industry", "miscellaneous"];

const ThreeDCarousel = ({
  items,
  autoRotate = true,
  rotateInterval = 4000,
  cardHeight = 500,
  title = "From Textile to Intelligence",
  subtitle = "Customer Cases",
  tagline = "Explore how our textile sensor technology is revolutionizing multiple industries with intelligent fabric solutions tailored to specific needs.",
  isMobileSwipe = true,
  contentType = "project",
  showCategoryNav = true,
}) => {
  const [active, setActive] = useState(0);
  const carouselRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);
  const isMobile = window.innerWidth < 768;
  const minSwipeDistance = 50;

  const filteredItems = filterCategory
    ? items.filter(item => (item.category?.toLowerCase() || "miscellaneous") === filterCategory)
    : items;

  useEffect(() => {
    setActive(0);
  }, [filterCategory]);

  useEffect(() => {
    if (autoRotate && isInView && !isHovering && !isModalOpen && filteredItems.length > 0) {
      const interval = setInterval(() => {
        setActive((prev) => (prev + 1) % filteredItems.length);
      }, rotateInterval);
      return () => clearInterval(interval);
    }
  }, [isInView, isHovering, isModalOpen, autoRotate, rotateInterval, filteredItems.length]);

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
      setActive((prev) => (prev + 1) % filteredItems.length);
    } else if (distance < -minSwipeDistance) {
      setActive((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    }
  };

    const getCardAnimationClass = (index) => {
    const len = filteredItems.length;
    if (index === active) return "scale-100 opacity-100 z-40";
    if (index === (active + 1) % len)
      return "translate-x-[45%] scale-90 opacity-100 z-20";
    if (index === (active - 1 + len) % len)
      return "translate-x-[-45%] scale-90 opacity-100 z-20";
    if (index === (active + 2) % len)
      return "translate-x-[90%] scale-75 opacity-100 z-10";
    if (index === (active - 2 + len) % len)
      return "translate-x-[-90%] scale-75 opacity-100 z-10";
    return "scale-90 opacity-50 z-10";
  };

  const handleCardClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const getCurrentProjectIndex = () => {
    if (!selectedProject) return -1;
    return filteredItems.findIndex(item => item.id === selectedProject.id);
  };

  const handleModalPrevious = () => {
    const currentIndex = getCurrentProjectIndex();
    if (currentIndex > 0) {
      const prevProject = filteredItems[currentIndex - 1];
      setSelectedProject(prevProject);
      setActive(currentIndex - 1);
    }
  };

  const handleModalNext = () => {
    const currentIndex = getCurrentProjectIndex();
    if (currentIndex < filteredItems.length - 1) {
      const nextProject = filteredItems[currentIndex + 1];
      setSelectedProject(nextProject);
      setActive(currentIndex + 1);
    }
  };

  const activeCategory = filteredItems[active]?.category?.toLowerCase() || "miscellaneous";
  const activeCategoryIndex = CATEGORIES.indexOf(activeCategory);
  
  const filterCategoryIndex = filterCategory ? CATEGORIES.indexOf(filterCategory) : -1;
  const categoryRefs = useRef([]);

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    const targetIndex = filterCategory !== null ? filterCategoryIndex : activeCategoryIndex;
    
    if (targetIndex >= 0 && categoryRefs.current[targetIndex]) {
      const activeEl = categoryRefs.current[targetIndex];
      setIndicatorStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        opacity: 1,
      });
    }
  }, [filterCategory, filterCategoryIndex, activeCategoryIndex, active]);

  const handleCategoryToggle = (category) => {
    if (filterCategory === category) {
      setFilterCategory(null);
    } else {
      setFilterCategory(category);
    }
  };

  return (
    <section
      id="ThreeDCarousel"
      className="p-4 bg-transparent min-w-full mx-auto 
    flex flex-col items-center justify-center"
    >
      {showCategoryNav && contentType === "project" && (
        <div className="flex items-center justify-center mb-6">
          <div className="relative bg-white/25 dark:bg-black/25 backdrop-blur-sm rounded-lg p-1 flex gap-1 border border-white/30 dark:border-gray-700/30 transition-all duration-200">
            <div
              className="absolute top-1 bottom-1 bg-white/90 dark:bg-black/50 dark:border dark:border-gray-600/50 rounded-md shadow-lg transition-all duration-300 ease-in-out"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
                opacity: indicatorStyle.opacity,
              }}
            />
            {CATEGORIES.map((category, index) => {
              const isGitHub = category === "github";
              const isToggled = filterCategory === category;
              const isActiveCategory = activeCategory === category && filterCategory === null;
              const isHighlighted = isToggled || isActiveCategory;
              
              return isGitHub ? (
                <a
                  key={category}
                  ref={(el) => (categoryRefs.current[index] = el)}
                  href="https://github.com/NirvekPanda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 px-6 py-3 rounded-md font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 cursor-pointer text-black dark:text-white hover:bg-white/40 dark:hover:bg-black/40"
                >
                  GitHub
                </a>
              ) : (
                <button
                  key={category}
                  ref={(el) => (categoryRefs.current[index] = el)}
                  className={`relative z-10 px-6 py-3 rounded-md font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 cursor-pointer capitalize
                    ${isHighlighted 
                      ? "text-gray-900 dark:text-white" 
                      : "text-black dark:text-white hover:bg-white/40 dark:hover:bg-black/40"
                    }`}
                  onClick={() => handleCategoryToggle(category)}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      )}

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
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`absolute top-0 w-full max-w-sm md:max-w-md transform transition-all duration-700 ${getCardAnimationClass(
                    index
                  )}`}
                >
                  <Card
                    projectId={item.id}
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
                    category={item.category}
                  />
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                No projects in this category yet.
              </div>
            )}
          </div>

          {!isMobile && filteredItems.length > 1 && (
            <>
              <button
                className="absolute right-3/4 -translate-x-32 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-500 hover:bg-white z-30 shadow-md transition-all hover:scale-110"
                onClick={() =>
                  setActive((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
                }
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                className="absolute left-3/4 translate-x-32 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-500 hover:bg-white z-30 shadow-md transition-all hover:scale-110"
                onClick={() => setActive((prev) => (prev + 1) % filteredItems.length)}
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center space-x-3 z-30">
            {filteredItems.map((_, idx) => (
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
            projectId={selectedProject.id}
            name={selectedProject.title}
            description={selectedProject.description}
            image={selectedProject.imageUrl}
            link={selectedProject.link}
            date={selectedProject.brand}
            code={selectedProject.github}
            github={selectedProject.github}
            demo={selectedProject.demo}
            languages={selectedProject.tags}
            category={selectedProject.category}
            onPrevious={handleModalPrevious}
            onNext={handleModalNext}
            hasPrevious={getCurrentProjectIndex() > 0}
            hasNext={getCurrentProjectIndex() < filteredItems.length - 1}
          />
        )
      )}
    </section>
  );
};

export default ThreeDCarousel;
