import { render, screen, fireEvent } from '@testing-library/react'
import BlogCard from '../../components/blogCard'

// Mock the BlogModal component
jest.mock('../../components/blogModal.js', () => {
  return function MockBlogModal({ isOpen, onClose, title, content, publishedAt, slug }) {
    if (!isOpen) return null
    return (
      <div data-testid="blog-modal">
        <h2>{title}</h2>
        <p>{content}</p>
        <p>Published: {publishedAt}</p>
        <p>Slug: {slug}</p>
        <button onClick={onClose}>Close</button>
      </div>
    )
  }
})

describe('BlogCard Component', () => {
  const mockProps = {
    title: 'Test Blog Post',
    excerpt: 'This is a test blog excerpt that should be displayed.',
    publishedAt: '2024-01-15T10:30:00Z',
    slug: 'test-blog-post',
    content: 'This is the full blog content that appears in the modal.'
  }

  test('renders blog information and handles modal interactions', () => {
    render(<BlogCard {...mockProps} />)
    
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument()
    expect(screen.getByText('This is a test blog excerpt that should be displayed.')).toBeInTheDocument()
    expect(screen.getByAltText('Test Blog Post')).toBeInTheDocument()
    
    // Test modal opening
    const card = screen.getByRole('heading', { name: 'Test Blog Post' }).closest('.cursor-pointer')
    fireEvent.click(card)
    
    const modal = screen.getByTestId('blog-modal')
    expect(modal).toHaveTextContent('Test Blog Post')
    expect(modal).toHaveTextContent('This is the full blog content that appears in the modal.')
    expect(modal).toHaveTextContent('Published: 2024-01-15T10:30:00Z')
    expect(modal).toHaveTextContent('Slug: test-blog-post')
    
    // Test modal closing
    fireEvent.click(screen.getByText('Close'))
    expect(screen.queryByTestId('blog-modal')).not.toBeInTheDocument()
  })

  test('formats dates correctly for various input types', () => {
    const { rerender } = render(<BlogCard {...mockProps} />)
    expect(screen.getByText(/January 15, 2024/)).toBeInTheDocument()
    
    // Test Firestore timestamp
    const firestoreTimestamp = { toDate: () => new Date('2024-01-15T10:30:00Z') }
    rerender(<BlogCard {...mockProps} publishedAt={firestoreTimestamp} />)
    expect(screen.getByText(/January 15, 2024/)).toBeInTheDocument()
    
    // Test invalid date
    rerender(<BlogCard {...mockProps} publishedAt="invalid-date" />)
    expect(screen.getByText('Invalid date')).toBeInTheDocument()
    
    // Test missing date
    rerender(<BlogCard {...mockProps} publishedAt={null} />)
    expect(screen.getByText('No date')).toBeInTheDocument()
  })

  test('handles image source and error fallback', () => {
    render(<BlogCard {...mockProps} />)
    
    const image = screen.getByAltText('Test Blog Post')
    expect(image).toHaveAttribute('src', '/blog-images/test-blog-post.jpg')
    expect(image).toHaveClass('object-cover', 'w-full', 'h-full')
    
    fireEvent.error(image)
    expect(image).toHaveAttribute('src', '/blog-images/default.jpg')
  })

  test('has correct styling and structure', () => {
    render(<BlogCard {...mockProps} />)
    
    const card = screen.getByRole('heading', { name: 'Test Blog Post' }).closest('div').parentElement
    expect(card).toHaveClass('cursor-pointer', 'relative', 'flex', 'flex-col', 'my-6', 'bg-slate-700', 'shadow-md', 'border', 'border-slate-800', 'hover:border-4', 'rounded-lg', 'w-full', 'max-w-sm', 'transition-all', 'duration-100')
    
    const title = screen.getByText('Test Blog Post')
    expect(title).toHaveClass('mb-2', 'text-white', 'text-xl', 'font-semibold', 'text-center')
    
    const excerpt = screen.getByText('This is a test blog excerpt that should be displayed.')
    expect(excerpt).toHaveClass('text-gray-300', 'text-sm', 'text-center', 'mb-3', 'line-clamp-3')
    
    const date = screen.getByText(/January 15, 2024/)
    expect(date).toHaveClass('text-white', 'text-xs', 'text-center')
  })

  test('handles empty or undefined excerpt gracefully', () => {
    const { rerender } = render(<BlogCard {...mockProps} excerpt="" />)
    expect(screen.getByRole('heading', { name: 'Test Blog Post' })).toBeInTheDocument()
    
    const excerptElement = screen.getByText('Test Blog Post').closest('div').querySelector('p')
    expect(excerptElement).toHaveTextContent('')
    
    rerender(<BlogCard {...mockProps} excerpt={undefined} />)
    expect(screen.getByRole('heading', { name: 'Test Blog Post' })).toBeInTheDocument()
  })
})
