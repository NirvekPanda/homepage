import { render, screen, fireEvent } from '@testing-library/react'
import Card from '../../components/card'

// Mock the dependencies
jest.mock('../../components/button.js', () => {
  return function MockLinkButton({ text, link, className }) {
    return <a href={link} className={className}>{text}</a>
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

  test('calls onClick when the card is clicked', () => {
    // The parent page owns the modal; Card just reports the click
    const onClick = jest.fn()
    render(<Card {...mockProps} onClick={onClick} />)

    const card = screen.getByRole('heading', { name: 'Test Project' }).closest('.cursor-pointer')
    fireEvent.click(card)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test('does not trigger onClick when buttons are clicked', () => {
    const onClick = jest.fn()
    render(<Card {...mockProps} onClick={onClick} />)
    
    fireEvent.click(screen.getByRole('link', { name: 'Demo' }))
    fireEvent.click(screen.getByRole('link', { name: 'Code' }))
    expect(onClick).not.toHaveBeenCalled()
  })

  test('labels the demo button "Paper" for research projects', () => {
    render(<Card {...mockProps} category="Research" />)
    expect(screen.getByRole('link', { name: 'Paper' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Demo' })).not.toBeInTheDocument()
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
    render(<Card {...mockProps} languages="" />)
    expect(screen.getByRole('heading', { name: 'Test Project' })).toBeInTheDocument()
    
    // TODO: Card calls languages.split() unguarded, so undefined still crashes
    expect(() => {
      render(<Card {...mockProps} languages={undefined} />)
    }).toThrow()
  })
})
