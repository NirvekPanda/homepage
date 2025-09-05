import { render, screen, fireEvent } from '@testing-library/react'
import CardModal from '../../components/cardModal'

// Mock the dependencies
jest.mock('../../utils/formatText.js', () => ({
  parseContent: (text) => {
    if (!text) return <li>No content</li>
    return text.split('\n').map((line, index) => (
      <li key={index}>{line}</li>
    ))
  }
}))

jest.mock('../../components/langTile.js', () => {
  return function MockLanguageTile({ language }) {
    return <span data-testid="lang-tile">{language}</span>
  }
})

jest.mock('../../components/button.js', () => {
  return function MockLinkButton({ text, link, className }) {
    return <a href={link} className={className}>{text}</a>
  }
})

jest.mock('../../utils/imageUtils.js', () => ({
  getProjectImageSrc: (image, name) => image || `/project-images/${name?.toLowerCase().replace(/\s+/g, '-')}.jpg`
}))

describe('CardModal Component', () => {
  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    name: 'Test Project',
    description: 'A test project description\nWith multiple lines',
    image: 'test-image.jpg',
    link: 'https://example.com',
    date: '2024-01-01',
    code: true,
    demo: true,
    github: 'https://github.com/test',
    languages: ['JavaScript', 'React', 'Node.js']
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders content and handles interactions when open', () => {
    render(<CardModal {...mockProps} />)
    
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.getByText('A test project description')).toBeInTheDocument()
    expect(screen.getByText('With multiple lines')).toBeInTheDocument()
    expect(screen.getByText('2024-01-01')).toBeInTheDocument()
    
    // Test close button
    fireEvent.click(screen.getByText('✕'))
    expect(mockProps.onClose).toHaveBeenCalledTimes(1)
  })

  test('does not render when isOpen is false', () => {
    render(<CardModal {...mockProps} isOpen={false} />)
    expect(screen.queryByText('Test Project')).not.toBeInTheDocument()
  })

  test('renders image and handles error fallback', () => {
    render(<CardModal {...mockProps} />)
    
    const image = screen.getByAltText('Test Project')
    expect(image).toHaveAttribute('src', 'test-image.jpg')
    expect(image).toHaveClass('object-cover', 'w-full', 'h-full', 'rounded-t-lg')
    
    fireEvent.error(image)
    expect(image).toHaveAttribute('src', '/project-images/default.jpg')
  })

  test('conditionally renders buttons based on props', () => {
    const { rerender } = render(<CardModal {...mockProps} />)
    expect(screen.getByRole('link', { name: 'Example' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument()
    
    rerender(<CardModal {...mockProps} demo={false} />)
    expect(screen.queryByRole('link', { name: 'Example' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument()
    
    rerender(<CardModal {...mockProps} code={false} />)
    expect(screen.getByRole('link', { name: 'Example' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'GitHub' })).not.toBeInTheDocument()
  })

  test('renders language tiles and handles click events', () => {
    render(<CardModal {...mockProps} />)
    
    const langTiles = screen.getAllByTestId('lang-tile')
    expect(langTiles).toHaveLength(3)
    expect(langTiles[0]).toHaveTextContent('JavaScript')
    expect(langTiles[1]).toHaveTextContent('React')
    expect(langTiles[2]).toHaveTextContent('Node.js')
    
    // Test backdrop click
    const backdrop = screen.getByText('Test Project').closest('.fixed')
    fireEvent.click(backdrop)
    expect(mockProps.onClose).toHaveBeenCalledTimes(1)
    
    // Test modal content click (should not close)
    const modalContent = screen.getByText('Test Project').closest('div')
    fireEvent.click(modalContent)
    expect(mockProps.onClose).toHaveBeenCalledTimes(1) // Still 1, not 2
  })

  test('has correct styling and structure', () => {
    render(<CardModal {...mockProps} />)
    
    const modal = screen.getByText('Test Project').closest('.relative')
    expect(modal).toHaveClass('relative', 'bg-gradient-to-b', 'from-stone-700', 'to-zinc-900', 'rounded-lg', 'overflow-y-auto', 'transform', 'transition-all', 'duration-300', 'ease-in-out', 'scale-95', 'opacity-0')
    expect(modal).toHaveStyle({
      width: '80vw',
      height: '80vh',
      maxWidth: '800px',
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column'
    })
    
    const backdrop = screen.getByText('Test Project').closest('.fixed')
    expect(backdrop).toHaveClass('fixed', 'inset-0', 'z-50', 'flex', 'items-center', 'justify-center', 'transition-opacity', 'duration-300', 'ease-in-out', 'bg-black', 'bg-opacity-50')
    
    const imageSection = screen.getByAltText('Test Project').closest('div')
    expect(imageSection).toHaveClass('relative', 'w-full', 'h-2/5')
    
    const contentSection = screen.getByText('A test project description').closest('.flex-1')
    expect(contentSection).toHaveClass('flex-1', 'p-6', 'pt-10')
    
    const descriptionContainer = screen.getByText('A test project description').closest('.bg-gradient-to-b')
    expect(descriptionContainer).toHaveClass('bg-gradient-to-b', 'from-slate-700', 'to-gray-700', 'p-5', 'rounded-lg', 'shadow-lg', 'text-white', 'text-lg', 'leading-relaxed')
    
    const closeButton = screen.getByText('✕')
    expect(closeButton).toHaveClass('absolute', 'top-3', 'right-3', 'bg-gray-800', 'text-white', 'px-3', 'py-1', 'rounded-full', 'hover:bg-gray-700', 'transition')
  })

  test('handles edge cases gracefully', () => {
    const { rerender } = render(<CardModal {...mockProps} languages={[]} />)
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.queryByTestId('lang-tile')).not.toBeInTheDocument()
    
    rerender(<CardModal {...mockProps} languages={undefined} />)
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.queryByTestId('lang-tile')).not.toBeInTheDocument()
    
    rerender(<CardModal {...mockProps} description="" />)
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    
    rerender(<CardModal {...mockProps} description={undefined} />)
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })
})
