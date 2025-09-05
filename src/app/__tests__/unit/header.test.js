import { render, screen } from '@testing-library/react'
import Header from '../../components/header'

// Mock the Nav component
jest.mock('../../components/nav', () => {
  return function MockNav() {
    return <div data-testid="nav">Navigation</div>
  }
})

describe('Header Component', () => {
  test('renders header with title and subtitle', () => {
    render(<Header />)
    
    expect(screen.getByText('Nirvek Pandey')).toBeInTheDocument()
    expect(screen.getByText('Aspiring Network Engineer')).toBeInTheDocument()
  })

  test('has correct header structure and classes', () => {
    render(<Header />)
    
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('py-5', 'px-10')
    
    const title = screen.getByText('Nirvek Pandey')
    expect(title).toHaveClass('text-4xl', 'sm:text-5xl')
    
    const subtitle = screen.getByText('Aspiring Network Engineer')
    expect(subtitle).toHaveClass('text-xl', 'sm:text-2xl', 'cursor-pointer')
  })

  test('includes navigation component', () => {
    render(<Header />)
    expect(screen.getByTestId('nav')).toBeInTheDocument()
  })
})
