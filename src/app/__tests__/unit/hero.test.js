import { render, screen } from '@testing-library/react'
import Hero from '../../components/hero'

// Mock the dependencies
jest.mock('../../utils/formatText.js', () => ({
  parseContent: (text) => {
    if (!text) return <p>No content</p>
    return text.split('\n').map((line, index) => (
      <p key={index}>{line}</p>
    ))
  }
}))

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

jest.mock('../../components/footer.js', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>
  }
})

describe('Hero Component', () => {
  const mockProps = {
    title: 'Test Title',
    paragraph: 'This is a test paragraph.\nWith multiple lines.\nAnd more content.'
  }

  test('renders with title and paragraph content', () => {
    render(<Hero {...mockProps} />)
    
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('This is a test paragraph.')).toBeInTheDocument()
    expect(screen.getByText('With multiple lines.')).toBeInTheDocument()
    expect(screen.getByText('And more content.')).toBeInTheDocument()
  })

  test('renders image carousel and footer with correct props', () => {
    render(<Hero {...mockProps} />)
    
    const carousel = screen.getByTestId('image-carousel')
    expect(carousel).toBeInTheDocument()
    expect(carousel).toHaveClass('rounded-t-3xl', 'md:rounded-l-3xl', 'md:rounded-tr-none')
    expect(screen.getByText('Carousel for Test Title')).toBeInTheDocument()
    expect(screen.getByText('Images: 8')).toBeInTheDocument()
    
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  test('has correct structure and responsive classes', () => {
    render(<Hero {...mockProps} />)
    
    const section = screen.getByText('Test Title').closest('section')
    expect(section).toHaveClass('w-5/6', 'max-w-6xl', 'mx-auto', 'flex', 'flex-col', 'md:flex-row', 'bg-white', 'rounded-3xl', 'shadow-lg')
    
    const imageContainer = screen.getByTestId('image-carousel').parentElement
    expect(imageContainer).toHaveClass('md:w-1/2', 'relative', 'h-64', 'md:h-auto')
    
    const contentContainer = screen.getByText('Test Title').closest('div')
    expect(contentContainer).toHaveClass('md:w-1/2', 'p-4', 'sm:p-6', 'md:p-8', 'flex', 'flex-col', 'items-center', 'justify-center', 'text-center')
  })

  test('handles empty or undefined paragraph gracefully', () => {
    const { rerender } = render(<Hero title="Test Title" paragraph="" />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    
    rerender(<Hero title="Test Title" />)
    expect(screen.getByText('No content')).toBeInTheDocument()
  })
})
