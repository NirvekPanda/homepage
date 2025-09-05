import { render, screen, fireEvent } from '@testing-library/react'
import Card from '../../components/card'

// Mock the dependencies
jest.mock('../../components/button.js', () => {
  return function MockLinkButton({ text, link, className }) {
    return <a href={link} className={className}>{text}</a>
  }
})

jest.mock('../../components/cardModal.js', () => {
  return function MockCardModal({ isOpen, onClose, name, description, languages }) {
    if (!isOpen) return null
    return (
      <div data-testid="card-modal">
        <h2>{name}</h2>
        <p>{description}</p>
        <div>Languages: {languages?.join(', ')}</div>
        <button onClick={onClose}>Close</button>
      </div>
    )
  }
})

jest.mock('../../components/langTile.js', () => {
  return function MockLanguageTile({ language }) {
    return <span data-testid="lang-tile">{language}</span>
  }
})

jest.mock('../../utils/imageUtils.js', () => ({
  getProjectImageSrc: (image, name) => image || `/project-images/${name?.toLowerCase().replace(/\s+/g, '-')}.jpg`
}))

describe('Card Component', () => {
  const mockProps = {
    name: 'Test Project',
    description: 'A test project description',
    languages: 'JavaScript, React, Node.js',
    image: 'test-image.jpg',
    link: 'https://example.com',
    date: '2024-01-01',
    code: true,
    github: 'https://github.com/test',
    demo: true
  }

  test('renders project information and buttons', () => {
    render(<Card {...mockProps} />)
    
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.getByAltText('Test Project')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Demo' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Code' })).toBeInTheDocument()
  })

  test('conditionally renders buttons based on props', () => {
    const { rerender } = render(<Card {...mockProps} demo={false} />)
    expect(screen.queryByRole('link', { name: 'Demo' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Code' })).toBeInTheDocument()
    
    rerender(<Card {...mockProps} code={false} />)
    expect(screen.getByRole('link', { name: 'Demo' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Code' })).not.toBeInTheDocument()
  })

  test('renders language tiles and handles modal interactions', () => {
    render(<Card {...mockProps} />)
    
    const langTiles = screen.getAllByTestId('lang-tile')
    expect(langTiles).toHaveLength(3)
    expect(langTiles[0]).toHaveTextContent('JavaScript')
    expect(langTiles[1]).toHaveTextContent('React')
    expect(langTiles[2]).toHaveTextContent('Node.js')
    
    // Test modal opening
    const card = screen.getByRole('heading', { name: 'Test Project' }).closest('.cursor-pointer')
    fireEvent.click(card)
    
    expect(screen.getByTestId('card-modal')).toBeInTheDocument()
    expect(screen.getByText('A test project description')).toBeInTheDocument()
    
    // Test modal closing
    fireEvent.click(screen.getByText('Close'))
    expect(screen.queryByTestId('card-modal')).not.toBeInTheDocument()
  })

  test('prevents modal opening when buttons are clicked', () => {
    render(<Card {...mockProps} />)
    
    fireEvent.click(screen.getByRole('link', { name: 'Demo' }))
    expect(screen.queryByTestId('card-modal')).not.toBeInTheDocument()
  })

  test('handles image source and error fallback', () => {
    render(<Card {...mockProps} />)
    
    const image = screen.getByAltText('Test Project')
    expect(image).toHaveAttribute('src', 'test-image.jpg')
    expect(image).toHaveClass('object-cover', 'w-full', 'h-full')
    
    fireEvent.error(image)
    expect(image).toHaveAttribute('src', '/project-images/default.jpg')
  })

  test('handles edge cases gracefully', () => {
    const { rerender } = render(<Card {...mockProps} languages="" />)
    
    const langTiles = screen.getAllByTestId('lang-tile')
    expect(langTiles).toHaveLength(1)
    expect(langTiles[0]).toHaveTextContent('')
    
    expect(() => {
      render(<Card {...mockProps} languages={undefined} />)
    }).toThrow()
  })
})
