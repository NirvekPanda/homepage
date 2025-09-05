import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from '../../page'
import Hero from '../../components/hero'
import Footer from '../../components/footer'

describe('Home Page Integration', () => {
  describe('Page Structure Integration', () => {
    test('Home page renders with correct layout structure', () => {
      render(<Home />)
      
      // Main container should have correct grid layout
      const mainContainer = document.querySelector('.grid.grid-rows-\\[auto_1fr_auto\\]')
      expect(mainContainer).toHaveClass(
        'grid', 'grid-rows-[auto_1fr_auto]', 'items-center', 
        'justify-items-center', 'min-h-screen', 'pb-20', 'gap-6', 'sm:p-16'
      )
    })

    test('Home page contains Hero component', () => {
      render(<Home />)
      
      // Hero component should be present
      expect(screen.getByText('Nirvek Pandey')).toBeInTheDocument()
      expect(screen.getByText(/I am a Nepalese - American student/)).toBeInTheDocument()
    })

    test('Home page layout is responsive', () => {
      render(<Home />)
      
      const mainContainer = document.querySelector('.grid.grid-rows-\\[auto_1fr_auto\\]')
      expect(mainContainer).toHaveClass('sm:p-16')
    })
  })

  describe('Hero Component Integration', () => {
    test('Hero component receives correct props', () => {
      render(<Home />)
      
      // Check title
      expect(screen.getByText('Nirvek Pandey')).toBeInTheDocument()
      
      // Check paragraph content
      expect(screen.getByText(/I am a Nepalese - American student/)).toBeInTheDocument()
      expect(screen.getByText(/University of California, San Diego/)).toBeInTheDocument()
    })

    test('Hero component renders with correct styling', () => {
      render(<Home />)
      
      const heroTitle = screen.getByText('Nirvek Pandey')
      const heroContainer = heroTitle.closest('div')
      
      // Hero should be in a flex container
      expect(heroContainer).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center')
    })

    test('Hero component contains decorative elements', () => {
      render(<Home />)
      
      // Check for decorative stars in the paragraph (there should be 2 instances)
      const decorativeStars = screen.getAllByText(/★━━━━━━━━━━━★━━━━━━━━━━━★━━━━━━━━━━━★━━━━━━━━━━━★/)
      expect(decorativeStars).toHaveLength(2)
    })
  })

  describe('Footer Component Integration', () => {
    test('Footer component is rendered with correct links', () => {
      render(<Home />)
      
      // Footer should be present with correct links
      expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /resume/i })).toBeInTheDocument()
    })

    test('Footer links have correct attributes', () => {
      render(<Home />)
      
      const linkedinLink = screen.getByRole('link', { name: /linkedin/i })
      const githubLink = screen.getByRole('link', { name: /github/i })
      const resumeLink = screen.getByRole('link', { name: /resume/i })
      
      expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/nirvekpandey/')
      expect(githubLink).toHaveAttribute('href', 'https://github.com/NirvekPanda')
      expect(resumeLink).toHaveAttribute('href', '/Nirvek_Pandey_Resume.pdf')
    })

    test('Footer structure is maintained in grid layout', () => {
      render(<Home />)
      
      // The grid structure should accommodate footer space
      const mainContainer = document.querySelector('.grid.grid-rows-\\[auto_1fr_auto\\]')
      expect(mainContainer).toHaveClass('grid-rows-[auto_1fr_auto]')
    })
  })

  describe('Content Integration', () => {
    test('All main content sections are present', () => {
      render(<Home />)
      
      // Personal introduction
      expect(screen.getByText(/Nepalese - American student/)).toBeInTheDocument()
      expect(screen.getByText(/University of California, San Diego/)).toBeInTheDocument()
      
      // Professional background
      expect(screen.getByText(/software development and machine learning/)).toBeInTheDocument()
      expect(screen.getByText(/distributed systems and machine learning/)).toBeInTheDocument()

    })

    test('Content formatting is preserved', () => {
      render(<Home />)
      
      // Check that line breaks and formatting are maintained
      const paragraph = screen.getByText(/I am a Nepalese - American student/)
      expect(paragraph).toBeInTheDocument()
      
      // Check for decorative separators
      const separators = screen.getAllByText(/★━━━━━━━━━━━★━━━━━━━━━━━★━━━━━━━━━━━★━━━━━━━━━━━★/)
      expect(separators).toHaveLength(2)
    })
  })

  describe('Layout Responsiveness Integration', () => {
    test('Grid layout adapts to different screen sizes', () => {
      render(<Home />)
      
      const mainContainer = document.querySelector('.grid.grid-rows-\\[auto_1fr_auto\\]')
      
      // Should have responsive padding
      expect(mainContainer).toHaveClass('sm:p-16')
      
      // Should have responsive gap
      expect(mainContainer).toHaveClass('gap-6')
    })

    test('Content is centered and properly spaced', () => {
      render(<Home />)
      
      const mainContainer = document.querySelector('.grid.grid-rows-\\[auto_1fr_auto\\]')
      
      // Should be centered
      expect(mainContainer).toHaveClass('items-center', 'justify-items-center')
      
      // Should have minimum height
      expect(mainContainer).toHaveClass('min-h-screen')
    })
  })

  describe('Accessibility Integration', () => {
    test('Page has proper heading structure', () => {
      render(<Home />)
      
      // Main title should be accessible
      expect(screen.getByText('Nirvek Pandey')).toBeInTheDocument()
    })

    test('Content is readable and well-structured', () => {
      render(<Home />)
      
      // All main content should be present and accessible
      expect(screen.getByText('Nirvek Pandey')).toBeInTheDocument()
      expect(screen.getByText(/I am a Nepalese - American student/)).toBeInTheDocument()
    })
  })

  describe('Negative Test Cases', () => {
    test('Footer should not have incorrect links', () => {
      render(<Home />)
      
      // Footer links should have correct URLs, not incorrect ones
      const linkedinLink = screen.getByRole('link', { name: /linkedin/i })
      const githubLink = screen.getByRole('link', { name: /github/i })
      const resumeLink = screen.getByRole('link', { name: /resume/i })
      
      expect(linkedinLink).not.toHaveAttribute('href', 'https://wrong-linkedin.com')
      expect(githubLink).not.toHaveAttribute('href', 'https://wrong-github.com')
      expect(resumeLink).not.toHaveAttribute('href', '/wrong-resume.pdf')
    })

    test('Page should not have incorrect layout classes', () => {
      render(<Home />)
      
      const mainContainer = document.querySelector('.grid.grid-rows-\\[auto_1fr_auto\\]')
      
      // Should not have incorrect grid classes
      expect(mainContainer).not.toHaveClass('grid-cols-1', 'grid-cols-2', 'grid-cols-3')
      expect(mainContainer).not.toHaveClass('flex', 'flex-col', 'flex-row')
    })

    test('Content should not be missing key sections', () => {
      render(<Home />)
      
      // All key content sections should be present
      expect(screen.getByText('Nirvek Pandey')).toBeInTheDocument()
      expect(screen.getByText(/University of California, San Diego/)).toBeInTheDocument()
      expect(screen.getByText(/software development and machine learning/)).toBeInTheDocument()
      expect(screen.getByText(/video blog platform/)).toBeInTheDocument()
      expect(screen.getByText(/cooking skills and travel/)).toBeInTheDocument()
    })

    test('Page should not have incorrect responsive behavior', () => {
      render(<Home />)
      
      const mainContainer = document.querySelector('.grid.grid-rows-\\[auto_1fr_auto\\]')
      
      // Should not have incorrect responsive classes
      expect(mainContainer).not.toHaveClass('md:p-8', 'lg:p-12')
      expect(mainContainer).not.toHaveClass('sm:gap-4', 'md:gap-8')
    })

    test('Hero component should not receive incorrect props', () => {
      render(<Home />)
      
      // Title should not be incorrect
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
      
      // Should have correct title
      expect(screen.getByText('Nirvek Pandey')).toBeInTheDocument()
    })

    test('Decorative elements should not be missing', () => {
      render(<Home />)
      
      // Decorative stars should be present (2 instances)
      const decorativeStars = screen.getAllByText(/★━━━━━━━━━━━★━━━━━━━━━━━★━━━━━━━━━━━★━━━━━━━━━━━★/)
      expect(decorativeStars).toHaveLength(2)
    })

    test('Page should not have incorrect spacing', () => {
      render(<Home />)
      
      const mainContainer = document.querySelector('.grid.grid-rows-\\[auto_1fr_auto\\]')
      
      // Should not have incorrect spacing classes
      expect(mainContainer).not.toHaveClass('p-0', 'p-2', 'p-4')
      expect(mainContainer).not.toHaveClass('gap-0', 'gap-2', 'gap-4')
    })

    test('Content should not be truncated or cut off', () => {
      render(<Home />)
      
      // All content should be fully visible
      expect(screen.getByText(/I am a Nepalese - American student pursuing a Bachelor of Science in Computer Science and Engineering at the University of California, San Diego/)).toBeInTheDocument()
      expect(screen.getByText(/I have a background in software development and machine learning, and am interested in pursuing a career at the intersection of distributed systems and machine learning/)).toBeInTheDocument()
      expect(screen.getByText(/In my free time, I like to hone my cooking skills and travel to new destinations. Most recently I traveled to Europe, with the highlight of my trip being the wonderful city of Barcelona/)).toBeInTheDocument()
    })
  })
})
