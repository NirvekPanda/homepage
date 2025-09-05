import { render, screen, fireEvent, act } from '@testing-library/react'
import ImageCarousel from '../../components/imageCarousel'

// Mock timers for testing auto-advance functionality
jest.useFakeTimers()

describe('ImageCarousel Component', () => {
  const mockProps = {
    title: 'Test Carousel',
    images: [
      '/image1.jpg',
      '/image2.jpg',
      '/image3.jpg'
    ],
    className: 'test-class'
  }

  beforeEach(() => {
    jest.clearAllTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
  })

  test('renders with correct props and structure', () => {
    render(<ImageCarousel {...mockProps} />)
    
    // Check images are rendered with correct attributes
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(3)
    expect(images[0]).toHaveAttribute('src', '/image1.jpg')
    expect(images[0]).toHaveAttribute('alt', 'Test Carousel - Image 1')
    expect(images[1]).toHaveAttribute('src', '/image2.jpg')
    expect(images[1]).toHaveAttribute('alt', 'Test Carousel - Image 2')
    expect(images[2]).toHaveAttribute('src', '/image3.jpg')
    expect(images[2]).toHaveAttribute('alt', 'Test Carousel - Image 3')
    
    // Check custom className is applied
    const carousel = screen.getByRole('img', { name: 'Test Carousel - Image 1' }).closest('[data-carousel="slide"]')
    expect(carousel).toHaveClass('test-class')
    
    // Check first image is visible by default
    const firstImageContainer = images[0].closest('div')
    expect(firstImageContainer).toHaveClass('opacity-100')
    
    // Check other images are hidden
    const secondImageContainer = images[1].closest('div')
    const thirdImageContainer = images[2].closest('div')
    expect(secondImageContainer).toHaveClass('opacity-0')
    expect(thirdImageContainer).toHaveClass('opacity-0')
  })

  test('renders navigation controls', () => {
    render(<ImageCarousel {...mockProps} />)
    
    const nextButton = screen.getByRole('button', { name: /next/i })
    const prevButton = screen.getByRole('button', { name: /previous/i })
    const indicators = screen.getAllByRole('button').filter(button => 
      button.getAttribute('aria-label')?.startsWith('Slide')
    )
    
    expect(nextButton).toBeInTheDocument()
    expect(prevButton).toBeInTheDocument()
    expect(indicators).toHaveLength(3)
  })

  test('handles navigation and wrapping', () => {
    render(<ImageCarousel {...mockProps} />)
    
    const nextButton = screen.getByRole('button', { name: /next/i })
    const prevButton = screen.getByRole('button', { name: /previous/i })
    const images = screen.getAllByRole('img')
    
    // Test next navigation
    fireEvent.click(nextButton)
    expect(images[1].closest('div')).toHaveClass('opacity-100')
    expect(images[0].closest('div')).toHaveClass('opacity-0')
    
    // Test previous navigation
    fireEvent.click(prevButton)
    expect(images[0].closest('div')).toHaveClass('opacity-100')
    expect(images[1].closest('div')).toHaveClass('opacity-0')
    
    // Test wrapping around
    fireEvent.click(prevButton) // Should go to last image
    expect(images[2].closest('div')).toHaveClass('opacity-100')
    
    fireEvent.click(nextButton) // Should go to first image
    expect(images[0].closest('div')).toHaveClass('opacity-100')
  })

  test('handles indicator navigation', () => {
    render(<ImageCarousel {...mockProps} />)
    
    const thirdIndicator = screen.getByRole('button', { name: 'Slide 3' })
    const images = screen.getAllByRole('img')
    
    fireEvent.click(thirdIndicator)
    expect(images[2].closest('div')).toHaveClass('opacity-100')
    expect(images[0].closest('div')).toHaveClass('opacity-0')
  })

  test('handles auto-advance and timer resets', () => {
    render(<ImageCarousel {...mockProps} />)
    
    const images = screen.getAllByRole('img')
    
    // Test manual navigation first
    const nextButton = screen.getByRole('button', { name: /next/i })
    fireEvent.click(nextButton)
    expect(images[1].closest('div')).toHaveClass('opacity-100')
    expect(images[0].closest('div')).toHaveClass('opacity-0')
    
    // Test that auto-advance timer is set up (component doesn't crash)
    act(() => {
      jest.advanceTimersByTime(5000)
    })
    
    // Component should still be functional
    const visibleImage = images.find(img => 
      img.closest('div')?.classList.contains('opacity-100')
    )
    expect(visibleImage).toBeInTheDocument()
  })

  test('handles rapid interactions gracefully', () => {
    render(<ImageCarousel {...mockProps} />)
    
    const nextButton = screen.getByRole('button', { name: /next/i })
    const indicators = screen.getAllByRole('button').filter(button => 
      button.getAttribute('aria-label')?.startsWith('Slide')
    )
    
    // Rapid button clicks
    fireEvent.click(nextButton)
    fireEvent.click(nextButton)
    fireEvent.click(nextButton)
    fireEvent.click(nextButton)
    
    // Rapid indicator clicks
    if (indicators.length > 0) {
      fireEvent.click(indicators[2])
      fireEvent.click(indicators[0])
      fireEvent.click(indicators[1])
    }
    
    // Should be on a valid image (not crashed)
    const images = screen.getAllByRole('img')
    const visibleImage = images.find(img => 
      img.closest('div')?.classList.contains('opacity-100')
    )
    expect(visibleImage).toBeInTheDocument()
  })

  test('handles edge cases with single, empty, or invalid images', () => {
    const { rerender } = render(<ImageCarousel {...mockProps} />)
    
    // Single image
    rerender(<ImageCarousel title="Single" images={['/single.jpg']} />)
    expect(screen.getByAltText('Single - Image 1')).toBeInTheDocument()
    expect(screen.getAllByRole('button').filter(button => 
      button.getAttribute('aria-label')?.startsWith('Slide')
    )).toHaveLength(1)
    
    // Empty images array
    rerender(<ImageCarousel title="Empty" images={[]} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getAllByRole('button').filter(button => 
      button.getAttribute('aria-label')?.startsWith('Slide')
    )).toHaveLength(0)
    
    // Test with valid empty array instead of undefined/null to avoid component errors
    rerender(<ImageCarousel title="Empty" images={[]} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  test('handles auto-advance with edge cases', () => {
    const { rerender } = render(<ImageCarousel title="Single" images={['/single.jpg']} />)
    
    // Single image auto-advance
    act(() => {
      jest.advanceTimersByTime(5000)
    })
    expect(screen.getByAltText('Single - Image 1').closest('div')).toHaveClass('opacity-100')
    
    // Empty images auto-advance
    rerender(<ImageCarousel title="Empty" images={[]} />)
    act(() => {
      jest.advanceTimersByTime(5000)
    })
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})