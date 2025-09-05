import { render, screen, fireEvent } from '@testing-library/react'
import BlogModal from '../../components/blogModal'

// Mock the dependencies
jest.mock('../../utils/formatText.js', () => ({
  parseContent: (text) => {
    if (!text) return <div>No content</div>
    return text.split('\n').map((line, index) => (
      <div key={index}>{line}</div>
    ))
  }
}))

describe('BlogModal Component', () => {
  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Test Blog Post',
    content: 'This is the full blog content\nWith multiple lines\nAnd more content',
    excerpt: 'This is a test excerpt',
    publishedAt: '2024-01-15T10:30:00Z',
    slug: 'test-blog-post'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders content and handles interactions when open', () => {
    render(<BlogModal {...mockProps} />)
    
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument()
    expect(screen.getByText('This is the full blog content')).toBeInTheDocument()
    expect(screen.getByText('With multiple lines')).toBeInTheDocument()
    expect(screen.getByText('And more content')).toBeInTheDocument()
    expect(screen.getByText('January 15, 2024 at 2:30 AM')).toBeInTheDocument()
    
    // Test close button
    fireEvent.click(screen.getByText('✕'))
    expect(mockProps.onClose).toHaveBeenCalledTimes(1)
  })

  test('does not render when isOpen is false', () => {
    render(<BlogModal {...mockProps} isOpen={false} />)
    expect(screen.queryByText('Test Blog Post')).not.toBeInTheDocument()
  })

  test('formats dates correctly for various input types', () => {
    const { rerender } = render(<BlogModal {...mockProps} />)
    expect(screen.getByText('January 15, 2024 at 2:30 AM')).toBeInTheDocument()
    
    // Test Firestore timestamp
    const firestoreTimestamp = { toDate: () => new Date('2024-01-15T10:30:00Z') }
    rerender(<BlogModal {...mockProps} publishedAt={firestoreTimestamp} />)
    expect(screen.getByText('January 15, 2024 at 2:30 AM')).toBeInTheDocument()
    
    // Test invalid date
    rerender(<BlogModal {...mockProps} publishedAt="invalid-date" />)
    expect(screen.getByText('Invalid date')).toBeInTheDocument()
    
    // Test missing date
    rerender(<BlogModal {...mockProps} publishedAt={null} />)
    expect(screen.getByText('No date')).toBeInTheDocument()
  })

  test('handles click events correctly', () => {
    render(<BlogModal {...mockProps} />)
    
    // Test backdrop click
    const backdrop = screen.getByText('Test Blog Post').closest('.fixed')
    fireEvent.click(backdrop)
    expect(mockProps.onClose).toHaveBeenCalledTimes(1)
    
    // Test modal content click (should not close)
    const modalContent = screen.getByText('Test Blog Post').closest('div')
    fireEvent.click(modalContent)
    expect(mockProps.onClose).toHaveBeenCalledTimes(1) // Still 1, not 2
  })

  test('has correct styling and structure', () => {
    render(<BlogModal {...mockProps} />)
    
    const modal = screen.getByText('Test Blog Post').closest('.relative')
    expect(modal).toHaveClass('relative', 'bg-gradient-to-b', 'from-stone-700', 'to-zinc-900', 'rounded-lg', 'overflow-y-auto', 'transform', 'transition-all', 'duration-300', 'ease-in-out', 'scale-95', 'opacity-0')
    expect(modal).toHaveStyle({
      width: '80vw',
      height: '80vh',
      maxWidth: '1200px',
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column'
    })
    
    const backdrop = screen.getByText('Test Blog Post').closest('.fixed')
    expect(backdrop).toHaveClass('fixed', 'inset-0', 'z-50', 'flex', 'items-center', 'justify-center', 'transition-opacity', 'duration-300', 'ease-in-out', 'bg-black', 'bg-opacity-50')
    
    const contentSection = screen.getByText('Test Blog Post').closest('.flex-1')
    expect(contentSection).toHaveClass('flex-1', 'p-6', 'flex', 'flex-col')
    
    const title = screen.getByText('Test Blog Post')
    expect(title).toHaveClass('text-3xl', 'font-bold', 'mb-2', 'text-center', 'text-white')
    
    const date = screen.getByText('January 15, 2024 at 2:30 AM')
    expect(date).toHaveClass('text-center', 'text-white', 'mb-6')
    
    const contentContainer = screen.getByText('This is the full blog content').closest('.bg-gradient-to-b')
    expect(contentContainer).toHaveClass('bg-gradient-to-b', 'from-slate-700', 'to-gray-700', 'p-6', 'rounded-lg', 'shadow-lg', 'text-white', 'text-lg', 'leading-relaxed', 'flex-1')
    
    const closeButton = screen.getByText('✕')
    expect(closeButton).toHaveClass('absolute', 'top-3', 'right-3', 'bg-gray-800', 'text-white', 'px-3', 'py-1', 'rounded-full', 'hover:bg-gray-700', 'transition')
  })

  test('handles edge cases gracefully', () => {
    const { rerender } = render(<BlogModal {...mockProps} content="" />)
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument()
    
    rerender(<BlogModal {...mockProps} content={undefined} />)
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument()
    
    rerender(<BlogModal {...mockProps} title="" />)
    const titleElement = screen.getByRole('heading', { level: 2 })
    expect(titleElement).toHaveTextContent('')
    
    rerender(<BlogModal {...mockProps} title={undefined} />)
    const titleElement2 = screen.getByRole('heading', { level: 2 })
    expect(titleElement2).toHaveTextContent('')
  })

  test('formats time correctly for different times', () => {
    const { rerender } = render(<BlogModal {...mockProps} publishedAt="2024-01-15T15:45:00Z" />)
    expect(screen.getByText('January 15, 2024 at 7:45 AM')).toBeInTheDocument()
    
    rerender(<BlogModal {...mockProps} publishedAt="2024-01-15T00:00:00Z" />)
    expect(screen.getByText('January 14, 2024 at 4:00 PM')).toBeInTheDocument()
    
    rerender(<BlogModal {...mockProps} publishedAt="2024-01-15T12:00:00Z" />)
    expect(screen.getByText('January 15, 2024 at 4:00 AM')).toBeInTheDocument()
  })
})
