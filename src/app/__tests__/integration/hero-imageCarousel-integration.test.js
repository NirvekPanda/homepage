import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import Hero from '../../components/hero'
import ImageCarousel from '../../components/imageCarousel'

// Mock the utility functions
jest.mock('../../utils/formatText.js', () => ({
  parseContent: (text) => {
    if (!text) return <p>No content</p>
    return text.split('\n').map((line, index) => (
      <p key={index}>{line}</p>
    ))
  }
}))

// Mock the Footer component
jest.mock('../../components/footer.js', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer Content</div>
  }
})

describe('Hero and ImageCarousel Integration', () => {
  const mockHeroProps = {
    title: 'Test Hero Title',
    paragraph: 'This is a test hero paragraph.\nIt has multiple lines of content.'
  }

  const expectedProfileImages = [
    "/profile-pictures/redondo_pier.jpg",
    "/profile-pictures/golf_range.jpg",
    "/profile-pictures/london_bridge.jpg", 
    "/profile-pictures/pantheon.jpg",
    "/profile-pictures/rick_car.jpg",
    "/profile-pictures/sagrada_famila.jpg",
    "/profile-pictures/ucsd_sweater.jpg",
    "/profile-pictures/vespa.jpg"
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    // Use fake timers for carousel testing
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('Component Integration', () => {
    test('Hero renders with ImageCarousel and passes correct props', () => {
      render(<Hero {...mockHeroProps} />)
      
      // Check that Hero renders
      expect(screen.getByText('Test Hero Title')).toBeInTheDocument()
      expect(screen.getByText('This is a test hero paragraph.')).toBeInTheDocument()
      expect(screen.getByText('It has multiple lines of content.')).toBeInTheDocument()
      
      // Check that ImageCarousel is rendered with correct title
      expect(screen.getByRole('img', { name: 'Test Hero Title - Image 1' })).toBeInTheDocument()
      
      // Check that Footer is rendered
      expect(screen.getByTestId('footer')).toBeInTheDocument()
    })

    test('ImageCarousel receives correct images from Hero', () => {
      render(<Hero {...mockHeroProps} />)
      
      // Check that all expected profile images are rendered
      expectedProfileImages.forEach((imagePath, index) => {
        const img = screen.getByRole('img', { name: `Test Hero Title - Image ${index + 1}` })
        expect(img).toHaveAttribute('src', imagePath)
      })
    })

    test('ImageCarousel uses correct title from Hero', () => {
      const customTitle = 'Custom Hero Title'
      render(<Hero {...mockHeroProps} title={customTitle} />)
      
      // Check that ImageCarousel uses the custom title
      expect(screen.getByRole('img', { name: `${customTitle} - Image 1` })).toBeInTheDocument()
    })
  })

  describe('Carousel Functionality in Hero Context', () => {
    test('carousel auto-advances in Hero context', async () => {
      render(<Hero {...mockHeroProps} />)
      
      // Initially should show first image
      expect(screen.getByRole('img', { name: 'Test Hero Title - Image 1' })).toBeInTheDocument()
      
      // Fast-forward time to trigger auto-advance
      act(() => {
        jest.advanceTimersByTime(10000)
      })
      
      await waitFor(() => {
        expect(screen.getByRole('img', { name: 'Test Hero Title - Image 2' })).toBeInTheDocument()
      })
    })

    test('carousel indicators work in Hero context', async () => {
      render(<Hero {...mockHeroProps} />)
      
      // Click on indicator for image 3
      const indicator3 = screen.getByRole('button', { name: 'Slide 3' })
      fireEvent.click(indicator3)
      
      await waitFor(() => {
        expect(screen.getByRole('img', { name: 'Test Hero Title - Image 3' })).toBeInTheDocument()
      })
    })

    test('carousel navigation buttons work in Hero context', async () => {
      render(<Hero {...mockHeroProps} />)
      
      // Click next button
      const nextButton = screen.getByRole('button', { name: /next/i })
      fireEvent.click(nextButton)
      
      await waitFor(() => {
        expect(screen.getByRole('img', { name: 'Test Hero Title - Image 2' })).toBeInTheDocument()
      })
      
      // Click previous button
      const prevButton = screen.getByRole('button', { name: /previous/i })
      fireEvent.click(prevButton)
      
      await waitFor(() => {
        expect(screen.getByRole('img', { name: 'Test Hero Title - Image 1' })).toBeInTheDocument()
      })
    })
  })

  describe('Layout and Styling Integration', () => {
    test('Hero layout accommodates ImageCarousel properly', () => {
      render(<Hero {...mockHeroProps} />)
      
      // Check Hero container structure
      const heroSection = screen.getByText('Test Hero Title').closest('section')
      expect(heroSection).toHaveClass('w-5/6', 'max-w-6xl', 'mx-auto', 'flex', 'flex-col', 'md:flex-row')
      
      // Check ImageCarousel container
      const imageContainer = screen.getByRole('img', { name: 'Test Hero Title - Image 1' }).closest('.md\\:w-1\\/2')
      expect(imageContainer).toHaveClass('md:w-1/2', 'relative', 'h-64', 'md:h-auto')
    })

    test('ImageCarousel has correct styling classes in Hero context', () => {
      render(<Hero {...mockHeroProps} />)
      
      const carousel = screen.getByRole('img', { name: 'Test Hero Title - Image 1' }).closest('[data-carousel="slide"]')
      expect(carousel).toHaveClass('relative', 'w-full', 'h-full')
      expect(carousel).toHaveClass('rounded-t-3xl', 'md:rounded-l-3xl', 'md:rounded-tr-none')
    })
  })

  describe('Content Integration', () => {
    test('Hero content and ImageCarousel work together', () => {
      render(<Hero {...mockHeroProps} />)
      
      // Check that both content areas are present
      expect(screen.getByText('Test Hero Title')).toBeInTheDocument()
      expect(screen.getByText('This is a test hero paragraph.')).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'Test Hero Title - Image 1' })).toBeInTheDocument()
      expect(screen.getByTestId('footer')).toBeInTheDocument()
    })

    test('handles empty or undefined content gracefully', () => {
      render(<Hero title="" paragraph="" />)
      
      // Should still render ImageCarousel - check that images are present
      const images = screen.getAllByRole('img')
      expect(images).toHaveLength(8) // Should have all 8 profile images
      expect(images[0]).toHaveAttribute('alt', ' - Image 1')
      
      // Should render empty content
      expect(screen.getByText('No content')).toBeInTheDocument()
    })
  })

  describe('Responsive Behavior', () => {
    test('Hero layout adapts to different screen sizes with ImageCarousel', () => {
      render(<Hero {...mockHeroProps} />)
      
      const heroSection = screen.getByText('Test Hero Title').closest('section')
      
      // Check responsive classes
      expect(heroSection).toHaveClass('flex-col', 'md:flex-row')
      
      // Check ImageCarousel responsive classes
      const imageContainer = screen.getByRole('img', { name: 'Test Hero Title - Image 1' }).closest('.md\\:w-1\\/2')
      expect(imageContainer).toHaveClass('h-64', 'md:h-auto')
    })
  })

  describe('Edge Cases', () => {
    test('handles rapid carousel interactions in Hero context', async () => {
      render(<Hero {...mockHeroProps} />)
      
      const nextButton = screen.getByRole('button', { name: /next/i })
      const prevButton = screen.getByRole('button', { name: /previous/i })
      
      // Rapidly click next and previous
      fireEvent.click(nextButton)
      fireEvent.click(nextButton)
      fireEvent.click(prevButton)
      fireEvent.click(nextButton)
      
      // Should handle rapid interactions without errors
      await waitFor(() => {
        expect(screen.getByRole('img', { name: 'Test Hero Title - Image 3' })).toBeInTheDocument()
      })
    })

    test('carousel timer resets after manual navigation in Hero context', async () => {
      render(<Hero {...mockHeroProps} />)
      
      // Manually navigate to image 3
      const indicator3 = screen.getByRole('button', { name: 'Slide 3' })
      fireEvent.click(indicator3)
      
      await waitFor(() => {
        expect(screen.getByRole('img', { name: 'Test Hero Title - Image 3' })).toBeInTheDocument()
      })
      
      // Advance timer - should go to image 4, not 2
      act(() => {
        jest.advanceTimersByTime(10000)
      })
      
      await waitFor(() => {
        expect(screen.getByRole('img', { name: 'Test Hero Title - Image 4' })).toBeInTheDocument()
      })
    })

    test('handles component unmounting during carousel operation', () => {
      const { unmount } = render(<Hero {...mockHeroProps} />)
      
      // Start timer
      act(() => {
        jest.advanceTimersByTime(5000)
      })
      
      // Unmount component
      unmount()
      
      // Advance timer further - should not cause errors
      act(() => {
        jest.advanceTimersByTime(10000)
      })
      
      // Test passes if no errors are thrown
      expect(true).toBe(true)
    })
  })

  describe('Performance and Memory', () => {
    test('carousel cleans up timers when Hero unmounts', () => {
      const { unmount } = render(<Hero {...mockHeroProps} />)
      
      // Start timer
      act(() => {
        jest.advanceTimersByTime(5000)
      })
      
      // Unmount should clean up
      unmount()
      
      // No timers should be running
      expect(jest.getTimerCount()).toBe(0)
    })

    test('multiple Hero instances with ImageCarousels work independently', () => {
      render(
        <div>
          <Hero title="Hero 1" paragraph="First hero content" />
          <Hero title="Hero 2" paragraph="Second hero content" />
        </div>
      )
      
      // Both carousels should work independently
      expect(screen.getByRole('img', { name: 'Hero 1 - Image 1' })).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'Hero 2 - Image 1' })).toBeInTheDocument()
      
      // Navigate first carousel
      const hero1Next = screen.getAllByRole('button', { name: /next/i })[0]
      fireEvent.click(hero1Next)
      
      // First should advance, second should stay on image 1
      expect(screen.getByRole('img', { name: 'Hero 1 - Image 2' })).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'Hero 2 - Image 1' })).toBeInTheDocument()
    })
  })
})
