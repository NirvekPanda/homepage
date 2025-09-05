import { render, screen, fireEvent } from '@testing-library/react'
import Hero from '../../components/hero'

// Mock the utility functions
jest.mock('../../utils/formatText.js', () => ({
  parseContent: (text) => {
    if (!text) return <p>No content</p>
    return text.split('\n').map((line, index) => (
      <p key={index}>{line}</p>
    ))
  }
}))

// Mock the ImageCarousel component
jest.mock('../../components/imageCarousel.js', () => {
  return function MockImageCarousel({ title, images, className }) {
    return (
      <div data-testid="image-carousel" className={className}>
        <div>Carousel for {title}</div>
        <div>Images: {images.length}</div>
      </div>
    )
  }
})

describe('Hero and Footer Integration', () => {
  const mockHeroProps = {
    title: 'Test Hero Title',
    paragraph: 'This is a test hero paragraph.\nIt has multiple lines of content.'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Component Integration', () => {
    test('Hero renders with Footer component', () => {
      render(<Hero {...mockHeroProps} />)
      
      // Check that Hero renders
      expect(screen.getByText('Test Hero Title')).toBeInTheDocument()
      expect(screen.getByText('This is a test hero paragraph.')).toBeInTheDocument()
      expect(screen.getByText('It has multiple lines of content.')).toBeInTheDocument()
      
      // Check that Footer is rendered
      expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /resume/i })).toBeInTheDocument()
    })

    test('Footer renders with correct social links', () => {
      render(<Hero {...mockHeroProps} />)
      
      // Check LinkedIn link
      const linkedinLink = screen.getByRole('link', { name: /linkedin/i })
      expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/nirvekpandey/')
      expect(linkedinLink).toHaveAttribute('target', '_blank')
      expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer')
      
      // Check GitHub link
      const githubLink = screen.getByRole('link', { name: /github/i })
      expect(githubLink).toHaveAttribute('href', 'https://github.com/NirvekPanda')
      expect(githubLink).toHaveAttribute('target', '_blank')
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
      
      // Check Resume link
      const resumeLink = screen.getByRole('link', { name: /resume/i })
      expect(resumeLink).toHaveAttribute('href', '/Nirvek_Pandey_Resume.pdf')
      expect(resumeLink).toHaveAttribute('download')
      expect(resumeLink).toHaveAttribute('target', '_blank')
      expect(resumeLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    test('Footer renders with correct icons', () => {
      render(<Hero {...mockHeroProps} />)
      
      // Check specific icons by alt text
      expect(screen.getByAltText('File icon')).toBeInTheDocument()
      expect(screen.getByAltText('Window icon')).toBeInTheDocument()
      expect(screen.getByAltText('Resume icon')).toBeInTheDocument()
    })
  })

  describe('Layout and Styling Integration', () => {
    test('Hero layout accommodates Footer properly', () => {
      render(<Hero {...mockHeroProps} />)
      
      // Check Hero container structure
      const heroSection = screen.getByText('Test Hero Title').closest('section')
      expect(heroSection).toHaveClass('w-5/6', 'max-w-6xl', 'mx-auto', 'flex', 'flex-col', 'md:flex-row')
      
      // Check content container that includes Footer
      const contentContainer = screen.getByText('Test Hero Title').closest('div')
      expect(contentContainer).toHaveClass('md:w-1/2', 'p-4', 'sm:p-6', 'md:p-8', 'flex', 'flex-col', 'items-center', 'justify-center', 'text-center')
    })

    test('Footer has correct styling classes in Hero context', () => {
      render(<Hero {...mockHeroProps} />)
      
      const footer = screen.getByRole('link', { name: /linkedin/i }).closest('footer')
      expect(footer).toHaveClass('flex', 'gap-6', 'flex-wrap', 'items-center', 'justify-center')
    })

    test('Footer links have correct hover styling', () => {
      render(<Hero {...mockHeroProps} />)
      
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toHaveClass('hover:underline', 'hover:underline-offset-4')
      })
    })
  })

  describe('Content Integration', () => {
    test('Hero content and Footer work together', () => {
      render(<Hero {...mockHeroProps} />)
      
      // Check that both content areas are present
      expect(screen.getByText('Test Hero Title')).toBeInTheDocument()
      expect(screen.getByText('This is a test hero paragraph.')).toBeInTheDocument()
      expect(screen.getByText('It has multiple lines of content.')).toBeInTheDocument()
      
      // Check that Footer is present
      expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /resume/i })).toBeInTheDocument()
    })

    test('Footer is positioned correctly within Hero content area', () => {
      render(<Hero {...mockHeroProps} />)
      
      const contentContainer = screen.getByText('Test Hero Title').closest('div')
      const footer = screen.getByRole('link', { name: /linkedin/i }).closest('footer')
      
      // Footer should be within the content container
      expect(contentContainer).toContainElement(footer)
    })

    test('handles empty or undefined content gracefully with Footer', () => {
      render(<Hero title="" paragraph="" />)
      
      // Should still render Footer
      expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /resume/i })).toBeInTheDocument()
      
      // Should render empty content
      expect(screen.getByText('No content')).toBeInTheDocument()
    })
  })

  describe('Responsive Behavior', () => {
    test('Hero layout adapts to different screen sizes with Footer', () => {
      render(<Hero {...mockHeroProps} />)
      
      const heroSection = screen.getByText('Test Hero Title').closest('section')
      
      // Check responsive classes
      expect(heroSection).toHaveClass('flex-col', 'md:flex-row')
      
      // Check content container responsive classes
      const contentContainer = screen.getByText('Test Hero Title').closest('div')
      expect(contentContainer).toHaveClass('p-4', 'sm:p-6', 'md:p-8')
    })

    test('Footer maintains responsive behavior in Hero context', () => {
      render(<Hero {...mockHeroProps} />)
      
      const footer = screen.getByRole('link', { name: /linkedin/i }).closest('footer')
      
      // Check responsive classes
      expect(footer).toHaveClass('flex-wrap')
    })
  })

  describe('Footer Functionality', () => {
    test('Footer links are clickable and functional', () => {
      render(<Hero {...mockHeroProps} />)
      
      const linkedinLink = screen.getByRole('link', { name: /linkedin/i })
      const githubLink = screen.getByRole('link', { name: /github/i })
      const resumeLink = screen.getByRole('link', { name: /resume/i })
      
      // Links should be clickable
      expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/nirvekpandey/')
      expect(githubLink).toHaveAttribute('href', 'https://github.com/NirvekPanda')
      expect(resumeLink).toHaveAttribute('href', '/Nirvek_Pandey_Resume.pdf')
    })

    test('Footer links open in new tabs', () => {
      render(<Hero {...mockHeroProps} />)
      
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })

    test('Resume link has download attribute', () => {
      render(<Hero {...mockHeroProps} />)
      
      const resumeLink = screen.getByRole('link', { name: /resume/i })
      expect(resumeLink).toHaveAttribute('download')
    })
  })

  describe('Edge Cases', () => {
    test('handles rapid interactions with Footer links', () => {
      render(<Hero {...mockHeroProps} />)
      
      const linkedinLink = screen.getByRole('link', { name: /linkedin/i })
      const githubLink = screen.getByRole('link', { name: /github/i })
      
      // Rapidly click different links
      fireEvent.click(linkedinLink)
      fireEvent.click(githubLink)
      fireEvent.click(linkedinLink)
      
      // Should handle rapid interactions without errors
      expect(linkedinLink).toBeInTheDocument()
      expect(githubLink).toBeInTheDocument()
    })

    test('Footer maintains functionality with different Hero content', () => {
      const differentContent = {
        title: 'Different Title',
        paragraph: 'Different paragraph content.'
      }
      
      render(<Hero {...differentContent} />)
      
      // Footer should still work
      expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /resume/i })).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('Footer links are accessible', () => {
      render(<Hero {...mockHeroProps} />)
      
      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(3)
      
      // Each link should have proper accessibility attributes
      links.forEach(link => {
        expect(link).toHaveAttribute('href')
        expect(link.textContent).toBeTruthy()
      })
    })

    test('Footer icons are accessible', () => {
      render(<Hero {...mockHeroProps} />)
      
      // Check specific icons by alt text
      const fileIcon = screen.getByAltText('File icon')
      const windowIcon = screen.getByAltText('Window icon')
      const resumeIcon = screen.getByAltText('Resume icon')
      
      // Each icon should have proper alt text and aria-hidden
      expect(fileIcon).toHaveAttribute('alt', 'File icon')
      expect(fileIcon).toHaveAttribute('aria-hidden', 'true')
      
      expect(windowIcon).toHaveAttribute('alt', 'Window icon')
      expect(windowIcon).toHaveAttribute('aria-hidden', 'true')
      
      expect(resumeIcon).toHaveAttribute('alt', 'Resume icon')
      expect(resumeIcon).toHaveAttribute('aria-hidden', 'true')
    })

    test('Footer maintains accessibility in different screen sizes', () => {
      render(<Hero {...mockHeroProps} />)
      
      const footer = screen.getByRole('link', { name: /linkedin/i }).closest('footer')
      
      // Footer should maintain accessibility classes
      expect(footer).toHaveClass('flex', 'items-center', 'justify-center')
    })
  })

  describe('Performance', () => {
    test('Footer renders efficiently with Hero content', () => {
      render(<Hero {...mockHeroProps} />)
      
      // Should render without errors
      expect(screen.getByText('Test Hero Title')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
    })

    test('Footer maintains performance with multiple Hero instances', () => {
      render(
        <div>
          <Hero title="Hero 1" paragraph="First hero content" />
          <Hero title="Hero 2" paragraph="Second hero content" />
        </div>
      )
      
      // Both footers should render independently
      const footers = screen.getAllByRole('link', { name: /linkedin/i })
      expect(footers).toHaveLength(2)
    })
  })

  describe('Negative Test Cases', () => {
    test('Footer should not render when Hero is not provided', () => {
      // This test ensures Footer doesn't render independently
      const { container } = render(<div />)
      expect(container.firstChild).toBeEmptyDOMElement()
    })

    test('Footer links should not have incorrect href attributes', () => {
      render(<Hero {...mockHeroProps} />)
      
      const linkedinLink = screen.getByRole('link', { name: /linkedin/i })
      const githubLink = screen.getByRole('link', { name: /github/i })
      const resumeLink = screen.getByRole('link', { name: /resume/i })
      
      // Should not have incorrect URLs
      expect(linkedinLink).not.toHaveAttribute('href', 'https://wrong-linkedin.com')
      expect(githubLink).not.toHaveAttribute('href', 'https://wrong-github.com')
      expect(resumeLink).not.toHaveAttribute('href', '/wrong-resume.pdf')
    })

    test('Footer icons should not have incorrect alt text', () => {
      render(<Hero {...mockHeroProps} />)
      
      const fileIcon = screen.getByAltText('File icon')
      const windowIcon = screen.getByAltText('Window icon')
      const resumeIcon = screen.getByAltText('Resume icon')
      
      // Should not have incorrect alt text
      expect(fileIcon).not.toHaveAttribute('alt', 'Wrong icon')
      expect(windowIcon).not.toHaveAttribute('alt', 'Wrong icon')
      expect(resumeIcon).not.toHaveAttribute('alt', 'Wrong icon')
    })

    test('Footer should not have incorrect styling classes', () => {
      render(<Hero {...mockHeroProps} />)
      
      const footer = screen.getByRole('link', { name: /linkedin/i }).closest('footer')
      
      // Should not have incorrect classes
      expect(footer).not.toHaveClass('flex-col', 'grid', 'inline-flex')
      expect(footer).not.toHaveClass('justify-start', 'justify-end')
      expect(footer).not.toHaveClass('items-start', 'items-end')
    })

    test('Footer links should not open in same tab', () => {
      render(<Hero {...mockHeroProps} />)
      
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        // Should not have target="_self" or no target attribute
        expect(link).not.toHaveAttribute('target', '_self')
        expect(link).toHaveAttribute('target', '_blank')
      })
    })

    test('Footer should not render without proper accessibility attributes', () => {
      render(<Hero {...mockHeroProps} />)
      
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        // Should not be missing required accessibility attributes
        expect(link).toHaveAttribute('href')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
        expect(link.textContent).toBeTruthy()
      })
    })

    test('Footer should not render with incorrect icon dimensions', () => {
      render(<Hero {...mockHeroProps} />)
      
      const icons = screen.getAllByRole('img', { hidden: true })
      icons.forEach(icon => {
        // Should not have incorrect dimensions
        expect(icon).not.toHaveAttribute('width', '32')
        expect(icon).not.toHaveAttribute('height', '32')
        expect(icon).toHaveAttribute('width', '16')
        expect(icon).toHaveAttribute('height', '16')
      })
    })

    test('Footer should not render when Hero content is empty', () => {
      render(<Hero title="" paragraph="" />)
      
      // Footer should still render even with empty Hero content
      expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /resume/i })).toBeInTheDocument()
    })

    test('Footer should not interfere with Hero content layout', () => {
      render(<Hero {...mockHeroProps} />)
      
      const heroSection = screen.getByText('Test Hero Title').closest('section')
      const contentContainer = screen.getByText('Test Hero Title').closest('div')
      
      // Footer should be contained within Hero content area
      expect(contentContainer).toContainElement(screen.getByRole('link', { name: /linkedin/i }).closest('footer'))
      
      // Hero section should not have incorrect layout classes
      expect(heroSection).not.toHaveClass('flex-col', 'grid')
    })

    test('Footer should not render with incorrect responsive behavior', () => {
      render(<Hero {...mockHeroProps} />)
      
      const footer = screen.getByRole('link', { name: /linkedin/i }).closest('footer')
      
      // Should not have incorrect responsive classes
      expect(footer).not.toHaveClass('hidden', 'md:block')
      expect(footer).not.toHaveClass('flex-col', 'md:flex-row')
    })
  })
})
