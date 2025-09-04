// Utility functions for handling image sources

/**
 * Generates a slug from a project name
 * @param {string} projectName - The name of the project
 * @returns {string} - The generated slug
 */
export const generateSlug = (projectName) => {
  return projectName
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

/**
 * Determines the correct image source for project images
 * @param {string} image - The image field from the project data
 * @param {string} name - The project name (used for fallback slug generation)
 * @returns {string} - The image source URL
 */
export const getProjectImageSrc = (image, name) => {
  if (image && image.startsWith('http')) {
    // If image is a URL, use it directly
    return image;
  } else if (image) {
    // If image is a filename, use it as is
    return `/project-images/${image}`;
  } else {
    // Fallback: generate slug from name
    return `/project-images/${generateSlug(name)}.jpg`;
  }
};

/**
 * Gets the blog image source using the slug
 * @param {string} slug - The blog post slug
 * @returns {string} - The blog image source URL
 */
export const getBlogImageSrc = (slug) => {
  return `/blog-images/${slug}.jpg`;
};
